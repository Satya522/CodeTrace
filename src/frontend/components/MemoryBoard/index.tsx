import React from "react";
import type { ExecutionStep } from "@/frontend/types";
import { StackPanel } from "./StackPanel";
import { HeapPanel } from "./HeapPanel";

export const MemoryBoard = React.memo(({ step }: { step: ExecutionStep | null }) => {
  if (!step) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl text-sm text-white/40">
        Run your code to see the call stack and heap here.
      </div>
    );
  }

  return (
    <div className="grid h-full grid-rows-2 gap-4">
      <StackPanel frames={step.stack} />
      <HeapPanel heap={step.heap} />
    </div>
  );
});
MemoryBoard.displayName = "MemoryBoard";
