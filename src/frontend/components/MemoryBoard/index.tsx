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
      <div className="flex h-full items-center justify-center text-sm text-white/30">
        <div className="text-center">
          <Layers size={32} className="mx-auto mb-3 text-white/10" />
          <p>Run your code to see the execution visualization here.</p>
          <p className="text-xs text-white/20 mt-1">Frames, Objects, and Console Output will appear.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-2 p-3">
      {/* Column Headers */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
          <Layers size={13} className="text-accentBlue" />
          Frames
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
          <Box size={13} className="text-accentYellow" />
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
