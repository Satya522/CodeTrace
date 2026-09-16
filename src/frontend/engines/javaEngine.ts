"use client";

import type { ExecutionTrace } from "@/frontend/types";

export async function runJavaTrace(code: string): Promise<ExecutionTrace> {
  const response = await fetch("/api/trace-java", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.error || "Unknown error executing Java code");
  }

  return {
    language: "java",
    mode: "live",
    steps: data.steps,
  };
}
