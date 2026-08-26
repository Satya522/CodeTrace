import { NextResponse } from "next/server";
import { ExecutionStep } from "@/frontend/types";
import fs from "fs";
import path from "path";

// Read the python_tracer.py script (ensure it exists at this path during runtime)
// Since this is a Next.js API route, it's safer to just hardcode or bundle the tracer.
// We will read it from process.cwd() or just embed it.
const TRACER_SCRIPT = `
import sys
import json
import io

class CodeTracer:
    def __init__(self):
        self.trace_data = []
        self.output_buffer = io.StringIO()
        self.original_stdout = sys.stdout
        sys.stdout = self.output_buffer

    def get_obj_id(self, obj):
        return f"obj_{id(obj)}"

    def serialize_value(self, val, current_heap, var_name):
        if isinstance(val, (int, float, str, bool, type(None))):
            return {"value": str(val), "isReference": False}
        elif isinstance(val, (list, tuple, dict, set)):
            obj_id = self.get_obj_id(val)
            
            try:
                if isinstance(val, (set, tuple)):
                    data_str = json.dumps(list(val))
                else:
                    data_str = json.dumps(val)
            except Exception:
                data_str = str(val)

            current_heap[obj_id] = {
                "id": obj_id,
                "type": type(val).__name__,
                "data": data_str,
                "isOrphaned": False,
                "address": obj_id,
                "referencedBy": [var_name],
                "structureKind": "generic"
            }
            return {"value": type(val).__name__, "isReference": True, "address": obj_id, "type": type(val).__name__}
        return {"value": str(val), "isReference": False}

    def trace_calls(self, frame, event, arg):
        if frame.f_code.co_filename != "main.py":
            return self.trace_calls

        if event in ["line", "call", "return"]:
            current_heap = {}
            stack_frames = []
            curr = frame
            
            while curr is not None:
                if curr.f_code.co_filename != "main.py":
                    break
                    
                variables = []
                for name, val in curr.f_locals.items():
                    if name.startswith("__") or name in ['sys', 'json', 'CodeTracer']:
                        continue
                    var_info = self.serialize_value(val, current_heap, name)
                    var_dict = {
                        "name": name,
                        "type": type(val).__name__,
                        "value": var_info["value"],
                        "isReference": var_info["isReference"]
                    }
                    if "address" in var_info:
                        var_dict["address"] = var_info["address"]
                    variables.append(var_dict)
                
                if curr.f_code.co_name == "<module>":
                    for name, val in curr.f_globals.items():
                        if name not in curr.f_locals and not name.startswith("__") and name not in ['sys', 'json', 'CodeTracer', 'main']:
                            if type(val).__name__ in ['function', 'module']:
                                continue
                            var_info = self.serialize_value(val, current_heap, name)
                            var_dict = {
                                "name": name,
                                "type": type(val).__name__,
                                "value": var_info["value"],
                                "isReference": var_info["isReference"]
                            }
                            if "address" in var_info:
                                var_dict["address"] = var_info["address"]
                            variables.append(var_dict)

                stack_frame = {
                    "id": f"frame_{curr.f_code.co_name}_{id(curr)}",
                    "name": curr.f_code.co_name,
                    "variables": variables
                }
                
                if curr.f_back and curr.f_back.f_code.co_filename == "main.py":
                    stack_frame["parentCallId"] = f"frame_{curr.f_back.f_code.co_name}_{id(curr.f_back)}"
                    
                stack_frames.append(stack_frame)
                curr = curr.f_back

            current_stdout = self.output_buffer.getvalue()
            self.output_buffer.truncate(0)
            self.output_buffer.seek(0)

            if event == "return":
                ret_info = self.serialize_value(arg, current_heap, "return")
                if stack_frames:
                    stack_frames[0]["returnValue"] = ret_info["value"]

            self.trace_data.append({
                "step": len(self.trace_data) + 1,
                "line": frame.f_lineno,
                "explanation": {"en": f"Executed line {frame.f_lineno}", "hi": f"लाइन {frame.f_lineno} निष्पादित की गई"},
                "stack": stack_frames,
                "heap": list(current_heap.values()),
                "consoleOutput": current_stdout if current_stdout else None,
                "counters": {"comparisons": 0, "swaps": 0, "arrayAccesses": 0, "recursiveCalls": 0},
                "mode": "real",
                "systemLog": ""
            })
            
        return self.trace_calls

    def run(self, code):
        try:
            compiled_code = compile(code, "main.py", "exec")
            sys.settrace(self.trace_calls)
            exec(compiled_code, {"__name__": "__main__"})
        except Exception as e:
            self.trace_data.append({
                "step": len(self.trace_data) + 1,
                "line": 1,
                "explanation": {"en": f"Runtime Error: {str(e)}", "hi": f"रनटाइम त्रुटि: {str(e)}"},
                "stack": [],
                "heap": [],
                "consoleOutput": f"Error: {str(e)}",
                "counters": {"comparisons": 0, "swaps": 0, "arrayAccesses": 0, "recursiveCalls": 0},
                "mode": "real",
                "error": str(e),
                "systemLog": f"Runtime Error: {str(e)}"
            })
        finally:
            sys.settrace(None)
            sys.stdout = self.original_stdout
            
        print(json.dumps(self.trace_data))

if __name__ == "__main__":
    with open("main.py", "r") as f:
        user_code = f.read()
    
    tracer = CodeTracer()
    tracer.run(user_code)
`;

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
    }

    if (language.toLowerCase() !== "python") {
      return NextResponse.json({ error: "Real Trace Engine currently only supports Python." }, { status: 400 });
    }

    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    // Save tracer and user code to temp files
    const tempDir = path.join(process.cwd(), '.temp_trace');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const tracerPath = path.join(tempDir, 'tracer.py');
    const mainPath = path.join(tempDir, 'main.py');

    fs.writeFileSync(tracerPath, TRACER_SCRIPT);
    fs.writeFileSync(mainPath, code);

    // Execute the tracer script
    try {
      const { stdout, stderr } = await execPromise(`python ${tracerPath}`, { cwd: tempDir, timeout: 5000 });
      
      if (stderr && !stdout) {
         return NextResponse.json({ error: stderr }, { status: 500 });
      }

      const rawOutput = stdout.trim();
      try {
        let traceSteps;
        try {
            traceSteps = JSON.parse(rawOutput);
        } catch (e) {
            const lines = rawOutput.split(/\r?\n/);
            const jsonStr = lines[lines.length - 1];
            traceSteps = JSON.parse(jsonStr);
        }

        // HYBRID ENGINE: Enhance trace with AI explanations if API key is present
        const API_KEY = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "";
        if (API_KEY && traceSteps.length > 0) {
            try {
                const { default: Groq } = await import("groq-sdk");
                const groq = new Groq({ apiKey: API_KEY });
                
                // Create a lightweight version of the trace for the LLM to understand context
                const lightTrace = traceSteps.map((step: any) => ({
                    step: step.step,
                    line: step.line,
                    variables: step.stack[0]?.variables || []
                }));

                const prompt = `You are an expert execution trace simulator. I have executed a ${language} program and here is the exact variable state at each step:
${JSON.stringify(lightTrace)}

Generate a JSON array of objects with the exact same 'step' numbers, providing a rich, tutor-like explanation for what happened at that step.
Format: [{ "step": 1, "en": "Variable i is initialized to 0.", "hi": "चर i को 0 पर इनिशियलाइज़ किया गया है।" }]
Output ONLY valid JSON. No markdown, no reasoning.`;

                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "qwen/qwen3.6-27b",
                    temperature: 0,
                });

                let aiText = completion.choices[0]?.message?.content || "";
                if (aiText.includes("</think>")) aiText = aiText.split("</think>")[1].trim();
                if (aiText.startsWith('\`\`\`')) aiText = aiText.replace(/^\s*```[a-z]*\n/i, "").replace(/```\s*$/i, "").trim();

                const aiExplanations = JSON.parse(aiText);
                
                // Merge explanations back into the real trace
                for (const aiExp of aiExplanations) {
                    const stepToUpdate = traceSteps.find((s: any) => s.step === aiExp.step);
                    if (stepToUpdate) {
                        stepToUpdate.explanation = { en: aiExp.en, hi: aiExp.hi };
                    }
                }
            } catch (aiErr) {
                console.error("AI explanation enhancement failed:", aiErr);
                // Fallback to basic explanations gracefully
            }
        }

        return NextResponse.json({ steps: traceSteps });
      } catch (e) {
        console.error("Failed to parse trace JSON:", rawOutput);
        return NextResponse.json({ error: "Failed to parse execution trace.", rawOutput }, { status: 500 });
      }

    } catch (execError: any) {
       return NextResponse.json({ error: execError.message || "Execution failed", rawOutput: execError.stdout }, { status: 500 });
    } finally {
       try {
         if (fs.existsSync(tracerPath)) fs.unlinkSync(tracerPath);
         if (fs.existsSync(mainPath)) fs.unlinkSync(mainPath);
       } catch (cleanupErr) {
         console.error("Cleanup error:", cleanupErr);
       }
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


