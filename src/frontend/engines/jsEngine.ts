"use client";

import type { ExecutionStep, ExecutionTrace } from "@/frontend/types";

interface WorkerResponse {
  requestId: string;
  ok: boolean;
  steps: ExecutionStep[];
  error: string | null;
}

let jsWorker: Worker | null = null;

function getWorker(): Worker {
  if (!jsWorker) {
    jsWorker = new Worker(new URL("../../database/workers/jsInterpreter.worker.ts", import.meta.url), {
      type: "module",
    });
  }
  return jsWorker;
}

export function runJsTrace(code: string): Promise<ExecutionTrace> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const requestId = crypto.randomUUID();

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.requestId !== requestId) return;
      clearTimeout(timeoutId);
      w.removeEventListener("message", handleMessage);

      if (!event.data.ok) {
        reject(new Error(event.data.error ?? "Unknown JS Interpreter worker error"));
        return;
      }

      resolve({
        language: "javascript",
        mode: "live",
        steps: event.data.steps,
        error: event.data.error ?? undefined,
      });
    };

    timeoutId = setTimeout(() => {
      w.removeEventListener("message", handleMessage);
      w.terminate();
      jsWorker = null; // Force recreation next time
      reject(new Error("Execution timeout: JavaScript code took too long to run (possible infinite loop)."));
    }, 30000);

    w.addEventListener("message", handleMessage);
    w.postMessage({ code, requestId });
  });
}
