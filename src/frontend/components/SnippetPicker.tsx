"use client";

import React, { useState, useRef, useEffect } from "react";
import { BookOpen, ChevronDown, Check, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_SNIPPETS, CATEGORY_LABELS, type AlgorithmSnippet } from "@/frontend/lib/algorithmSnippets";

interface SnippetPickerProps {
  currentLanguage: string;
  onSelect: (snippet: AlgorithmSnippet) => void;
}

export function SnippetPicker({ currentLanguage, onSelect }: SnippetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const snippets = ALL_SNIPPETS[currentLanguage] || [];

  const grouped = snippets.reduce((acc, snippet) => {
    if (!acc[snippet.category]) acc[snippet.category] = [];
    acc[snippet.category].push(snippet);
    return acc;
  }, {} as Record<string, AlgorithmSnippet[]>);

  if (snippets.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/[0.06] border-t-cyan-300/[0.2] bg-[#0C111C]/70 px-3.5 py-1 text-xs font-mono font-medium text-white/90 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.08]"
      >
        <BookOpen size={14} className="opacity-70" />
        Examples
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="opacity-50" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-64 rounded-2xl border border-white/[0.06] border-t-cyan-300/[0.2] bg-[#0C111C]/70 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_40px_-15px_rgba(94,234,212,0.25)] backdrop-blur-2xl z-50 max-h-[70vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 mb-2">
              <Sparkles size={14} className="text-white/60" />
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Algorithm Examples</span>
            </div>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-3 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  {CATEGORY_LABELS[category] || category}
                </div>

                <div className="flex flex-col gap-0.5">
                  {items.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => {
                        setSelectedId(snippet.id);
                        onSelect(snippet);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-[12px] font-medium transition-colors duration-200 ${
                        selectedId === snippet.id
                          ? "bg-cyan-400/10 text-cyan-200"
                          : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span>{snippet.name}</span>
                      {selectedId === snippet.id && <Check size={14} className="text-cyan-300" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
