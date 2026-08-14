import React from "react";
import type { ExecutionStep } from "@/frontend/types";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ExplanationPanelProps {
  step: ExecutionStep | null;
}

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  if (!step || !step.explanation?.en) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl text-sm text-white/40">
        Run your code to see AI step-by-step explanations here.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
        <Sparkles size={18} className="text-accentBlue" />
        <h3 className="font-semibold text-white">Execution Explanation</h3>
      </div>
      
      <motion.div 
        key={step.step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">
          {step.explanation.en}
        </p>
      </motion.div>
    </div>
  );
}
