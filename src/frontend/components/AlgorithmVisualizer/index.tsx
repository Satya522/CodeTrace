"use client";

import React, { useMemo } from "react";
import { ExecutionStep } from "@/frontend/types";
import { ArrayBar, BarState } from "./ArrayBar";
import { LayoutGroup } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { ComplexityCounterBar } from "@/frontend/components/ComplexityCounterBar";

interface AlgorithmVisualizerProps {
  step: ExecutionStep | null;
}

/**
 * Detects which indices are being compared/swapped/sorted from the step explanation.
 * Works with explanations from both AI traces and real traces.
 */
function detectBarStates(step: ExecutionStep | null, arrayLength: number): Map<number, BarState> {
  const states = new Map<number, BarState>();
  if (!step) return states;

  const text = (step.explanation?.en || "") + " " + (step.systemLog || "");
  const lowerText = text.toLowerCase();

  // Detect swapping: "swap arr[2] and arr[4]", "swapping index 2 and 4", "temp = arr[j]"
  const swapMatch = lowerText.match(/swap.*?\[(\d+)\].*?\[(\d+)\]/i)
    || lowerText.match(/swap.*?index\s*(\d+).*?(\d+)/i);
  if (swapMatch) {
    states.set(parseInt(swapMatch[1]), "swapping");
    states.set(parseInt(swapMatch[2]), "swapping");
    return states; // Swap takes priority
  } else {
    // Single index write/assign
    const singleSwapMatch = lowerText.match(/(?:swap|assign|writ).*?\[(\d+)\]/i);
    if (singleSwapMatch) {
      states.set(parseInt(singleSwapMatch[1]), "swapping");
    }
  }

  // Detect comparing: "comparing arr[1] and arr[2]", "if arr[j] > arr[j+1]"
  const compareMatch = lowerText.match(/compar.*?\[(\d+)\].*?\[(\d+)\]/i)
    || lowerText.match(/(?:if|check).*?\[(\d+)\].*?\[(\d+)\]/i);
  if (compareMatch) {
    states.set(parseInt(compareMatch[1]), "comparing");
    states.set(parseInt(compareMatch[2]), "comparing");
  } else {
    // Single compare or read
    const singleCompareMatch = lowerText.match(/(?:compar|check|read).*?\[(\d+)\]/i);
    if (singleCompareMatch) {
      states.set(parseInt(singleCompareMatch[1]), "comparing");
    }
  }

  // Detect pivot: "pivot = arr[3]", "pivot index 3"
  const pivotMatch = lowerText.match(/pivot.*?\[(\d+)\]/i)
    || lowerText.match(/pivot.*?index\s*(\d+)/i);
  if (pivotMatch) {
    states.set(parseInt(pivotMatch[1]), "pivot");
  }

  // Detect found: "found at index 4", "target found at [4]"
  const foundMatch = lowerText.match(/found.*?(?:index|at)\s*\[?(\d+)\]?/i);
  if (foundMatch) {
    states.set(parseInt(foundMatch[1]), "found");
  }

  // Detect sorted: "element at index 6 is now in its sorted position"
  const sortedMatch = lowerText.match(/sorted.*?(?:position|place).*?\[?(\d+)\]?/i)
    || lowerText.match(/\[(\d+)\].*?(?:sorted|final|correct)/i);
  if (sortedMatch) {
    states.set(parseInt(sortedMatch[1]), "sorted");
  }

  // Fallback: detect any index access like [3]
  if (states.size === 0) {
    const accessMatches = text.matchAll(/\[(\d+)\]/g);
    for (const m of accessMatches) {
      const idx = parseInt(m[1]);
      if (idx < arrayLength && !states.has(idx)) {
        states.set(idx, "comparing");
      }
    }
  }

  return states;
}

export function AlgorithmVisualizer({ step }: AlgorithmVisualizerProps) {
  // Find the first array/list in the heap to visualize
  const targetArray = useMemo(() => {
    if (!step || !step.heap) return null;
    const arrayObj = step.heap.find((obj) =>
      obj.type === "list" ||
      obj.type === "Array" ||
      obj.type.includes("[]") ||
      obj.type.includes("vector")
    );
    if (!arrayObj) return null;

    try {
      const cleanData = arrayObj.data.replace(/'/g, '"');
      const parsed = JSON.parse(cleanData);

      if (Array.isArray(parsed)) {
        const counts = new Map();
        return parsed.map((val, idx) => {
          const c = counts.get(val) || 0;
          counts.set(val, c + 1);
          return {
            id: `val-${val}-dup-${c}`,
            value: Number(val),
            originalIndex: idx,
          };
        });
      }
    } catch (e) {
      console.warn("Could not parse array for visualization", arrayObj.data);
    }
    return null;
  }, [step]);

  // Compute per-bar states
  const barStates = useMemo(() => {
    return detectBarStates(step, targetArray?.length || 0);
  }, [step, targetArray?.length]);

  if (!targetArray || targetArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 p-8">
        <BarChart3 size={48} className="mb-4 opacity-20" />
        <p className="font-semibold text-white/50">No Data Structure Found</p>
        <p className="text-xs mt-2 max-w-xs text-center leading-relaxed">
          Initialize an array like <code className="text-accentBlue">const arr = [5, 2, 8, 1, 9];</code> to see the Framer Motion visualizer in action.
        </p>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Comparing</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Swapping</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Sorted</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Pivot</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Found</span>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...targetArray.map((item) => item.value), 1);

  return (
    <div className="flex flex-col h-full bg-[#0a0f1a] p-6 relative overflow-hidden rounded-b-xl">
      <header className="mb-3 z-10 shrink-0">
        {/* Row 1: Title */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
            <BarChart3 className="text-accentBlue" size={16} />
            DSA Visualizer
          </h3>
          {step?.counters && (
            <ComplexityCounterBar counters={step.counters} />
          )}
        </div>
        {/* Row 2: Color Legend */}
        <div className="flex items-center gap-4 text-[10px] text-white/40">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20 border border-white/30" /> Default</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Comparing</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Swapping</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Sorted</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Pivot</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Found</span>
        </div>
      </header>

      {/* The Arena */}
      <div className="flex-1 min-h-0 flex items-end justify-center gap-2 sm:gap-4 pb-8 z-10 w-full overflow-x-auto custom-scrollbar px-4">
        <LayoutGroup>
          {targetArray.map((item) => {
            const state: BarState = barStates.get(item.originalIndex) || "default";

            return (
              <ArrayBar
                key={item.id}
                value={item.value}
                maxValue={maxValue}
                state={state}
                originalIndex={item.originalIndex}
              />
            );
          })}
        </LayoutGroup>
      </div>

      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  );
}
