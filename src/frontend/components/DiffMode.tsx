"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, SkipForward, SkipBack, RotateCcw, Columns2, Loader2 } from "lucide-react";
import { ArrayBar, BarState } from "@/frontend/components/AlgorithmVisualizer/ArrayBar";
import { LayoutGroup } from "framer-motion";
import type { ExecutionStep } from "@/frontend/types";

interface DiffModeProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  colorblindMode?: boolean;
  prefersReducedMotion?: boolean;
}

type DiffSide = {
  steps: ExecutionStep[];
  currentIndex: number;
  label: string;
};

/**
 * Detect bar states from explanation text (same logic as AlgorithmVisualizer)
 */
function detectBarStates(text: string, arrayLength: number): Map<number, BarState> {
  const states = new Map<number, BarState>();
  const lowerText = text.toLowerCase();

  const swapMatch = lowerText.match(/swap.*?\[(\d+)\].*?\[(\d+)\]/i)
    || lowerText.match(/swap.*?index\s*(\d+).*?(\d+)/i);
  if (swapMatch) {
    states.set(parseInt(swapMatch[1]), "swapping");
    states.set(parseInt(swapMatch[2]), "swapping");
    return states;
  }

  const compareMatch = lowerText.match(/compar.*?\[(\d+)\].*?\[(\d+)\]/i)
    || lowerText.match(/(?:if|check).*?\[(\d+)\].*?\[(\d+)\]/i);
  if (compareMatch) {
    states.set(parseInt(compareMatch[1]), "comparing");
    states.set(parseInt(compareMatch[2]), "comparing");
  }

  const sortedMatch = lowerText.match(/sorted.*?(?:position|place).*?\[?(\d+)\]?/i)
    || lowerText.match(/\[(\d+)\].*?(?:sorted|final|correct)/i);
  if (sortedMatch) {
    states.set(parseInt(sortedMatch[1]), "sorted");
  }

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

/**
 * Extract the first array from the heap of a step
 */
function extractArray(step: ExecutionStep | null) {
  if (!step || !step.heap) return null;
  const arrayObj = step.heap.find((obj) =>
    obj.type === "list" || obj.type === "Array" || obj.type.includes("[]")
  );
  if (!arrayObj) return null;
  try {
    const cleanData = arrayObj.data.replace(/'/g, '"');
    const parsed = JSON.parse(cleanData);
    if (Array.isArray(parsed)) {
      const counts = new Map<number, number>();
      return parsed.map((val, idx) => {
        const c = counts.get(val) || 0;
        counts.set(val, c + 1);
        return { id: `val-${val}-dup-${c}`, value: Number(val), originalIndex: idx };
      });
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Mini bar chart renderer
 */
function MiniVisualizer({ step, colorblindMode, prefersReducedMotion }: { 
  step: ExecutionStep | null; 
  colorblindMode: boolean; 
  prefersReducedMotion: boolean;
}) {
  const targetArray = useMemo(() => extractArray(step), [step]);
  const barStates = useMemo(() => {
    if (!step || !targetArray) return new Map<number, BarState>();
    const text = (step.explanation?.en || "") + " " + (step.systemLog || "");
    return detectBarStates(text, targetArray.length);
  }, [step, targetArray]);

  if (!targetArray || targetArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/30 text-xs italic">
        No array data at this step
      </div>
    );
  }

  const maxValue = Math.max(...targetArray.map((item) => item.value), 1);

  return (
    <div className="flex items-end justify-center gap-1 h-full px-2 pb-4">
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
              prefersReducedMotion={prefersReducedMotion}
              colorblindMode={colorblindMode}
            />
          );
        })}
      </LayoutGroup>
    </div>
  );
}

