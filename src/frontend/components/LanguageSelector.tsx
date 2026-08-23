"use client";

import React, { useState, useRef, useEffect } from "react";
import { EXAMPLES } from "@/frontend/lib";
import { ExecutionBadge } from "./ExecutionBadge";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SiJavascript, SiPython, SiCplusplus, SiPostgresql, SiMongodb, SiTypescript, SiGo, SiRust, SiC } from "react-icons/si";
import { FaJava } from "react-icons/fa";

const LanguageIcons: Record<string, React.ElementType> = {
  javascript: SiJavascript,
  python: SiPython,
  java: FaJava,
  cpp: SiCplusplus,
  sql: SiPostgresql,
  nosql: SiMongodb,
  typescript: SiTypescript,
  go: SiGo,
  rust: SiRust,
  c: SiC,
};

const LanguageColors: Record<string, string> = {
  javascript: "#F7DF1E",
  python: "#3776AB",
  java: "#E32C2E", // Oracle Java Red
  cpp: "#00599C",
  sql: "#336791", // PostgreSQL Blue
  nosql: "#47A248", // MongoDB Green
  typescript: "#3178C6",
  go: "#00ADD8",
  rust: "#DEA584",
  c: "#A8B9CC",
};

export function LanguageSelector({
  selectedId,
  currentLanguage,
  onChange,
}: {
  selectedId: string;
  currentLanguage?: string;
  onChange: (id: string) => void;
}) {
  const currentExample = EXAMPLES.find((ex) => ex.id === selectedId) || EXAMPLES.find((ex) => ex.id === currentLanguage);
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
  
  const mode = ["python", "javascript", "typescript", "cpp", "c", "sql", "nosql"].includes(currentExample?.language || "")
    ? "live"
    : "simulated";

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/[0.06] border-t-cyan-300/[0.2] bg-[#0C111C]/70 px-3.5 py-1 text-xs font-mono font-medium text-white/90 shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.08]"
      >
        {currentExample?.id && LanguageIcons[currentExample.id] && (
          React.createElement(LanguageIcons[currentExample.id], { 
            color: LanguageColors[currentExample.id] || "currentColor", 
            size: 14 
          })
        )}
        {currentExample?.name || "Select Language"}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-white/50" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-48 rounded-2xl border border-white/[0.06] border-t-cyan-300/[0.2] bg-[#0C111C]/70 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_40px_-15px_rgba(94,234,212,0.25)] backdrop-blur-2xl z-50 flex flex-col gap-0.5"
          >
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => { onChange(ex.id); setIsOpen(false); }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-mono font-medium transition-colors w-full text-left duration-200 ${
                  selectedId === ex.id 
                    ? "bg-cyan-400/10 text-cyan-200" 
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {LanguageIcons[ex.id] && React.createElement(LanguageIcons[ex.id], { 
                  color: LanguageColors[ex.id] || "currentColor", 
                  size: 14 
                })}
                <span className="flex-1">{ex.name}</span>
                {selectedId === ex.id && <Check size={14} className="text-cyan-300" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <ExecutionBadge mode={mode} />
    </div>
  );
}
