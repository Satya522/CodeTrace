"use client";

import React from "react";
import type { StackFrame, Variable } from "@/frontend/types";
import { motion, AnimatePresence } from "framer-motion";

interface StackPanelProps {
  frames: StackFrame[];
  prevFrames?: StackFrame[];
}

export const StackPanel = React.memo(({ frames, prevFrames }: StackPanelProps) => {
  // Build a lookup of previous variable values for change detection
  const prevVarMap = new Map<string, string>();
  if (prevFrames) {
    for (const f of prevFrames) {
      for (const v of f.variables) {
        prevVarMap.set(`${f.id}::${v.name}`, v.value);
      }
    }
  }

  if (frames.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-white/30 italic">
        No active frames.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
      {frames.map((frame, frameIndex) => {
        const isActive = frameIndex === frames.length - 1;
        const isGlobal = frame.name.toLowerCase() === "global" || frame.name.toLowerCase() === "global()";
        const displayName = isGlobal ? "Global frame" : frame.name;

        return (
          <div
            key={frame.id}
            className={`rounded-lg border overflow-hidden ${
              isActive
                ? "border-accentBlue/60 shadow-[0_0_16px_rgba(59,130,246,0.15)] bg-accentBlue/[0.06]"
                : "border-white/10 bg-white/[0.02] opacity-60"
            }`}
          >
            {/* Frame header */}
            <div
              className={`px-3 py-1.5 text-xs font-bold font-mono border-b flex items-center gap-2 ${
                isActive
                  ? "bg-accentBlue/10 border-accentBlue/20 text-accentBlue"
                  : "bg-white/[0.03] border-white/5 text-white/50"
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-accentBlue animate-pulse shrink-0" />
              )}
              {displayName}
              {!isGlobal && <span className="text-white/30">()</span>}
            </div>

            {/* Variables table */}
            <div className="px-1 py-1">
              {frame.variables.length === 0 ? (
                <div className="text-[10px] text-white/20 px-2 py-1 italic">no locals yet</div>
              ) : (
                <table className="w-full text-xs font-mono">
                  <tbody>
                    {frame.variables.map((v) => {
                      const prevVal = prevVarMap.get(`${frame.id}::${v.name}`);
                      const hasChanged = prevVal !== undefined && prevVal !== v.value;
                      const isNew = prevVal === undefined && prevFrames && prevFrames.length > 0;

                      return (
                        <tr key={v.name}>
                          {/* Variable name */}
                          <td className="px-2 py-[3px] text-white/60 whitespace-nowrap align-middle border-r border-white/5 w-[1%]">
                            {v.name}
                          </td>
                          {/* Variable value */}
                          <td className="px-2 py-[3px] align-middle relative">
                            {v.isReference ? (
                              <div className="flex items-center gap-1.5">
                                <span
                                  id={`var-${frame.id}-${v.name}`}
                                  className="inline-block w-2.5 h-2.5 rounded-full bg-accentYellow/80 border border-accentYellow shrink-0 shadow-[0_0_6px_rgba(234,179,8,0.4)]"
                                />
                              </div>
                            ) : (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-white/90 ${
                                  hasChanged
                                    ? "ring-1 ring-accentYellow/40 bg-accentYellow/10"
                                    : isNew
                                    ? "ring-1 ring-accentGreen/40 bg-accentGreen/10"
                                    : ""
                                }`}
                              >
                                {formatValue(v)}
                              </span>
                            )}

                            {hasChanged && !v.isReference && (
                              <span className="ml-2 text-[10px] text-accentYellow/60">
                                ← was {prevVal}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Return value row */}
                    {frame.returnValue !== undefined && (
                      <tr>
                        <td className="px-2 py-[3px] text-accentGreen/70 whitespace-nowrap align-middle border-r border-white/5 italic">
                          Return value
                        </td>
                        <td className="px-2 py-[3px] align-middle">
                          <span className="text-accentGreen font-semibold">{frame.returnValue}</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
StackPanel.displayName = "StackPanel";

function formatValue(v: Variable): string {
  if (v.type === "string" || v.type === "str") return `"${v.value}"`;
  return v.value;
}