// Preset input patterns
const PRESETS = {
  "bubble-sort": {
    bestCase: "const arr = [1, 2, 3, 4, 5, 6, 7, 8];\n",
    worstCase: "const arr = [8, 7, 6, 5, 4, 3, 2, 1];\n",
  },
  "selection-sort": {
    bestCase: "const arr = [1, 2, 3, 4, 5, 6, 7, 8];\n",
    worstCase: "const arr = [8, 7, 6, 5, 4, 3, 2, 1];\n",
  },
  "insertion-sort": {
    bestCase: "const arr = [1, 2, 3, 4, 5, 6, 7, 8];\n",
    worstCase: "const arr = [8, 7, 6, 5, 4, 3, 2, 1];\n",
  },
};

export function DiffMode({ isOpen, onClose, language, colorblindMode = false, prefersReducedMotion = false }: DiffModeProps) {
  const [leftCode, setLeftCode] = useState("// Best case\nconst arr = [1, 2, 3, 4, 5, 6, 7, 8];\n");
  const [rightCode, setRightCode] = useState("// Worst case\nconst arr = [8, 7, 6, 5, 4, 3, 2, 1];\n");
  const [algorithmCode, setAlgorithmCode] = useState(`function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
`);

  const [leftSide, setLeftSide] = useState<DiffSide>({ steps: [], currentIndex: 0, label: "Best Case" });
  const [rightSide, setRightSide] = useState<DiffSide>({ steps: [], currentIndex: 0, label: "Worst Case" });
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      // Dynamic import to avoid circular deps
      const { runJsTrace } = await import("@/frontend/engines/jsEngine");
      
      const fullLeft = leftCode + algorithmCode + "\nbubbleSort(arr);";
      const fullRight = rightCode + algorithmCode + "\nbubbleSort(arr);";
      
      const [leftResult, rightResult] = await Promise.all([
        runJsTrace(fullLeft),
        runJsTrace(fullRight),
      ]);
      
      if (leftResult.error) setError(`Left: ${leftResult.error}`);
      if (rightResult.error) setError((prev) => (prev ? prev + " | " : "") + `Right: ${rightResult.error}`);
      
      setLeftSide({ steps: leftResult.steps as ExecutionStep[], currentIndex: 0, label: "Best Case" });
      setRightSide({ steps: rightResult.steps as ExecutionStep[], currentIndex: 0, label: "Worst Case" });
    } catch (err: any) {
      setError(err?.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  }, [leftCode, rightCode, algorithmCode]);

  const stepBoth = useCallback((direction: "next" | "prev" | "reset") => {
    if (direction === "reset") {
      setLeftSide((s) => ({ ...s, currentIndex: 0 }));
      setRightSide((s) => ({ ...s, currentIndex: 0 }));
    } else if (direction === "next") {
      setLeftSide((s) => ({ ...s, currentIndex: Math.min(s.currentIndex + 1, s.steps.length - 1) }));
      setRightSide((s) => ({ ...s, currentIndex: Math.min(s.currentIndex + 1, s.steps.length - 1) }));
    } else {
      setLeftSide((s) => ({ ...s, currentIndex: Math.max(s.currentIndex - 1, 0) }));
      setRightSide((s) => ({ ...s, currentIndex: Math.max(s.currentIndex - 1, 0) }));
    }
  }, []);

  const leftStep = leftSide.steps[leftSide.currentIndex] || null;
  const rightStep = rightSide.steps[rightSide.currentIndex] || null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Columns2 size={20} className="text-accentBlue" />
              <h2 className="text-lg font-bold tracking-tight">Diff Mode — Side by Side Comparison</h2>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1.5">
              <X size={18} />
            </button>
          </div>

          {/* Config Area */}
          <div className="px-6 py-3 border-b border-white/5 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 block">Left Input (Best Case)</label>
                <textarea
                  value={leftCode}
                  onChange={(e) => setLeftCode(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/80 resize-none focus:outline-none focus:border-accentBlue/40"
                  placeholder="const arr = [1, 2, 3, ...];"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 block">Right Input (Worst Case)</label>
                <textarea
                  value={rightCode}
                  onChange={(e) => setRightCode(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/80 resize-none focus:outline-none focus:border-accentBlue/40"
                  placeholder="const arr = [8, 7, 6, ...];"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 block">Algorithm (shared)</label>
              <textarea
                value={algorithmCode}
                onChange={(e) => setAlgorithmCode(e.target.value)}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/80 resize-none focus:outline-none focus:border-accentBlue/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accentBlue/20 border border-accentBlue/30 text-accentBlue text-xs font-semibold hover:bg-accentBlue/30 transition-colors disabled:opacity-50"
              >
                {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                {isRunning ? "Running…" : "Run Both"}
              </button>
              {leftSide.steps.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => stepBoth("reset")} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors" title="Reset"><RotateCcw size={13} /></button>
                  <button onClick={() => stepBoth("prev")} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors" title="Step Back"><SkipBack size={13} /></button>
                  <button onClick={() => stepBoth("next")} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors" title="Step Forward"><SkipForward size={13} /></button>
                </div>
              )}
              {error && <span className="text-accentRed text-[11px] ml-2">{error}</span>}
            </div>
          </div>

          {/* Side-by-side visualizer area */}
          <div className="flex-1 min-h-0 grid grid-cols-2 divide-x divide-white/10 overflow-hidden">
            {/* Left */}
            <div className="flex flex-col min-h-0">
              <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">{leftSide.label}</span>
                <span className="text-[10px] font-mono text-white/40">
                  {leftSide.steps.length > 0 ? `Step ${leftSide.currentIndex + 1}/${leftSide.steps.length}` : "—"}
                </span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col">
                {leftStep && (
                  <div className="px-3 py-2 text-[11px] text-white/60 border-b border-white/5 truncate">
                    {leftStep.explanation?.en || leftStep.systemLog || "—"}
                  </div>
                )}
                <div className="flex-1 min-h-0 relative">
                  <MiniVisualizer step={leftStep} colorblindMode={colorblindMode} prefersReducedMotion={prefersReducedMotion} />
                </div>
                {leftStep?.counters && (
                  <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/5 flex gap-4 text-[10px] text-white/40">
                    <span>Comparisons: <span className="text-white/70 font-mono">{leftStep.counters.comparisons}</span></span>
                    <span>Swaps: <span className="text-white/70 font-mono">{leftStep.counters.swaps}</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col min-h-0">
              <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">{rightSide.label}</span>
                <span className="text-[10px] font-mono text-white/40">
                  {rightSide.steps.length > 0 ? `Step ${rightSide.currentIndex + 1}/${rightSide.steps.length}` : "—"}
                </span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col">
                {rightStep && (
                  <div className="px-3 py-2 text-[11px] text-white/60 border-b border-white/5 truncate">
                    {rightStep.explanation?.en || rightStep.systemLog || "—"}
                  </div>
                )}
                <div className="flex-1 min-h-0 relative">
                  <MiniVisualizer step={rightStep} colorblindMode={colorblindMode} prefersReducedMotion={prefersReducedMotion} />
                </div>
                {rightStep?.counters && (
                  <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/5 flex gap-4 text-[10px] text-white/40">
                    <span>Comparisons: <span className="text-white/70 font-mono">{rightStep.counters.comparisons}</span></span>
                    <span>Swaps: <span className="text-white/70 font-mono">{rightStep.counters.swaps}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer summary */}
          {leftSide.steps.length > 0 && rightSide.steps.length > 0 && (
            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <span>Left: <span className="text-white/80 font-mono">{leftSide.steps.length}</span> steps total</span>
              <span className="text-accentBlue font-semibold">
                {leftSide.steps.length < rightSide.steps.length
                  ? `Best case is ${Math.round((1 - leftSide.steps.length / rightSide.steps.length) * 100)}% fewer steps`
                  : leftSide.steps.length > rightSide.steps.length
                  ? `Worst case is ${Math.round((1 - rightSide.steps.length / leftSide.steps.length) * 100)}% fewer steps`
                  : "Both sides have equal steps"}
              </span>
              <span>Right: <span className="text-white/80 font-mono">{rightSide.steps.length}</span> steps total</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
