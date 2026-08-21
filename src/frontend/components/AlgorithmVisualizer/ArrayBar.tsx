"use client";

import React from "react";
import { motion } from "framer-motion";

export type BarState = "default" | "comparing" | "swapping" | "sorted" | "pivot" | "found";

interface ArrayBarProps {
  value: number;
  maxValue: number;
  state: BarState;
  originalIndex: number;
  prefersReducedMotion?: boolean;
  colorblindMode?: boolean;
}

type BarStyleDef = { bar: string; glow: string; text: string; label?: string };

const BAR_STYLES: Record<BarState, BarStyleDef> = {
  default: {
    bar: "bg-gradient-to-t from-white/5 to-white/20 border-white/10",
    glow: "",
    text: "text-white/80",
  },
  comparing: {
    bar: "bg-gradient-to-t from-amber-500/30 to-amber-400 border-amber-400 shadow-amber-400/30",
    glow: "bg-amber-400/25 blur-md",
    text: "text-amber-400",
    label: "🔍",
  },
  swapping: {
    bar: "bg-gradient-to-t from-rose-500/40 to-rose-400 border-rose-400 shadow-rose-400/30",
    glow: "bg-rose-400/25 blur-md",
    text: "text-rose-400",
    label: "↔",
  },
  sorted: {
    bar: "bg-gradient-to-t from-emerald-500/30 to-emerald-400 border-emerald-400/60",
    glow: "",
    text: "text-emerald-400",
    label: "✓",
  },
  pivot: {
    bar: "bg-gradient-to-t from-purple-500/40 to-purple-400 border-purple-400 shadow-purple-400/30",
    glow: "bg-purple-400/25 blur-md",
    text: "text-purple-400",
    label: "P",
  },
  found: {
    bar: "bg-gradient-to-t from-cyan-500/40 to-cyan-400 border-cyan-400 shadow-cyan-400/30",
    glow: "bg-cyan-400/25 blur-lg",
    text: "text-cyan-400",
    label: "★",
  },
};

// Colorblind-safe palette: uses blue/orange/teal to avoid red-green confusion,
// plus distinct shapes (▲ ◆ ● ■ ★) for triple-redundancy.
const COLORBLIND_BAR_STYLES: Record<BarState, BarStyleDef> = {
  default: {
    bar: "bg-gradient-to-t from-white/5 to-white/20 border-white/10",
    glow: "",
    text: "text-white/80",
  },
  comparing: {
    bar: "bg-gradient-to-t from-blue-600/30 to-blue-400 border-blue-400 shadow-blue-400/30",
    glow: "bg-blue-400/25 blur-md",
    text: "text-blue-400",
    label: "▲",
  },
  swapping: {
    bar: "bg-gradient-to-t from-orange-500/40 to-orange-400 border-orange-400 shadow-orange-400/30",
    glow: "bg-orange-400/25 blur-md",
    text: "text-orange-400",
    label: "◆",
  },
  sorted: {
    bar: "bg-gradient-to-t from-teal-500/30 to-teal-300 border-teal-300/60",
    glow: "",
    text: "text-teal-300",
    label: "●",
  },
  pivot: {
    bar: "bg-gradient-to-t from-yellow-500/40 to-yellow-300 border-yellow-300 shadow-yellow-300/30",
    glow: "bg-yellow-300/25 blur-md",
    text: "text-yellow-300",
    label: "■",
  },
  found: {
    bar: "bg-gradient-to-t from-sky-400/40 to-sky-300 border-sky-300 shadow-sky-300/30",
    glow: "bg-sky-300/25 blur-lg",
    text: "text-sky-300",
    label: "★",
  },
};

export function ArrayBar({ value, maxValue, state, originalIndex, prefersReducedMotion = false, colorblindMode = false }: ArrayBarProps) {
  const heightPercent = Math.max((value / maxValue) * 100, 10);
  const styles = colorblindMode ? COLORBLIND_BAR_STYLES : BAR_STYLES;
  const style = styles[state];
  const hasGlow = state !== "default" && state !== "sorted";

  return (
    <motion.div
      layout={!prefersReducedMotion}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.8,
        duration: prefersReducedMotion ? 0 : 0.4,
      }}
      className="flex flex-col items-center justify-end group"
      style={{ height: "100%", width: "min(100%, 60px)" }}
    >
      {/* State label badge */}
      {style.label && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-[10px] font-bold mb-1 ${style.text}`}
        >
          {style.label}
        </motion.span>
      )}

      {/* Value on hover */}
      {!style.label && (
        <span className="text-white/60 text-[10px] font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {value}
        </span>
      )}

      {/* The bar itself */}
      <motion.div
        className={`w-full rounded-t-md border-t border-l border-r relative shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-300 ${style.bar}`}
        style={{ height: `${heightPercent}%` }}
        animate={
          state === "swapping"
            ? { scale: [1, 1.08, 1], transition: { duration: 0.4 } }
            : state === "comparing"
            ? { scale: [1, 1.03, 1], transition: { duration: 0.5, repeat: Infinity } }
            : {}
        }
      >
        {/* Glow effect */}
        {hasGlow && style.glow && (
          <div className={`absolute inset-0 ${style.glow} rounded-t-md mix-blend-screen`} />
        )}
      </motion.div>

      {/* Labels below bar */}
      <div className="mt-2 flex flex-col items-center">
        <span className={`text-xs font-bold font-mono transition-colors ${style.text}`}>
          {value}
        </span>
        <span className="text-[9px] text-white/40 mt-1 font-mono">
          idx {originalIndex}
        </span>
      </div>
    </motion.div>
  );
}
