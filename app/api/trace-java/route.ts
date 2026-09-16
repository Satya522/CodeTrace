import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ─── Configuration ───
const JAVAC_PATH = "javac";
const JAVA_PATH = "java";
const TEMP_DIR = path.join(process.cwd(), ".temp_trace");
const JAVA_TIMEOUT = 30000; // 30 seconds (JVM startup is slow)

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

// ─── Java Tracer Source ───
// This Java class wraps user code and instruments it using the JDI-free approach:
// We compile the user code, then run it via a custom Java agent that uses 
// JDWP (Java Debug Wire Protocol) to step through it.
//
// SIMPLER APPROACH: We use a "source-level instrumentation" technique.
// We parse the Java source, inject print statements at each line using
// a preprocessor, and then parse the output.

function generateTracerWrapper(userCode: string, className: string, sessionId: string): string {
  // We create a wrapper that uses Thread + debug hooks
  // The simplest robust approach: compile and run with JDWP, then connect via a tracer.
  // But even simpler: use Java's built-in StackWalker API + a line-by-line execution logger.
  
  // APPROACH: Source-level instrumentation
  // We inject `__trace(lineNum)` calls before each statement in main and user methods.
  // This is simpler and more reliable than JDB.
  
  return `
import java.util.*;
import java.lang.reflect.*;

public class __Tracer {
    static List<String> steps = new ArrayList<>();
    static int stepCount = 0;
    static int comparisons = 0;
    static int swaps = 0;
    static int arrayAccesses = 0;
    static int recursiveCalls = 0;
    static StringBuilder consoleOutput = new StringBuilder();
    static Set<String> activeFunctions = new HashSet<>();
    static java.io.PrintStream traceOut; // dedicated channel for trace output
    static java.io.PrintStream userOut;  // user's original stdout
    
    static {
        // Save original stdout for trace output
        traceOut = System.out;
        userOut = System.out;
        // Redirect System.out to stderr so user prints don't mix with trace
        System.setOut(System.err);
    }
    
    public static void trace(int line, String funcName, String... varPairs) {
        stepCount++;
        StringBuilder sb = new StringBuilder();
        sb.append("===STEP===");
        sb.append("line:").append(line).append("|");
        sb.append("func:").append(funcName).append("|");
        sb.append("comparisons:").append(comparisons).append("|");
        sb.append("swaps:").append(swaps).append("|");
        sb.append("arrayAccesses:").append(arrayAccesses).append("|");
        sb.append("recursiveCalls:").append(recursiveCalls).append("|");
        
        // Variables
        sb.append("vars:");
        for (int i = 0; i < varPairs.length; i += 3) {
            if (i > 0) sb.append(",");
            sb.append(varPairs[i]).append("=").append(varPairs[i+1]).append(":").append(varPairs[i+2]);
        }
        sb.append("|");
        
        // Stack trace
        sb.append("stack:");
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        boolean first = true;
        for (StackTraceElement el : stackTrace) {
            String cn = el.getClassName();
            if (cn.equals("__Tracer") || cn.equals("java.lang.Thread")) continue;
            if (!first) sb.append(",");
            sb.append(el.getMethodName()).append("@").append(el.getLineNumber());
            first = false;
        }
        
        traceOut.println(sb.toString()); // Write to original stdout (not redirected)
    }
    
    public static void incComparisons() { comparisons++; }
    public static void incSwaps() { swaps++; }
    public static void incArrayAccess() { arrayAccesses++; }
    public static void incRecursion() { recursiveCalls++; }
    
    public static String arrToString(int[] arr) {
        return Arrays.toString(arr);
    }
    
    public static String arrToString(double[] arr) {
        return Arrays.toString(arr);
    }
    
    public static String arrToString(String[] arr) {
        return Arrays.toString(arr);
    }
    
    public static String arrToString(Object obj) {
        if (obj == null) return "null";
        if (obj.getClass().isArray()) {
            if (obj instanceof int[]) return Arrays.toString((int[])obj);
            if (obj instanceof double[]) return Arrays.toString((double[])obj);
            if (obj instanceof String[]) return Arrays.toString((String[])obj);
            return Arrays.deepToString((Object[])obj);
        }
        return obj.toString();
    }
}
`;
}

// ─── Parser ───

