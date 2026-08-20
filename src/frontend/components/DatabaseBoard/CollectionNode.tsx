"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { FolderTree } from "lucide-react";

export function CollectionNode({ data }: { data: { name: string; isTarget?: boolean; docCount?: number } }) {
  const { name, isTarget, docCount = 0 } = data;

  return (
    <div className={`min-w-[220px] max-w-[340px] rounded-xl border overflow-hidden transition-all duration-500 shadow-2xl ${
      isTarget ? "bg-[#09090b] border-accentGreen/50 ring-1 ring-accentGreen/20 shadow-accentGreen/10 scale-[1.02]" : "bg-[#09090b] border-white/10 ring-1 ring-black scale-100"
    }`}>
      {/* Target indicator handle (from Query) */}
      <Handle type="target" position={Position.Top} className="!bg-accentGreen !w-3 !h-1.5 !rounded-full !border-0 !top-[-3px]" />
      
      {/* Sleek Header & Body combined */}
      <div className="px-4 py-3 flex items-center gap-3 relative">
        {/* Top highlight line for target */}
        {isTarget && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accentGreen to-transparent opacity-50" />
        )}
        
        {/* Icon with glowing background */}
        <div className={`flex items-center justify-center w-7 h-7 rounded-md z-10 transition-colors duration-500 ${
          isTarget ? "bg-accentGreen/10 text-accentGreen" : "bg-white/5 text-white/40"
        }`}>
          <FolderTree size={14} />
        </div>

        {/* Collection Name & Badge */}
        <div className="flex flex-col z-10 flex-1">
          <span className="font-sans text-[13px] font-semibold tracking-wide text-white/90">{name}</span>
        </div>
        
        <div className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ring-1 ${
          isTarget ? "bg-accentGreen/10 text-accentGreen ring-accentGreen/30" : "bg-white/5 text-zinc-500 ring-white/10"
        }`}>
          {docCount} doc{docCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Source handle (to Documents) */}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !w-2 !h-2 !border-0 !bottom-[-4px]" />
    </div>
  );
}
