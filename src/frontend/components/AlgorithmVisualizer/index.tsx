"use client";

import React, { useMemo } from "react";
import { ExecutionStep } from "@/frontend/types";
import { ArrayBar, BarState } from "./ArrayBar";
import { LayoutGroup } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { ComplexityCounterBar } from "@/frontend/components/ComplexityCounterBar";
import { PseudocodePanel } from "@/frontend/components/PseudocodePanel";
import { JS_SNIPPETS, PYTHON_SNIPPETS } from "@/frontend/lib/algorithmSnippets";
import { DPTableVisualizer } from "./DPTableVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";

interface AlgorithmVisualizerProps {
  step: ExecutionStep | null;
  activeSnippetId?: string;
  uiLanguage?: "en" | "hi";
  prefersReducedMotion?: boolean;
  colorblindMode?: boolean;
}

/**
 * Detects which indices are being compared/swapped/sorted from the step explanation.
 * Works with explanations from both AI traces and real traces.
 */
function detectBarStates(text: string, arrayLength: number): Map<number, BarState> {
  const states = new Map<number, BarState>();
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

export function AlgorithmVisualizer({ step, activeSnippetId, uiLanguage = "en", prefersReducedMotion = false, colorblindMode = false }: AlgorithmVisualizerProps) {
  // Find the active snippet to get its pseudocode
  const activeSnippet = useMemo(() => {
    if (!activeSnippetId) return null;
    return [...JS_SNIPPETS, ...PYTHON_SNIPPETS].find(s => s.id === activeSnippetId) || null;
  }, [activeSnippetId]);
  // Find the first array/list in the heap to visualize
  const targetArray = useMemo(() => {
    if (!step || !step.heap) return { isMatrix: false, parsed: null, raw: null };
    const arrayObj = step.heap.find((obj) =>
      obj.type === "list" ||
      obj.type === "Array" ||
      obj.type.includes("[]") ||
      obj.type.includes("vector")
    );
    if (!arrayObj) return { isMatrix: false, parsed: null, raw: null };

    try {
      const cleanData = arrayObj.data.replace(/'/g, '"');
      const parsed = JSON.parse(cleanData);
      
      const isMatrix = Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0]) || arrayObj.structureKind === "matrix";

      if (Array.isArray(parsed)) {
        if (!isMatrix) {
          const counts = new Map();
          const mapped = parsed.map((val, idx) => {
            const c = counts.get(val) || 0;
            counts.set(val, c + 1);
            return {
              id: `val-${val}-dup-${c}`,
              value: Number(val),
              originalIndex: idx,
            };
          });
          return { isMatrix, parsed: mapped, raw: parsed, isGraph: false, graphObj: null };
        } else {
          return { isMatrix, parsed: null, raw: parsed, isGraph: false, graphObj: null };
        }
      }
    } catch (e) {
      console.warn("Could not parse array for visualization", arrayObj.data);
    }
    return { isMatrix: false, parsed: null, raw: null, isGraph: false, graphObj: null };
  }, [step]);

  const targetGraph = useMemo(() => {
    if (!step || !step.heap) return null;
    return step.heap.find((obj) => obj.structureKind === "graph" || obj.type === "Graph") || null;
  }, [step]);

  // Compute per-bar states
  const barStates = useMemo(() => {
    if (!step || targetArray.isMatrix || targetGraph) return new Map<number, BarState>();
    const explanationText = step.explanation?.[uiLanguage] || step.explanation?.en || "";
    const text = explanationText + " " + (step.systemLog || "");
    return detectBarStates(text, targetArray.parsed?.length || 0);
  }, [step, targetArray, targetGraph, uiLanguage]);

  if (!targetArray.parsed && !targetArray.isMatrix && !targetGraph) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 p-8">
        <BarChart3 size={48} className="mb-4 opacity-20" />
        <p className="font-semibold text-white/50">No Data Structure Found</p>
        <p className="text-xs mt-2 max-w-xs text-center leading-relaxed">
          Initialize an array like <code className="text-accentBlue">const arr = [5, 2, 8, 1, 9];</code> to see the Framer Motion visualizer in action.
        </p>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6 text-[10px]">
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-blue-400' : 'bg-amber-400'}`} /> Comparing</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-orange-400' : 'bg-rose-400'}`} /> Swapping</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-teal-300' : 'bg-emerald-400'}`} /> Sorted</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-yellow-300' : 'bg-purple-400'}`} /> Pivot</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-sky-300' : 'bg-cyan-400'}`} /> Found</span>
        </div>
      </div>
    );
  }

  const maxValue = targetArray.isMatrix || targetGraph ? 1 : Math.max(...(targetArray.parsed?.map((item: any) => item.value) || []), 1);

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
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-blue-400' : 'bg-amber-400'}`} /> Comparing</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-orange-400' : 'bg-rose-400'}`} /> Swapping</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-teal-300' : 'bg-emerald-400'}`} /> Sorted</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-yellow-300' : 'bg-purple-400'}`} /> Pivot</span>
          <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${colorblindMode ? 'bg-sky-300' : 'bg-cyan-400'}`} /> Found</span>
        </div>
      </header>

      {/* The Arena */}
      <div className="flex-1 min-h-0 flex items-end justify-center gap-2 sm:gap-4 pb-8 z-10 w-full overflow-hidden px-4">
        {targetGraph ? (
          <GraphVisualizer
            step={step}
            graphObj={targetGraph}
            colorblindMode={colorblindMode}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : targetArray.isMatrix ? (
          <DPTableVisualizer 
            step={step} 
            matrixData={(targetArray.raw || []) as any[][]} 
            colorblindMode={colorblindMode} 
            prefersReducedMotion={prefersReducedMotion} 
          />
        ) : (
          <LayoutGroup>
            {targetArray.parsed?.map((item: any) => {
              const state: BarState = barStates.get(item.originalIndex) || "default";

              return (
                <ArrayBar
                  key={item.id}
                  value={item.value}
                  maxValue={maxValue}
                  state={state}
                  originalIndex={item.originalIndex}
                  prefersReducedMotion={prefersReducedMotion}
                  colorblindMode={colorblindMode}
                />
              );
            })}
          </LayoutGroup>
        )}
      </div>

      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Floating Pseudocode Panel */}
      {activeSnippet?.pseudocode && (
        <PseudocodePanel 
          pseudocode={activeSnippet.pseudocode} 
          currentLine={step?.line ?? null} 
        />
      )}
    </div>
  );
}
