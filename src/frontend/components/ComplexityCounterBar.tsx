import React from "react";
import type { ComplexityCounters } from "@/frontend/types";
import { Activity, ArrowRightLeft, GitMerge, List } from "lucide-react";

export const ComplexityCounterBar = React.memo(({ counters }: { counters?: ComplexityCounters, history?: ComplexityCounters[] }) => {
  if (!counters) return null;

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs backdrop-blur shadow-sm">
      <div className="flex items-center gap-1.5 text-white/70">
        <Activity size={14} className="text-accentBlue" />
        <span className="font-mono font-medium text-white/90">{counters.comparisons}</span> comparisons
      </div>
      <div className="h-3 w-px bg-white/10" />
      <div className="flex items-center gap-1.5 text-white/70">
        <ArrowRightLeft size={14} className="text-accentYellow" />
        <span className="font-mono font-medium text-white/90">{counters.swaps}</span> swaps
      </div>
      <div className="h-3 w-px bg-white/10" />
      <div className="flex items-center gap-1.5 text-white/70">
        <GitMerge size={14} className="text-accentGreen" />
        <span className="font-mono font-medium text-white/90">{counters.recursiveCalls}</span> calls
      </div>
      <div className="h-3 w-px bg-white/10" />
      <div className="flex items-center gap-1.5 text-white/70">
        <List size={14} className="text-accentRed" />
        <span className="font-mono font-medium text-white/90">{counters.arrayAccesses}</span> accesses
      </div>
    </div>
  );
});
ComplexityCounterBar.displayName = "ComplexityCounterBar";
