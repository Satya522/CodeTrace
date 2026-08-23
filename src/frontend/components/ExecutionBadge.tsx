import type { ExecutionMode } from "@/frontend/types";
import { motion } from "framer-motion";

export function ExecutionBadge({ mode }: { mode: ExecutionMode }) {
  const isLive = mode === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider backdrop-blur-sm ${
        isLive
          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
          : "border-amber-400/20 bg-amber-500/10 text-amber-300"
      }`}
    >
      <motion.span
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400"}`}
        style={{ boxShadow: "0 0 6px currentColor" }}
      />
      {isLive ? "Live Trace" : "AI-Simulated"}
    </span>
  );
}
