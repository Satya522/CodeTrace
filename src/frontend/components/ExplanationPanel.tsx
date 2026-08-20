import React from "react";
import { Bot } from "lucide-react";
import { ExecutionStep } from "@/frontend/types";

interface ExplanationPanelProps {
  step: ExecutionStep | null;
  uiLanguage?: "en" | "hi";
}

export function ExplanationPanel({ step, uiLanguage = "en" }: ExplanationPanelProps) {
  if (!step || !step.explanation?.en) {
    return (
      <div className="flex-1 bg-black/40 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center text-white/40">
        <Bot size={32} className="mb-3 opacity-20" />
        <p className="text-sm font-medium">No AI explanation available.</p>
        <p className="text-xs mt-1 max-w-[200px] opacity-70">
          Run your code to see AI step-by-step explanations here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-xl border border-white/10 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-accentBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 bg-[#0F172A]/50">
        <Bot size={16} className="text-accentBlue" />
        <h3 className="font-semibold text-white">Execution Explanation</h3>
        <span className="ml-auto text-xs font-mono text-white/30">Step {step.step}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-white/80 leading-relaxed text-[15px]">
            {step.explanation[uiLanguage] || step.explanation.en}
          </p>
        </div>
      </div>
    </div>
  );
}
