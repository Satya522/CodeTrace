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

  // Group snippets by category
  const grouped = snippets.reduce((acc, snippet) => {
    if (!acc[snippet.category]) acc[snippet.category] = [];
    acc[snippet.category].push(snippet);
    return acc;
  }, {} as Record<string, AlgorithmSnippet[]>);

  if (snippets.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-accentPurple/30 bg-accentPurple/10 px-3 py-1.5 text-xs font-medium text-accentPurple hover:bg-accentPurple/20 transition-all"
      >
        <BookOpen size={13} />
        Examples
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#0F172A]/95 p-2 shadow-2xl backdrop-blur-xl z-50 max-h-[70vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 mb-1">
              <Sparkles size={14} className="text-accentPurple" />
              <span className="text-xs font-bold text-white/70">Algorithm Examples</span>
            </div>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-1">
                {/* Category header */}
                <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider">
                  {CATEGORY_LABELS[category] || category}
                </div>

                {items.map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => {
                      setSelectedId(snippet.id);
                      onSelect(snippet);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                      selectedId === snippet.id
                        ? "bg-accentPurple/15 text-accentPurple"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{snippet.name}</span>
                    {selectedId === snippet.id && <Check size={13} className="text-accentPurple" />}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
