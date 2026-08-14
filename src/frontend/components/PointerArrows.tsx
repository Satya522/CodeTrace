"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExecutionStep } from "@/frontend/types";

interface Arrow {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function PointerArrows({ step }: { step: ExecutionStep | null }) {
  const [arrows, setArrows] = useState<Arrow[]>([]);

  const updateArrows = useCallback(() => {
    if (!step) {
      setArrows([]);
      return;
    }

    const newArrows: Arrow[] = [];
    step.stack.forEach((frame) => {
      frame.variables.forEach((v) => {
        if (v.isReference && v.address) {
          const startEl = document.getElementById(`var-${frame.id}-${v.name}`);
          const endEl = document.getElementById(`heap-${v.address}`);

          if (startEl && endEl) {
            const startRect = startEl.getBoundingClientRect();
            const endRect = endEl.getBoundingClientRect();
            
            // Using page coordinates since svg is fixed inset-0
            const startX = startRect.right;
            const startY = startRect.top + startRect.height / 2;
            const endX = endRect.left;
            const endY = endRect.top + endRect.height / 2;

            newArrows.push({
              id: `${frame.id}-${v.name}->${v.address}`,
              startX,
              startY,
              endX,
              endY,
            });
          }
        }
      });
    });

    setArrows(newArrows);
  }, [step]);

  useEffect(() => {
    const timeout = setTimeout(updateArrows, 100); // slight delay for DOM to render
    
    window.addEventListener("resize", updateArrows);
    
    // Watch for scroll in any scrollable container
    const onScroll = () => updateArrows();
    window.addEventListener("scroll", onScroll, true);
    
    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => updateArrows());
      const board = document.querySelector('.grid-rows-2');
      if (board) {
        observer.observe(board, { childList: true, subtree: true, attributes: true });
      }
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateArrows);
      window.removeEventListener("scroll", onScroll, true);
      if (observer) observer.disconnect();
    };
  }, [updateArrows]);

  if (arrows.length === 0) return null;

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ overflow: "visible" }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash-flow {
          to { stroke-dashoffset: -8; }
        }
        .animate-dash-flow {
          animation: dash-flow 0.5s linear infinite;
        }
      `}} />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#F59E0B" />
        </marker>
      </defs>
      <AnimatePresence>
        {arrows.map((arrow) => {
          const distance = Math.abs(arrow.endX - arrow.startX);
          const controlPointOffset = Math.max(distance / 2, 40);
          
          const path = `M ${arrow.startX} ${arrow.startY} C ${arrow.startX + controlPointOffset} ${arrow.startY}, ${arrow.endX - controlPointOffset} ${arrow.endY}, ${arrow.endX} ${arrow.endY}`;

          return (
            <motion.path
              key={arrow.id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              d={path}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4, 4"
              markerEnd="url(#arrowhead)"
              className="animate-dash-flow transition-all duration-300 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]"
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
