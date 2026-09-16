import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ─── Configuration ───
const GPP_PATH = "g++";
const GDB_PATH = "gdb";
const TEMP_DIR = path.join(process.cwd(), ".temp_trace");
const MAX_STEPS = 1500; // Max steps to generate in GDB script
const GDB_TIMEOUT = 15000; // 15 seconds

// ─── Types ───
interface TraceVariable {
  name: string;
  type: string;
  value: string;
  isReference: boolean;
  address?: string;
}

interface TraceStackFrame {
  id: string;
  name: string;
  variables: TraceVariable[];
  parentCallId?: string;
  returnValue?: string;
  isRecursiveCall?: boolean;
}

interface TraceStep {
  step: number;
  line: number;
  stack: TraceStackFrame[];
  heap: any[];
  counters: { comparisons: number; swaps: number; recursiveCalls: number; arrayAccesses: number };
  systemLog: string;
  consoleOutput?: string;
}

// ─── GDB Output Parser ───

function parseGdbLocals(block: string): TraceVariable[] {
  const vars: TraceVariable[] = [];
  const lines = block.split("\n");

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed === "No locals." || trimmed === "No arguments." || trimmed === "No symbol table info available.") continue;

    // Match: varname = value
    const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (!match) continue;

    const name = match[1];
    let value = match[2].trim();
    let type = "int";
    let isReference = false;
    let address: string | undefined;

    // Detect arrays: {64, 34, 25, 12, 22}
    if (value.startsWith("{") && value.endsWith("}")) {
      type = "array";
      value = "[" + value.slice(1, -1) + "]";
    }
    // Detect pointers: 0x1234 or (TYPE *) 0x1234
    else if (/^0x[0-9a-fA-F]+/.test(value) || /^\(.*\*\)\s*0x/.test(value)) {
      type = "pointer";
      isReference = true;
      const addrMatch = value.match(/(0x[0-9a-fA-F]+)/);
      if (addrMatch) address = addrMatch[1];
    }
    // Detect strings
    else if (value.startsWith('"') || (value.startsWith("'") && value.length <= 4)) {
      type = value.startsWith('"') ? "string" : "char";
    }
    // Detect numbers
    else if (/^-?\d+(\.\d+)?$/.test(value)) {
      type = value.includes(".") ? "double" : "int";
    }
    // Detect booleans
    else if (value === "true" || value === "false") {
      type = "bool";
    }

    vars.push({ name, type, value, isReference, ...(address ? { address } : {}) });
  }

  return vars;
}

