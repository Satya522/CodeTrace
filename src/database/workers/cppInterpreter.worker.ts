// @ts-ignore
import JSCPP from "JSCPP";

interface WorkerRequest {
  code: string;
  requestId: string;
}

self.addEventListener("message", (e: MessageEvent<WorkerRequest>) => {
  const { code, requestId } = e.data;
  
  const stdout: string[] = [];
  const config = {
    stdio: {
      write: (s: string) => {
        stdout.push(s);
      }
    },
    debug: true
  };

  try {
    const debuggerObj = JSCPP.run(code, '', config);
    const steps: any[] = [];
    
    if (debuggerObj && typeof debuggerObj.next === 'function') {
      while (true) {
        const done = debuggerObj.next();
        if (done) break;
        
        try {
          const node = debuggerObj.nextNode();
          if (!node) continue;
          
          const line = node.sLine || 1;
          const rawVars = debuggerObj.variable() || [];
          
          const mappedVars = rawVars
            .filter((v: any) => v.type !== undefined)
            .map((v: any) => ({
              name: v.name,
              type: v.type || "unknown",
              value: String(v.value),
              isReference: false
            }));

          steps.push({
            step: steps.length + 1,
            line: line,
            stack: [{
              id: "main",
              name: "main",
              variables: mappedVars
            }],
            heap: [],
            counters: { comparisons: 0, swaps: 0, recursiveCalls: 0, arrayAccesses: 0 },
            systemLog: "",
            stdout: [...stdout] // capture stdout up to this step
          });
        } catch (e) {
          // Ignore step errors
        }
      }
    }

    if (steps.length === 0) {
      steps.push({
        step: 1,
        line: 1,
        stack: [],
        heap: [],
        counters: { comparisons: 0, swaps: 0, recursiveCalls: 0, arrayAccesses: 0 },
        systemLog: "",
        stdout: [...stdout]
      });
    }

    self.postMessage({
      requestId,
      ok: true,
      steps,
      error: null
    });
  } catch (error: any) {
    self.postMessage({
      requestId,
      ok: false,
      steps: [],
      error: error.message || String(error)
    });
  }
});
