"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Activity } from "lucide-react";
import { QueryStep, NoSQLStep } from "@/frontend/types";

export function QueryNode({ data }: { data: { step: QueryStep | NoSQLStep; uiLanguage?: "en" | "hi" } }) {
  const { step, uiLanguage = "en" } = data;
  if (!step) return null;

  const isSQL = 'sql' in step;
  const queryText = isSQL ? step.sql : (step as NoSQLStep).query;
  const rowsAffected = isSQL ? step.rowsAffected : 0;
  const queryPlan = isSQL ? step.queryPlan : undefined;

  return (
    <div className="relative min-w-[340px] max-w-[500px] rounded-xl overflow-hidden group shadow-2xl shadow-black/80 ring-1 ring-white/10 bg-[#09090b]">
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accentYellow/50 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Sleek Header */}
        <div className="px-4 py-3 bg-[#18181b]/50 border-b border-white/5 flex items-center gap-3">
          <div className="p-1.5 bg-accentYellow/10 rounded-md">
            <Activity size={14} className="text-accentYellow" />
          </div>
          <span className="font-sans text-[12px] font-semibold text-white/90 tracking-wide">ACTIVE QUERY</span>
          {rowsAffected > 0 && (
            <span className="ml-auto text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-white/50 font-mono ring-1 ring-white/10">
              {rowsAffected} rows affected
            </span>
          )}
        </div>

        {/* Code Statement */}
        <div className="p-4 bg-black/60 font-mono text-[12px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {queryText}
        </div>

        {/* Query Plan */}
        {queryPlan && (
          <div className="bg-[#09090b] px-4 py-3 border-t border-white/5">
            <div className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase mb-2">Execution Plan</div>
            <div className="font-mono text-[11px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {queryPlan}
            </div>
          </div>
        )}

        {/* Explanation */}
        {step.explanation && (
          <div className="px-4 py-2 bg-black/20 border-t border-white/5">
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{step.explanation[uiLanguage] || step.explanation.en}</p>
          </div>
        )}
      </div>

      {/* Sleek Output Port */}
      <Handle type="source" position={Position.Bottom} className="!bg-accentYellow !w-3 !h-1.5 !rounded-full !border-0 !bottom-[-3px]" />
    </div>
  );
}
