import React, { useMemo, useEffect, useRef } from "react";
import { Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PseudocodeLine } from "@/frontend/lib/algorithmSnippets";

interface PseudocodePanelProps {
  pseudocode: PseudocodeLine[];
  currentLine: number | null;
}

export function PseudocodePanel({ pseudocode, currentLine }: PseudocodePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Find which pseudocode line maps to the current executing code line
  const activeIndex = useMemo(() => {
    if (currentLine === null) return -1;
    // Find the first pseudocode line whose 'lines' array includes the currentLine
    const index = pseudocode.findIndex((p) => p.lines.includes(currentLine));
    return index;
  }, [pseudocode, currentLine]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeIndex >= 0 && scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeIndex]);

  if (!pseudocode || pseudocode.length === 0) return null;

  return (
    <div className="absolute right-4 bottom-4 w-80 max-w-[40%] max-h-[60%] flex flex-col bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/40 shrink-0">
        <Code2 size={14} className="text-accentBlue" />
        <h3 className="text-xs font-semibold text-white/80">Pseudocode</h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 custom-scrollbar text-[11px] font-mono leading-relaxed">
        {pseudocode.map((line, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              data-active={isActive}
              className={`px-2 py-1 rounded ${
                isActive
                  ? "bg-accentBlue/20 text-accentBlue font-bold border-l-2 border-accentBlue"
                  : "text-white/60 border-l-2 border-transparent"
              }`}
            >
              <pre className="whitespace-pre-wrap">{line.text}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
