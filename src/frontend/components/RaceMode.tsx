"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, SkipForward, SkipBack, RotateCcw, Swords, Loader2 } from "lucide-react";
import { ArrayBar, BarState } from "@/frontend/components/AlgorithmVisualizer/ArrayBar";
import { LayoutGroup } from "framer-motion";
import type { ExecutionStep } from "@/frontend/types";

interface RaceModeProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  colorblindMode?: boolean;
  prefersReducedMotion?: boolean;
}

type RaceSide = {
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

function RaceArrayView({ step, label, colorblindMode, prefersReducedMotion }: { step: ExecutionStep | null, label: string, colorblindMode: boolean, prefersReducedMotion: boolean }) {
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
      const parsed = JSON.parse(arrayObj.data.replace(/'/g, '"'));
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
      // ignore parse errors
    }
    return null;
  }, [step]);

  if (!step || !targetArray) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border border-white/10 rounded-xl bg-black/40 p-6">
        <span className="text-white/40 text-sm font-mono mb-2">{label}</span>
        <div className="text-white/20 text-xs">Awaiting Execution...</div>
      </div>
    );
  }

  const explanationText = step.explanation?.en || "";
  const barStates = detectBarStates(explanationText + " " + (step.systemLog || ""), targetArray.length);
  const maxVal = Math.max(...targetArray.map((i: any) => i.value), 1);

  return (
    <div className="flex-1 flex flex-col items-center justify-center border border-white/10 rounded-xl bg-black/40 p-4 relative overflow-hidden">
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accentPurple" />
        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{label}</span>
      </div>
      
      <div className="flex items-end justify-center h-48 gap-1.5 w-full max-w-sm mt-8">
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {targetArray.map((item: any, idx: number) => (
              <ArrayBar
                key={item.id}
                value={item.value}
                originalIndex={idx}
                maxValue={maxVal}
                state={barStates.get(idx) || "default"}
                colorblindMode={colorblindMode}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      <div className="mt-6 text-center h-12 flex items-center justify-center">
        <p className="text-sm font-mono text-zinc-300 max-w-sm">{explanationText}</p>
      </div>
    </div>
  );
}

export function RaceMode({ isOpen, onClose, language, colorblindMode = false, prefersReducedMotion = false }: RaceModeProps) {
  const [dataCode, setDataCode] = useState("const arr = [8, 7, 6, 5, 4, 3, 2, 1];\n");
  const [leftAlgorithm, setLeftAlgorithm] = useState(`function bubbleSort(arr) {
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
bubbleSort(arr);`);

  const [rightAlgorithm, setRightAlgorithm] = useState(`function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}
insertionSort(arr);`);

  const [leftSide, setLeftSide] = useState<RaceSide>({ steps: [], currentIndex: 0, label: "Bubble Sort" });
  const [rightSide, setRightSide] = useState<RaceSide>({ steps: [], currentIndex: 0, label: "Insertion Sort" });
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      // Dynamic import to avoid circular deps
      const { runJsTrace } = await import("@/frontend/engines/jsEngine");
      
      const fullLeft = dataCode + "\n" + leftAlgorithm;
      const fullRight = dataCode + "\n" + rightAlgorithm;
      
      const [leftResult, rightResult] = await Promise.all([
        runJsTrace(fullLeft),
        runJsTrace(fullRight),
      ]);
      
      if (leftResult.error) setError(`Algorithm 1: ${leftResult.error}`);
      if (rightResult.error) setError((prev) => (prev ? prev + " | " : "") + `Algorithm 2: ${rightResult.error}`);
      
      setLeftSide({ steps: leftResult.steps as ExecutionStep[], currentIndex: 0, label: "Algorithm 1" });
      setRightSide({ steps: rightResult.steps as ExecutionStep[], currentIndex: 0, label: "Algorithm 2" });
    } catch (err: any) {
      setError(err?.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  }, [dataCode, leftAlgorithm, rightAlgorithm]);

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
          className="w-full max-w-6xl max-h-[90vh] rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Swords size={20} className="text-accentRed" />
              <h2 className="text-lg font-bold tracking-tight">Algorithm Race Mode</h2>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1.5">
              <X size={18} />
            </button>
          </div>

          {/* Config Area */}
          <div className="px-6 py-3 border-b border-white/5 flex flex-col gap-2">
            <div>
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 block">Shared Data Setup</label>
              <textarea
                value={dataCode}
                onChange={(e) => setDataCode(e.target.value)}
                className="w-full h-12 bg-black/50 border border-white/10 rounded-lg p-2 font-mono text-[11px] text-white/80 focus:outline-none focus:border-white/20 resize-none"
                spellCheck={false}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 block">Algorithm 1 (e.g. Bubble Sort)</label>
                <textarea
                  value={leftAlgorithm}
                  onChange={(e) => setLeftAlgorithm(e.target.value)}
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-[11px] text-white/80 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 block">Algorithm 2 (e.g. Insertion Sort)</label>
                <textarea
                  value={rightAlgorithm}
                  onChange={(e) => setRightAlgorithm(e.target.value)}
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-[11px] text-white/80 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                {isRunning ? "Racing..." : "Start Race"}
              </button>
            </div>
            {error && (
              <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}
          </div>

          {/* Visualizer Area */}
          <div className="flex-1 flex p-6 gap-6 min-h-0 bg-black/20">
            <RaceArrayView step={leftStep} label={leftSide.label} colorblindMode={colorblindMode} prefersReducedMotion={prefersReducedMotion} />
            <RaceArrayView step={rightStep} label={rightSide.label} colorblindMode={colorblindMode} prefersReducedMotion={prefersReducedMotion} />
          </div>

          {/* Controls */}
          {leftSide.steps.length > 0 && rightSide.steps.length > 0 && (
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => stepBoth("reset")}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                  <RotateCcw size={16} />
                </button>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => stepBoth("prev")}
                    className="p-2 hover:bg-white/10 text-white transition-colors border-r border-white/10"
                  >
                    <SkipBack size={16} />
                  </button>
                  <button
                    onClick={() => stepBoth("next")}
                    className="p-2 hover:bg-white/10 text-white transition-colors"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-white/40">
                Steps: {Math.max(leftSide.currentIndex, rightSide.currentIndex)} / {Math.max(leftSide.steps.length - 1, rightSide.steps.length - 1)}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
