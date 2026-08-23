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
    worker = new Worker(new URL("../../database/workers/cppInterpreter.worker.ts", import.meta.url), {
      type: "module",
    });
  }
  return worker;
}

export function runCppTrace(code: string): Promise<ExecutionTrace> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const requestId = crypto.randomUUID();

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.requestId !== requestId) return;
      w.removeEventListener("message", handleMessage);

      if (!event.data.ok) {
        reject(new Error(event.data.error ?? "Unknown C++ Interpreter worker error"));
        return;
      }

      resolve({
        language: "cpp",
        mode: "live",
        steps: event.data.steps,
        error: event.data.error ?? undefined,
      });
    };

    w.addEventListener("message", handleMessage);
    w.postMessage({ code, requestId });
  });
}
