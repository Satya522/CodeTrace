import { ExecutionTrace, ExecutionStep } from "@/frontend/types";

export async function runTraceEngine(code: string, language: string): Promise<ExecutionTrace> {
  try {
    const traceRes = await fetch("/api/trace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    if (!traceRes.ok) {
      const errorData = await traceRes.json();
      throw new Error(errorData.error || "Execution trace failed");
    }

    const traceData = await traceRes.json();
    return { steps: traceData.steps, language, mode: "live" };
  } catch (error: any) {
    return { steps: [], error: error.message, language, mode: "live" };
  }
}
