"use client";

import type { ExecutionStep, ExecutionTrace } from "@/frontend/types";

interface WorkerResponse {
  requestId: string;
  ok: boolean;
  steps: ExecutionStep[];
  error: string | null;
}

let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("../../database/workers/pyodide.worker.ts", import.meta.url), {
      type: "module",
    });
  }
  return worker;
}

/**
 * Runs Python code through the Pyodide worker and returns a fully typed,
 * "live" (real, not simulated) ExecutionTrace.
 *
 * Notes on what's genuinely real vs. simplified in Phase 1:
 *  - Line-by-line stack/heap snapshots: REAL (via sys.settrace on the actual
 *    running interpreter).
 *  - Orphan/GC visualization: a deliberate one-step-grace-period simplification
 *    of CPython's real (near-instant) refcounting GC -- real objects, simplified
 *    timing, done for teaching clarity.
 *  - comparisons/swaps/arrayAccesses counters: best-effort, based on scanning
 *    the executed source line's text, not bytecode-level instrumentation.
 */
export function runPythonTrace(code: string): Promise<ExecutionTrace> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const requestId = crypto.randomUUID();

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.requestId !== requestId) return;
      w.removeEventListener("message", handleMessage);

      if (!event.data.ok) {
        reject(new Error(event.data.error ?? "Unknown Pyodide worker error"));
        return;
      }

      resolve({
        language: "python",
        mode: "live",
        steps: event.data.steps,
        error: event.data.error ?? undefined,
      });
    };

    w.addEventListener("message", handleMessage);
    w.postMessage({ code, requestId });
  });
}
