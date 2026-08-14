import { ExecutionTrace, ExecutionStep } from "@/frontend/types";

export async function runPistonTrace(code: string, language: string): Promise<ExecutionTrace> {
  try {
    // 1. Run the code via Piston to get the real stdout/stderr
    const pistonRes = await fetch("/api/execute-piston", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    if (!pistonRes.ok) {
      const errorData = await pistonRes.json();
      throw new Error(errorData.error || "Piston execution failed");
    }

    const pistonData = await pistonRes.json();
    const stdout = pistonData.stdout;
    const stderr = pistonData.stderr;
    
    if (stderr && !stdout) {
      return { steps: [], error: `Execution Error:\n${stderr}`, language, mode: "simulated" };
    }

    // 2. Ask Gemini to simulate the memory trace based on the code and its real output
    const simRes = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, stdout }),
    });

    if (!simRes.ok) {
      const errorData = await simRes.json();
      throw new Error(errorData.error || "Simulation failed");
    }

    const simData = await simRes.json();
    return { steps: simData.steps, language, mode: "simulated" };
  } catch (error: any) {
    return { steps: [], error: error.message, language, mode: "simulated" };
  }
}
