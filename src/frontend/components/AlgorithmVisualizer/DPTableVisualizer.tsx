import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ExecutionStep } from "@/frontend/types";

interface DPTableVisualizerProps {
  step: ExecutionStep | null;
  matrixData: any[][];
  colorblindMode?: boolean;
  prefersReducedMotion?: boolean;
}

type CellState = "default" | "target" | "source";

interface ParsedExplanation {
  target: { r: number; c: number } | null;
  sources: { r: number; c: number }[];
}

function parseExplanationForDP(text: string): ParsedExplanation {
  const result: ParsedExplanation = { target: null, sources: [] };
  const lower = text.toLowerCase();
  
  // Format we expect from snippets: "filling dp[2][3] using dp[1][3] and dp[1][2]"
  // Or "comparing str1[i] and str2[j]" (for headers, handled differently)
  
  // Match target: e.g. "filling dp[2][3]" or "dp[2][3] ="
  const targetMatch = lower.match(/(?:fill|set|compute|assign).*?\[(\d+)\]\[(\d+)\]/i) 
                   || lower.match(/\[(\d+)\]\[(\d+)\]\s*=/i);
  if (targetMatch) {
    result.target = { r: parseInt(targetMatch[1]), c: parseInt(targetMatch[2]) };
  }

  // Match sources: "using dp[1][3]" or just "[1][3]"
  const allMatches = Array.from(lower.matchAll(/\[(\d+)\]\[(\d+)\]/g));
  for (const m of allMatches) {
    const r = parseInt(m[1]);
    const c = parseInt(m[2]);
    // If it's not the target, it's a source
    if (!result.target || r !== result.target.r || c !== result.target.c) {
      // Avoid duplicates
      if (!result.sources.find((s) => s.r === r && s.c === c)) {
        result.sources.push({ r, c });
      }
    }
  }

  return result;
}