function parseGdbBacktrace(btBlock: string): { funcName: string; line: number }[] {
  const frames: { funcName: string; line: number }[] = [];
  const lines = btBlock.split("\n");

  for (const line of lines) {
    // Match: #0  bubbleSort (...) at test.cpp:5
    // Match: #1  0x00401234 in main () at test.cpp:19
    const match = line.match(/#(\d+)\s+(?:0x[0-9a-fA-F]+\s+in\s+)?(\w+)\s*\(.*?\)\s+at\s+.*:(\d+)/);
    if (match) {
      frames.push({
        funcName: match[2],
        line: parseInt(match[3], 10),
      });
    }
  }

  return frames;
}

function parseGdbOutput(rawOutput: string, sourceCode: string): TraceStep[] {
  const steps: TraceStep[] = [];
  const sourceLines = sourceCode.split("\n");

  // Split output by our step markers
  const sections = rawOutput.split("===STEP_MARKER===");

  // Track function calls for recursion detection
  const functionCallCounts: Record<string, number> = {};
  const seenFunctions = new Set<string>();

  for (let i = 1; i < sections.length; i++) { // Start from 1 (skip preamble)
    const section = sections[i];
    if (!section.trim()) continue;

    // If program has exited, stop parsing
    if (section.includes("Program exited") || section.includes("Inferior") || section.includes("not being run")) {
      break;
    }

    // Extract current line from GDB output
    // Pattern: "#0  main () at user_code.cpp:17\n17\t    int arr[]..."
    let currentLine = 0;

    // Method 1: From "frame" output — #0 funcName (...) at file:LINE
    const frameMatch = section.match(/#0\s+\w+\s*\(.*?\)\s+at\s+.*:(\d+)/);
    if (frameMatch) {
      currentLine = parseInt(frameMatch[1], 10);
    }

    // Method 2: From source line display — "17\t    int arr[]..."
    if (currentLine === 0) {
      const lineMatch = section.match(/^(\d+)\t/m);
      if (lineMatch) {
        currentLine = parseInt(lineMatch[1], 10);
      }
    }

    if (currentLine === 0) continue;

    // Parse locals
    const localsMatch = section.match(/===LOCALS_START===([\s\S]*?)===LOCALS_END===/);
    const argsMatch = section.match(/===ARGS_START===([\s\S]*?)===ARGS_END===/);
    const btMatch = section.match(/===BT_START===([\s\S]*?)===BT_END===/);

    const localVars = localsMatch ? parseGdbLocals(localsMatch[1]) : [];
    const argVars = argsMatch ? parseGdbLocals(argsMatch[1]) : [];
    const allVars = [...argVars, ...localVars];

    // Parse backtrace
    const btFrames = btMatch ? parseGdbBacktrace(btMatch[1]) : [];

    // Build stack frames
    const stack: TraceStackFrame[] = [];

    if (btFrames.length > 0) {
      const topFunc = btFrames[0].funcName;
      
      // Track for recursion detection
      if (seenFunctions.has(topFunc)) {
        functionCallCounts[topFunc] = (functionCallCounts[topFunc] || 1) + 1;
      }
      seenFunctions.add(topFunc);

      for (let fi = 0; fi < btFrames.length; fi++) {
        const frame = btFrames[fi];

        // Count how many times this function appears in current backtrace
        const countInBt = btFrames.filter(f => f.funcName === frame.funcName).length;
        const isRecursiveCall = countInBt > 1;

        stack.push({
          id: `frame_${frame.funcName}_${fi}`,
          name: frame.funcName === "<module>" ? "global" : frame.funcName,
          variables: fi === 0 ? allVars : [], // Only top frame has detailed vars from info locals
          isRecursiveCall,
          ...(fi > 0 ? { parentCallId: `frame_${btFrames[fi - 1].funcName}_${fi - 1}` } : {}),
        });
      }
    } else {
      stack.push({
        id: "frame_main_0",
        name: "main",
        variables: allVars,
      });
    }

    // Detect counters heuristically from source line
    const srcLine = (currentLine > 0 && currentLine <= sourceLines.length) ? sourceLines[currentLine - 1] : "";
    const isComparison = /\b(if|while|for)\b/.test(srcLine) && /[<>=!]/.test(srcLine);
    const isSwap = /\btemp\b|\bswap\b/.test(srcLine);
    const isArrayAccess = /\w+\[/.test(srcLine);

    steps.push({
      step: steps.length + 1,
      line: currentLine,
      stack,
      heap: [],
      counters: {
        comparisons: isComparison ? 1 : 0,
        swaps: isSwap ? 1 : 0,
        recursiveCalls: 0,
        arrayAccesses: isArrayAccess ? 1 : 0,
      },
      systemLog: "",
    });
  }

  // Accumulate counters
  for (let i = 1; i < steps.length; i++) {
    steps[i].counters.comparisons += steps[i - 1].counters.comparisons;
    steps[i].counters.swaps += steps[i - 1].counters.swaps;
    steps[i].counters.arrayAccesses += steps[i - 1].counters.arrayAccesses;
    steps[i].counters.recursiveCalls += steps[i - 1].counters.recursiveCalls;
  }

  // Detect recursion in backtrace: count steps where the same function appears more than once
  for (const step of steps) {
    const funcNames = step.stack.map(f => f.name);
    const hasDuplicates = funcNames.length !== new Set(funcNames).size;
    if (hasDuplicates && step.step > 1) {
      step.counters.recursiveCalls = (steps[step.step - 2]?.counters.recursiveCalls || 0) + 1;
    }
  }

  return steps;
}

function generateGdbScript(maxSteps: number): string {
  // Generate explicit step+trace commands. GDB will simply error/stop when program exits.
  let script = `set pagination off
set print pretty off
set print array off
set print elements 200
set confirm off
set width 0
set height 0

define trace_step
  printf "===STEP_MARKER===\\n"
  frame
  printf "===LOCALS_START===\\n"
  info locals
  printf "===LOCALS_END===\\n"
  printf "===ARGS_START===\\n"
  info args
  printf "===ARGS_END===\\n"
  printf "===BT_START===\\n"
  backtrace
  printf "===BT_END===\\n"
end

break main
run

`;

  // Generate explicit step + trace_step pairs
  for (let i = 0; i < maxSteps; i++) {
    script += "trace_step\nstep\n";
  }
  script += "trace_step\n\nquit\n";

  return script;
}

// ─── Main API Route ───

export async function POST(req: Request) {
  const sessionId = crypto.randomBytes(8).toString("hex");
  const sessionDir = path.join(TEMP_DIR, sessionId);

  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ ok: false, error: "Code is required" }, { status: 400 });
    }

    if (code.length > 50000) {
      return NextResponse.json({ ok: false, error: "Code too long (max 50KB)" }, { status: 400 });
    }

    // Create session directory
    fs.mkdirSync(sessionDir, { recursive: true });

    const srcPath = path.join(sessionDir, "user_code.cpp");
    const exePath = path.join(sessionDir, "user_code.exe");
    const gdbScriptPath = path.join(sessionDir, "trace.gdb");

    // 1. Write user code to temp file
    fs.writeFileSync(srcPath, code, "utf-8");

    // 2. Compile with debug symbols
    try {
      execSync(`"${GPP_PATH}" -g -O0 -o "${exePath}" "${srcPath}" 2>&1`, {
        timeout: 10000,
        cwd: sessionDir,
      });
    } catch (compileError: any) {
      const stderr = compileError.stdout?.toString() || compileError.stderr?.toString() || compileError.message;
      const cleanError = stderr.replace(/user_code\.cpp/g, "code.cpp");
      return NextResponse.json({
        ok: false,
        error: `Compilation Error:\n${cleanError}`,
      }, { status: 400 });
    }

    // 3. Generate GDB batch script
    const gdbScript = generateGdbScript(MAX_STEPS);
    fs.writeFileSync(gdbScriptPath, gdbScript, "utf-8");

    // 4. Run GDB in batch mode
    let gdbOutput: string;
    try {
      gdbOutput = execSync(
        `"${GDB_PATH}" -batch -x "${gdbScriptPath}" "${exePath}" 2>&1`,
        {
          timeout: GDB_TIMEOUT,
          cwd: sessionDir,
          maxBuffer: 10 * 1024 * 1024, // 10MB
        }
      ).toString();
    } catch (gdbError: any) {
      // GDB may exit with non-zero if the program ends mid-script. That's OK.
      const output = gdbError.stdout?.toString() || gdbError.stderr?.toString() || "";
      if (output.includes("===STEP_MARKER===")) {
        gdbOutput = output;
      } else {
        return NextResponse.json({
          ok: false,
          error: "Runtime Error: Program crashed or timed out.",
        }, { status: 500 });
      }
    }

    // 5. Parse GDB output into ExecutionStep[]
    const steps = parseGdbOutput(gdbOutput, code);

    if (steps.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "No execution steps captured. The program may have exited immediately or failed to start.",
      }, { status: 500 });
    }

    // 6. Extract program stdout — anything printed by the actual program (between known GDB sections)
    // Look for output that appears after "run" and isn't GDB control output
    const programOutputLines: string[] = [];
    const gdbLines = gdbOutput.split("\n");
    for (const line of gdbLines) {
      const t = line.trim();
      // Skip GDB internal lines
      if (!t) continue;
      if (t.startsWith("===")) continue;
      if (t.startsWith("Breakpoint")) continue;
      if (t.startsWith("[")) continue;
      if (t.startsWith("#")) continue;
      if (t.startsWith("$")) continue;
      if (/^\d+\t/.test(t)) continue; // source lines
      if (t.startsWith("No locals") || t.startsWith("No arguments") || t.startsWith("No symbol")) continue;
      if (/^\w+\s*=\s*.+/.test(t)) continue; // variable lines
      if (t.includes("exited") || t.includes("Inferior") || t.includes("debugging session")) continue;
      if (t === "end") continue;
      if (t.startsWith("GNU gdb") || t.startsWith("Copyright") || t.startsWith("License") || t.startsWith("This GDB")) continue;
      if (t.startsWith("Reading symbols") || t.startsWith("done.") || t.startsWith("For bug")) continue;
      if (t.startsWith("error return")) continue;
      if (t.startsWith("Quit anyway")) continue;
      if (t.startsWith("set ") || t.startsWith("define ") || t.startsWith("break ") || t === "run") continue;

      // This looks like program output
      programOutputLines.push(t);
    }

    const programOutput = programOutputLines.join("\n").trim();
    if (programOutput && steps.length > 0) {
      steps[steps.length - 1].consoleOutput = programOutput;
    }

    return NextResponse.json({ ok: true, steps });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Cleanup temp files
    try {
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
