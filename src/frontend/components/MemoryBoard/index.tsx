"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import type { ExecutionStep } from "@/frontend/types";
import { StackPanel } from "./StackPanel";
import { HeapPanel } from "./HeapPanel";
import { ConsoleOutput } from "@/frontend/components/ConsoleOutput";
import { Layers, Box } from "lucide-react";

interface MemoryBoardProps {
  step: ExecutionStep | null;
  prevStep?: ExecutionStep | null;
  consoleOutput?: string;
}

interface Arrow {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const MemoryBoard = React.memo(({ step, prevStep, consoleOutput = "" }: MemoryBoardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const rafRef = useRef<number>(0);

  const updateArrows = useCallback(() => {
    if (!step || !('stack' in step) || !step.stack || !containerRef.current) {
      setArrows([]);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newArrows: Arrow[] = [];

    for (const frame of step.stack) {
      for (const v of frame.variables) {
        if (v.isReference && v.address) {
          const startEl = document.getElementById(`var-${frame.id}-${v.name}`);
          const endEl = document.getElementById(`heap-${v.address}`);

          if (startEl && endEl) {
            const startRect = startEl.getBoundingClientRect();
            const endRect = endEl.getBoundingClientRect();

            newArrows.push({
              id: `${frame.id}-${v.name}->${v.address}`,
              startX: startRect.right - containerRect.left + 2,
              startY: startRect.top + startRect.height / 2 - containerRect.top,
              endX: endRect.left - containerRect.left,
              endY: endRect.top + 14 - containerRect.top,
            });
          }
        }
      }
    }

    setArrows(newArrows);
  }, [step]);

  // Only recalculate arrows when step changes — no MutationObserver, no scroll listener
  useEffect(() => {
    // Use rAF to wait for DOM paint after step change
    rafRef.current = requestAnimationFrame(() => {
      updateArrows();
    });

    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateArrows);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateArrows]);

  if (!step) {
    return (
      <div className="flex h-full items-center justify-center p-6 select-none relative z-10">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,230,118,0.2)]">
              <Layers size={28} className="text-[#00E676]" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-emerald-500/20 blur-lg -z-10 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mb-2">
            Execution Visualization
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            Run your code to trace call stack frames, heap objects, and variable states step-by-step.
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-medium text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
            <span>Ready to execute</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-2 p-3">
      {/* Column Headers */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
          <Layers size={13} className="text-emerald-400" />
          Frames
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
          <Box size={13} className="text-amber-400" />
          Objects
        </div>
      </div>

      {/* Main side-by-side area with SVG arrows */}
      <div ref={containerRef} className="grid grid-cols-2 gap-4 flex-1 min-h-0 relative">
        {/* Frames Column */}
        <div className="min-h-0 overflow-hidden">
          <StackPanel frames={'stack' in step && step.stack ? step.stack : []} prevFrames={'stack' in (prevStep || {}) ? (prevStep as ExecutionStep).stack : undefined} />
        </div>

        {/* Objects Column */}
        <div className="min-h-0 overflow-hidden">
          <HeapPanel heap={'heap' in step && step.heap ? step.heap : []} prevHeap={'heap' in (prevStep || {}) ? (prevStep as ExecutionStep).heap : undefined} />
        </div>

        {/* SVG Arrows Overlay */}
        {arrows.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full z-10"
            style={{ overflow: "visible" }}
          >
            <defs>
              <marker id="ct-arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#38BDF8" />
              </marker>
            </defs>
            {arrows.map((arrow) => {
              const cpOffset = Math.max(Math.abs(arrow.endX - arrow.startX) * 0.4, 30);
              const path = `M ${arrow.startX} ${arrow.startY} C ${arrow.startX + cpOffset} ${arrow.startY}, ${arrow.endX - cpOffset} ${arrow.endY}, ${arrow.endX} ${arrow.endY}`;

              return (
                <g key={arrow.id}>
                  {/* Glowing background track */}
                  <path
                    d={path}
                    fill="none"
                    stroke="#1E3A8A"
                    strokeWidth="3"
                    strokeOpacity="0.4"
                  />
                  {/* Flowing animated dash */}
                  <path
                    d={path}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    strokeOpacity="0.9"
                    strokeDasharray="6, 8"
                    markerEnd="url(#ct-arrowhead)"
                    className="animate-flowing-dash"
                  />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Console Output */}
      <div className="shrink-0 max-h-[120px] min-h-[60px]">
        <ConsoleOutput output={consoleOutput} />
      </div>
    </div>
  );
});
MemoryBoard.displayName = "MemoryBoard";
