import type { ExecutionStep } from "@/frontend/types";

export async function runAITrace(code: string): Promise<{ steps: ExecutionStep[], error?: string }> {
  try {
    const res = await fetch("/api/ai-trace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    
    const data = await res.json();
    
    if (!data.ok) {
      return { steps: [], error: data.error };
    }
    
    const steps: ExecutionStep[] = data.trace.map((t: any) => {
      // Map AI trace format to our ExecutionStep format
      // We will create a single "Global" stack frame for memory
      const vars = Object.entries(t.memory || {}).map(([key, val]) => ({
        name: key,
        type: typeof val,
        value: typeof val === "object" ? JSON.stringify(val) : String(val),
        isReference: false,
      }));
      
      return {
        step: t.step,
        line: t.line,
        explanation: t.explanation ? { en: t.explanation } : { en: "Executing line " + t.line },
        stack: [{
          id: `frame_${t.step}`,
          name: "AI Memory Context",
          variables: vars
        }],
        heap: [],
        systemLog: "",
        isAITrace: true,
      };
    });
    
    return { steps };
  } catch (err: any) {
    return { steps: [], error: err.message || "Failed to parse AI trace" };
  }
}
