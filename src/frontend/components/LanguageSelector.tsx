"use client";

import React, { useState, useRef, useEffect } from "react";
import { EXAMPLES } from "@/frontend/lib";
import { ExecutionBadge } from "./ExecutionBadge";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function LanguageSelector({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const currentExample = EXAMPLES.find((ex) => ex.id === selectedId);
  const [isOpen, setIsOpen] = useState(false);
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
  
  const mode = ["python", "javascript", "sql", "nosql"].includes(currentExample?.language || "")
    ? "live"
    : "simulated";

  return (
    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border bg-black/30 px-4 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 transition-all"
      >
        {currentExample?.name || "Select Language"}
        <ChevronDown size={14} className={`transition-transform text-white/40 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 w-48 rounded-2xl border border-white/10 bg-[#0F172A]/95 p-2 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => { onChange(ex.id); setIsOpen(false); }}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all w-full text-left ${
                  selectedId === ex.id 
                    ? "bg-accentBlue/10 text-accentBlue" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {ex.name}
                {selectedId === ex.id && <Check size={14} className="text-accentBlue" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <ExecutionBadge mode={mode} />
    </div>
  );
}