export function DPTableVisualizer({ step, matrixData, colorblindMode = false, prefersReducedMotion = false }: DPTableVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellRects, setCellRects] = useState<Map<string, DOMRect>>(new Map());

  // Parse explanation to find target and source cells
  const parsedData = useMemo(() => {
    if (!step) return { target: null, sources: [] };
    const text = (step.explanation?.en || "") + " " + (step.systemLog || "");
    return parseExplanationForDP(text);
  }, [step]);

  // Update cell rects for drawing SVG arrows
  useEffect(() => {
    if (!containerRef.current || !parsedData.target) {
      setCellRects(new Map());
      return;
    }

    const updateRects = () => {
      if (!containerRef.current) return;
      const newRects = new Map<string, DOMRect>();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const elements = containerRef.current.querySelectorAll('[data-cell-id]');
      elements.forEach((el) => {
        const id = el.getAttribute('data-cell-id');
        if (id) {
          const rect = el.getBoundingClientRect();
          // Adjust rect relative to container
          newRects.set(id, new DOMRect(
            rect.left - containerRect.left,
            rect.top - containerRect.top,
            rect.width,
            rect.height
          ));
        }
      });
      setCellRects(newRects);
    };

    updateRects();
    // Slight delay to ensure DOM is settled after animation
    const timeout = setTimeout(updateRects, 50);
    window.addEventListener('resize', updateRects);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateRects);
    };
  }, [matrixData, parsedData, prefersReducedMotion]);

  if (!matrixData || matrixData.length === 0) return null;

  const rows = matrixData.length;
  const cols = matrixData[0].length;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-auto custom-scrollbar" ref={containerRef}>
      
      {/* SVG overlay for arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colorblindMode ? "#60A5FA" : "#F59E0B"} />
          </marker>
        </defs>
        
        {parsedData.target && parsedData.sources.map((source, idx) => {
          const targetId = `${parsedData.target!.r}-${parsedData.target!.c}`;
          const sourceId = `${source.r}-${source.c}`;
          
          const targetRect = cellRects.get(targetId);
          const sourceRect = cellRects.get(sourceId);
          
          if (!targetRect || !sourceRect) return null;
          
          const sx = sourceRect.left + sourceRect.width / 2;
          const sy = sourceRect.top + sourceRect.height / 2;
          const tx = targetRect.left + targetRect.width / 2;
          const ty = targetRect.top + targetRect.height / 2;
          
          // Draw curved line if they are not in same row/col, else straight
          const dx = tx - sx;
          const dy = ty - sy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          // Don't draw if too close (same cell somehow)
          if (dist < 10) return null;
          
          // Adjust endpoints so arrows don't go inside the cell box entirely
          // Cell radius is roughly 15-20px
          const padding = 16;
          const ratio = padding / dist;
          const finalTx = tx - dx * ratio;
          const finalTy = ty - dy * ratio;
          
          // Bezier curve control points
          const cx1 = sx + dx * 0.5;
          const cy1 = sy;
          const cx2 = tx;
          const cy2 = ty - dy * 0.5;
          
          const d = (sx === tx || sy === ty) 
            ? `M ${sx} ${sy} L ${finalTx} ${finalTy}`
            : `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${finalTx} ${finalTy}`;

          return (
            <motion.path
              key={`arrow-${idx}`}
              d={d}
              fill="none"
              stroke={colorblindMode ? "#60A5FA" : "#F59E0B"}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              strokeDasharray="4 4"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* The Matrix */}
      <div className="flex flex-col gap-1 z-10">
        {/* Column Headers */}
        <div className="flex gap-1 ml-6 mb-1">
          {matrixData[0].map((_, j) => (
            <div key={`col-${j}`} className="w-10 text-center text-[10px] text-white/30 font-mono">
              {j}
            </div>
          ))}
        </div>
        
        {matrixData.map((row, i) => (
          <div key={`row-${i}`} className="flex gap-1 items-center">
            {/* Row Header */}
            <div className="w-5 text-right text-[10px] text-white/30 font-mono pr-1">
              {i}
            </div>
            
            {/* Row Cells */}
            {row.map((cell, j) => {
              const isTarget = parsedData.target?.r === i && parsedData.target?.c === j;
              const isSource = parsedData.sources.some(s => s.r === i && s.c === j);
              
              let bgColor = "bg-white/5";
              let borderColor = "border-white/10";
              let textColor = "text-white/80";
              
              if (isTarget) {
                bgColor = colorblindMode ? "bg-teal-500/20" : "bg-emerald-500/20";
                borderColor = colorblindMode ? "border-teal-400" : "border-emerald-400";
                textColor = colorblindMode ? "text-teal-300" : "text-emerald-300";
              } else if (isSource) {
                bgColor = colorblindMode ? "bg-blue-500/20" : "bg-amber-500/20";
                borderColor = colorblindMode ? "border-blue-400" : "border-amber-400";
                textColor = colorblindMode ? "text-blue-300" : "text-amber-300";
              } else if (cell !== null && cell !== 0 && cell !== "") {
                // Dim non-zero/filled cells slightly to distinguish from empty ones
                bgColor = "bg-white/10";
              }

              // Special rendering for Infinity or other objects
              let displayVal = cell;
              if (cell === null) displayVal = "∅";
              else if (typeof cell === "object" && cell.__address) displayVal = cell.__address.slice(0, 4);

              return (
                <motion.div
                  key={`cell-${i}-${j}`}
                  data-cell-id={`${i}-${j}`}
                  layout={!prefersReducedMotion}
                  className={`w-10 h-10 flex items-center justify-center rounded border ${bgColor} ${borderColor} ${textColor} text-xs font-mono transition-colors shadow-sm`}
                  initial={isTarget ? { scale: prefersReducedMotion ? 1 : 0.8, opacity: 0.5 } : false}
                  animate={isTarget ? { scale: 1, opacity: 1 } : false}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  {displayVal}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