function parseJavaOutput(rawOutput: string, sourceCode: string): TraceStep[] {
  const steps: TraceStep[] = [];
  const lines = rawOutput.split("\n");
  const sourceLines = sourceCode.split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("===STEP===")) continue;
    
    const payload = trimmed.substring("===STEP===".length);
    const parts: Record<string, string> = {};
    
    for (const part of payload.split("|")) {
      const colonIdx = part.indexOf(":");
      if (colonIdx > 0) {
        parts[part.substring(0, colonIdx)] = part.substring(colonIdx + 1);
      }
    }
    
    const lineNum = parseInt(parts["line"] || "0", 10);
    const funcName = parts["func"] || "main";
    const comparisons = parseInt(parts["comparisons"] || "0", 10);
    const swapsCount = parseInt(parts["swaps"] || "0", 10);
    const arrayAccesses = parseInt(parts["arrayAccesses"] || "0", 10);
    const recursiveCalls = parseInt(parts["recursiveCalls"] || "0", 10);
    
    // Parse variables
    const variables: TraceVariable[] = [];
    const varsStr = parts["vars"] || "";
    if (varsStr) {
      for (const varEntry of varsStr.split(",")) {
        const eqIdx = varEntry.indexOf("=");
        if (eqIdx <= 0) continue;
        const name = varEntry.substring(0, eqIdx);
        const rest = varEntry.substring(eqIdx + 1);
        const colonIdx = rest.lastIndexOf(":");
        
        let value = rest;
        let type = "int";
        if (colonIdx > 0) {
          value = rest.substring(0, colonIdx);
          type = rest.substring(colonIdx + 1);
        }
        
        const isReference = type === "array" || type === "object" || type === "String" || value.startsWith("[");
        
        variables.push({
          name,
          type,
          value,
          isReference,
        });
      }
    }
    
    // Parse stack
    const stackStr = parts["stack"] || "";
    const stackFrames: TraceStackFrame[] = [];
    if (stackStr) {
      const frames = stackStr.split(",");
      const funcCounts: Record<string, number> = {};
      
      for (let i = 0; i < frames.length; i++) {
        const [fname, lineStr] = frames[i].split("@");
        funcCounts[fname] = (funcCounts[fname] || 0) + 1;
      }
      
      for (let i = 0; i < frames.length; i++) {
        const [fname] = frames[i].split("@");
        const isRecursive = funcCounts[fname] > 1;
        
        stackFrames.push({
          id: `frame_${fname}_${i}`,
          name: fname === "<module>" ? "global" : fname,
          variables: i === 0 ? variables : [],
          isRecursiveCall: isRecursive,
          ...(i > 0 ? { parentCallId: `frame_${frames[i-1].split("@")[0]}_${i-1}` } : {}),
        });
      }
    } else {
      stackFrames.push({
        id: "frame_main_0",
        name: funcName,
        variables,
      });
    }
    
    steps.push({
      step: steps.length + 1,
      line: lineNum,
      stack: stackFrames,
      heap: [],
      counters: { comparisons, swaps: swapsCount, recursiveCalls, arrayAccesses },
      systemLog: "",
    });
  }
  
  // Extract console output (lines that are NOT ===STEP===)
  const consoleLines = lines.filter(l => !l.trim().startsWith("===STEP===") && l.trim());
  if (consoleLines.length > 0 && steps.length > 0) {
    steps[steps.length - 1].consoleOutput = consoleLines.join("\n");
  }
  
  return steps;
}

// ─── Source Instrumentor ───
// This is the key innovation: we parse the Java source and inject __Tracer.trace() calls.
// This avoids the need for JDB entirely.

