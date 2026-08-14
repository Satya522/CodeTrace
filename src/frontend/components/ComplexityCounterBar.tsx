import React from "react";
import type { ComplexityCounters } from "@/frontend/types";
import { Activity, ArrowRightLeft, GitMerge, List } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export function ComplexityCounterBar({ counters, history = [] }: { counters?: ComplexityCounters, history?: ComplexityCounters[] }) {
  if (!counters) return null;

  const data = history.map((h, i) => ({
    name: i,
    total: h.comparisons + h.swaps + h.recursiveCalls + h.arrayAccesses
  }));

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-panel/60 px-3 py-2 text-xs backdrop-blur relative overflow-hidden">
      
      {data.length > 1 && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-white/70 relative z-10">
        <Activity size={14} className="text-accentBlue" />
        <motion.span key={counters.comparisons} initial={{ opacity: 0.5, y: -2 }} animate={{ opacity: 1, y: 0 }} className="font-mono font-medium text-white/90">
          {counters.comparisons}
        </motion.span> comparisons
      </div>
      <div className="h-3 w-px bg-border relative z-10" />
      <div className="flex items-center gap-1.5 text-white/70 relative z-10">
        <ArrowRightLeft size={14} className="text-accentYellow" />
        <motion.span key={counters.swaps} initial={{ opacity: 0.5, y: -2 }} animate={{ opacity: 1, y: 0 }} className="font-mono font-medium text-white/90">
          {counters.swaps}
        </motion.span> swaps
      </div>
      <div className="h-3 w-px bg-border relative z-10" />
      <div className="flex items-center gap-1.5 text-white/70 relative z-10">
        <GitMerge size={14} className="text-accentGreen" />
        <motion.span key={counters.recursiveCalls} initial={{ opacity: 0.5, y: -2 }} animate={{ opacity: 1, y: 0 }} className="font-mono font-medium text-white/90">
          {counters.recursiveCalls}
        </motion.span> calls
      </div>
      <div className="h-3 w-px bg-border relative z-10" />
      <div className="flex items-center gap-1.5 text-white/70 relative z-10">
        <List size={14} className="text-accentRed" />
        <motion.span key={counters.arrayAccesses} initial={{ opacity: 0.5, y: -2 }} animate={{ opacity: 1, y: 0 }} className="font-mono font-medium text-white/90">
          {counters.arrayAccesses}
        </motion.span> accesses
      </div>
    </div>
  );
}
