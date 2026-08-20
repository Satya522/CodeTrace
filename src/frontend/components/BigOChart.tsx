"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import type { ComplexityCounters } from "@/frontend/types";
import { TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BigOChartProps {
  /** All steps' counters from index 0..currentIndex */
  history: (ComplexityCounters | undefined)[];
  /** Total array/input size (n), used to plot theoretical curves */
  n?: number;
}

/** Theoretical Big-O curves, scaled to match the actual data range */
function theoreticalCurves(stepCount: number, maxOps: number) {
  if (stepCount < 2 || maxOps === 0) return [];

  const points: { step: number; "O(n)": number; "O(n log n)": number; "O(n²)": number }[] = [];

  // Generate theoretical values for comparison
  const nMax = stepCount;
  const nLogNMax = nMax * Math.log2(Math.max(nMax, 2));
  const n2Max = nMax * nMax;

  // Scale factor so theoretical curves end near the actual data's max
  const scaleFactor = maxOps / Math.max(nLogNMax, 1);

  for (let i = 0; i < stepCount; i++) {
    const t = i + 1;
    const nLogN = t * Math.log2(Math.max(t, 2));
    points.push({
      step: i,
      "O(n)": Math.round(t * scaleFactor),
      "O(n log n)": Math.round(nLogN * scaleFactor),
      "O(n²)": Math.round(t * t * scaleFactor * (nLogNMax / n2Max)),
    });
  }

  return points;
}

export function BigOChart({ history }: BigOChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Build chart data from counter history
  const { chartData, maxOps } = useMemo(() => {
    let maxOps = 0;
    const chartData = history.map((counters, i) => {
      const comparisons = counters?.comparisons ?? 0;
      const swaps = counters?.swaps ?? 0;
      const total = comparisons + swaps;
      if (total > maxOps) maxOps = total;

      return {
        step: i,
        Comparisons: comparisons,
        Swaps: swaps,
        "Total Ops": total,
      };
    });
    return { chartData, maxOps };
  }, [history]);

  // Need at least 3 data points to show a meaningful chart
  if (history.length < 3) return null;

  // Theoretical overlay curves
  const theoretical = theoreticalCurves(history.length, maxOps);

  // Merge actual + theoretical data
  const mergedData = chartData.map((d, i) => ({
    ...d,
    ...(theoretical[i] || {}),
  }));

  const miniChart = (
    <button
      onClick={() => setIsExpanded(true)}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer group"
      title="View Big-O complexity chart"
    >
      <TrendingUp size={13} className="text-accentBlue group-hover:text-accentBlue" />
      <span className="font-medium">Big-O</span>
      {/* Sparkline preview */}
      <div className="w-16 h-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.slice(-20)}>
            <Line
              type="monotone"
              dataKey="Total Ops"
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </button>
  );

  return (
    <>
      {miniChart}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="w-[90vw] max-w-2xl rounded-2xl border border-white/10 bg-[#0a0f1a]/95 p-6 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-accentBlue" />
                  <h3 className="text-sm font-bold text-white">Complexity Analysis</h3>
                  <span className="text-[10px] text-white/40 font-mono">
                    {history.length} steps
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chart */}
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mergedData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <XAxis
                      dataKey="step"
                      stroke="#ffffff20"
                      tick={{ fill: "#ffffff40", fontSize: 10 }}
                      label={{ value: "Execution Step", position: "bottom", fill: "#ffffff40", fontSize: 10, offset: -5 }}
                    />
                    <YAxis
                      stroke="#ffffff20"
                      tick={{ fill: "#ffffff40", fontSize: 10 }}
                      label={{ value: "Operations", angle: -90, position: "insideLeft", fill: "#ffffff40", fontSize: 10, offset: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0f1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "11px",
                        color: "#fff",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                    />

                    {/* Actual data lines */}
                    <Line
                      type="monotone"
                      dataKey="Comparisons"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Swaps"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total Ops"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />

                    {/* Theoretical curves (dashed) */}
                    <Line
                      type="monotone"
                      dataKey="O(n)"
                      stroke="#ffffff30"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="O(n log n)"
                      stroke="#ffffff20"
                      strokeWidth={1}
                      strokeDasharray="6 3"
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="O(n²)"
                      stroke="#ffffff15"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Summary stats */}
              <div className="flex items-center gap-6 mt-4 text-[11px] text-white/60 border-t border-white/5 pt-3">
                <div>
                  <span className="text-white/40">Total Comparisons: </span>
                  <span className="font-mono text-accentBlue font-medium">
                    {history[history.length - 1]?.comparisons ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-white/40">Total Swaps: </span>
                  <span className="font-mono text-amber-400 font-medium">
                    {history[history.length - 1]?.swaps ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-white/40">Array Accesses: </span>
                  <span className="font-mono text-white/80 font-medium">
                    {history[history.length - 1]?.arrayAccesses ?? 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