function instrumentJavaSource(code: string): { instrumentedCode: string; className: string } {
  const lines = code.split("\n");
  
  // Find the class name
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : "Main";
  
  // We need to add import and make __Tracer available.
  // Strategy: Don't modify the user's class. Instead, we create a runner that:
  // 1. Compiles the user code alongside __Tracer
  // 2. The user code calls __Tracer methods manually (we inject them)
  
  // Simple approach: inject trace calls before every statement-like line in the source
  const instrumentedLines: string[] = [];
  let inMethod = false;
  let methodName = "main";
  let braceDepth = 0;
  const varTracker: Map<string, { type: string }> = new Map();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Track method entry
    const methodMatch = trimmed.match(/(?:public|private|protected|static|\s)*\s+(?:void|int|long|double|float|boolean|char|String|byte|short|int\[\]|double\[\]|String\[\]|\w+)\s+(\w+)\s*\(/);
    if (methodMatch && !trimmed.startsWith("//") && !trimmed.startsWith("/*")) {
      methodName = methodMatch[1];
      inMethod = true;
      varTracker.clear();
    }
    
    // Track braces
    for (const ch of trimmed) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
    
    // Skip non-executable lines
    const isExecutable = inMethod && 
      !trimmed.startsWith("//") && 
      !trimmed.startsWith("/*") && 
      !trimmed.startsWith("*") && 
      trimmed !== "" && 
      trimmed !== "{" && 
      trimmed !== "}" &&
      !trimmed.startsWith("import ") &&
      !trimmed.startsWith("package ") &&
      !trimmed.startsWith("public class") &&
      !trimmed.startsWith("class ") &&
      !trimmed.match(/^\s*(public|private|protected|static|\s)*\s+(void|int|long|double|float|boolean|char|String|byte|short)\s+\w+\s*\(/) &&
      !trimmed.startsWith("public static void main");
    
    // Track variable declarations — do this BEFORE emitting the line
    // so we know what was just declared on this line
    const declMatch = trimmed.match(/^(int|long|double|float|boolean|char|String|byte|short)\s+(\w+)\s*[=;]/);
    const arrDeclMatch = trimmed.match(/^(int|double|String|float|long)\[\]\s+(\w+)\s*[=;]/);
    
    // Is this a control-flow terminating line? (return/break/continue/throw)
    const isTerminating = /^\s*(return\b|break\b|continue\b|throw\b)/.test(trimmed);
    
    // For terminating lines, inject trace BEFORE the line
    if (isExecutable && braceDepth > 0 && isTerminating) {
      // Counter increments before the line
      if (/\b(if|while|for)\b/.test(trimmed) && /[<>=!]/.test(trimmed)) {
        instrumentedLines.push(`${getIndent(line)}__Tracer.incComparisons();`);
      }
      
      const varArgs: string[] = [];
      for (const [name, info] of varTracker) {
        if (info.type.endsWith("[]")) {
          varArgs.push(`"${name}", __Tracer.arrToString(${name}), "array"`);
        } else {
          varArgs.push(`"${name}", String.valueOf(${name}), "${info.type}"`);
        }
      }
      const traceCall = `${getIndent(line)}__Tracer.trace(${lineNum}, "${methodName}"${varArgs.length > 0 ? ", " + varArgs.join(", ") : ""});`;
      instrumentedLines.push(traceCall);
      
      // Then emit the original line
      instrumentedLines.push(line);
    } else {
      // For non-terminating lines: emit source line FIRST, then trace after
      instrumentedLines.push(line);
      
      // Track declarations after the line
      if (declMatch) {
        varTracker.set(declMatch[2], { type: declMatch[1] });
      }
      if (arrDeclMatch) {
        varTracker.set(arrDeclMatch[2], { type: arrDeclMatch[1] + "[]" });
      }
      
      // Detect heuristic counters AFTER the line
      if (isExecutable) {
        if (/\b(if|while|for)\b/.test(trimmed) && /[<>=!]/.test(trimmed)) {
          instrumentedLines.push(`${getIndent(line)}__Tracer.incComparisons();`);
        }
        if (/\btemp\b|\bswap\b/.test(trimmed)) {
          instrumentedLines.push(`${getIndent(line)}__Tracer.incSwaps();`);
        }
        if (/\w+\[/.test(trimmed) && !arrDeclMatch) {
          instrumentedLines.push(`${getIndent(line)}__Tracer.incArrayAccess();`);
        }
      }
      
      // Build variable snapshot for trace call AFTER the line (so variables are declared)
      if (isExecutable && braceDepth > 0) {
        const varArgs: string[] = [];
        for (const [name, info] of varTracker) {
          if (info.type.endsWith("[]")) {
            varArgs.push(`"${name}", __Tracer.arrToString(${name}), "array"`);
          } else {
            varArgs.push(`"${name}", String.valueOf(${name}), "${info.type}"`);
          }
        }
        const traceCall = `${getIndent(line)}__Tracer.trace(${lineNum}, "${methodName}"${varArgs.length > 0 ? ", " + varArgs.join(", ") : ""});`;
        instrumentedLines.push(traceCall);
      }
    }
  }
  
  return { instrumentedCode: instrumentedLines.join("\n"), className };
}

function getIndent(line: string): string {
  const match = line.match(/^(\s*)/);
  return match ? match[1] : "";
}

// ─── Recursion Detection ───
// Check if a method calls itself in the source code
function detectRecursiveMethods(code: string): Set<string> {
  const recursive = new Set<string>();
  const methods = code.matchAll(/(?:public|private|protected|static|\s)*\s+(?:void|int|long|double|float|boolean|char|String|\w+)\s+(\w+)\s*\([^)]*\)\s*\{/g);
  
  for (const match of methods) {
    const methodName = match[1];
    // Check if the method body calls itself
    const methodStart = (match.index || 0) + match[0].length;
    let depth = 1;
    let pos = methodStart;
    while (pos < code.length && depth > 0) {
      if (code[pos] === '{') depth++;
      if (code[pos] === '}') depth--;
      pos++;
    }
    const methodBody = code.substring(methodStart, pos);
    if (methodBody.includes(methodName + "(")) {
      recursive.add(methodName);
    }
  }
  
  return recursive;
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

    // Extract class name from source
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : "Main";

    // Instrument the source code
    const { instrumentedCode } = instrumentJavaSource(code);
    
    // Detect recursive methods and add instrumentation
    const recursiveMethods = detectRecursiveMethods(code);
    let finalInstrumented = instrumentedCode;
    for (const methodName of recursiveMethods) {
      // Add recursion counter increment at method entry
      const methodPattern = new RegExp(`((?:public|private|protected|static|\\s)*\\s+(?:void|int|long|double|float|boolean|char|String|\\w+)\\s+${methodName}\\s*\\([^)]*\\)\\s*\\{)`, 'g');
      finalInstrumented = finalInstrumented.replace(methodPattern, `$1\n        __Tracer.incRecursion();`);
    }

    // Write files
    const userSrcPath = path.join(sessionDir, `${className}.java`);
    const tracerSrcPath = path.join(sessionDir, "__Tracer.java");

    fs.writeFileSync(userSrcPath, finalInstrumented, "utf-8");
    fs.writeFileSync(tracerSrcPath, generateTracerWrapper(code, className, sessionId), "utf-8");

    // 1. Compile both files
    try {
      execSync(`"${JAVAC_PATH}" -g "${className}.java" "__Tracer.java" 2>&1`, {
        timeout: 15000,
        cwd: sessionDir,
      });
    } catch (compileError: any) {
      const stderr = compileError.stdout?.toString() || compileError.stderr?.toString() || compileError.message;
      // Try to give a clean error by showing original line numbers
      const cleanError = stderr
        .replace(new RegExp(className + "\\.java", "g"), "code.java")
        .replace(/__Tracer\.\w+\([^)]*\);\s*\n?/g, ""); // Remove our injected lines from error
      return NextResponse.json({
        ok: false,
        error: `Compilation Error:\n${cleanError}`,
      }, { status: 400 });
    }

    // 2. Run the compiled program
    // stdout = trace data (===STEP=== lines), stderr = user's System.out (redirected)
    let javaOutput: string;
    let userConsoleOutput: string = "";
    try {
      const result = execSync(
        `"${JAVA_PATH}" -cp "${sessionDir}" ${className}`,
        {
          timeout: JAVA_TIMEOUT,
          cwd: sessionDir,
          maxBuffer: 10 * 1024 * 1024,
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );
      javaOutput = result.toString();
    } catch (runError: any) {
      const stdout = runError.stdout?.toString() || "";
      const stderr = runError.stderr?.toString() || "";
      userConsoleOutput = stderr;
      if (stdout.includes("===STEP===")) {
        javaOutput = stdout;
      } else {
        return NextResponse.json({
          ok: false,
          error: `Runtime Error:\n${stderr || stdout || runError.message}`,
        }, { status: 500 });
      }
    }

    // Also capture stderr from successful runs
    // execSync doesn't give us stderr on success with default options, so we use a workaround:
    // Pipe stderr to a temp file
    // For now, parse console output from non-STEP lines
    
    // 3. Parse the output
    const steps = parseJavaOutput(javaOutput, code);

    if (steps.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "No execution steps captured. The program may have failed to start or exited immediately.",
      }, { status: 500 });
    }

    // Add user console output to last step if available
    if (userConsoleOutput && steps.length > 0) {
      steps[steps.length - 1].consoleOutput = userConsoleOutput.trim();
    }

    return NextResponse.json({ ok: true, steps });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Cleanup
    try {
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
