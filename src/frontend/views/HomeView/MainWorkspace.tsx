"use client";

import React, { useState } from "react";
import { Layers, GitMerge, Database, Box } from "lucide-react";
import { EditorPanel } from "@/frontend/components/EditorPanel";
import { MemoryBoard } from "@/frontend/components/MemoryBoard";
import { CallTreeView } from "@/frontend/components/CallTreeView";
import { DatabaseBoard } from "@/frontend/components/DatabaseBoard";
import { ExplanationPanel } from "@/frontend/components/ExplanationPanel";
import type { ExecutionStep, QueryStep, NoSQLStep } from "@/frontend/types";
import { AnimatePresence, motion } from "framer-motion";
import { fadeScaleVariant } from "@/frontend/lib/motion/variants";

interface MainWorkspaceProps {
  code: string;
  onChangeCode: (code: string) => void;
  currentLine: number | null;
  currentLanguage: any;
  engine: any;
}

  export function MainWorkspace({ code, onChangeCode, currentLine, currentLanguage, engine }: MainWorkspaceProps) {
    const [activeTab, setActiveTab] = useState<"memory" | "calltree" | "database">("memory");
  
    return (
      <div className="flex lg:grid min-h-0 flex-1 flex-col lg:grid-cols-2 gap-4">
        <div className="min-h-[40vh] lg:min-h-0 h-[40vh] lg:h-auto z-10 relative">
          <EditorPanel 
            code={code} 
            onChange={onChangeCode} 
            currentLine={currentLine} 
            language={currentLanguage}
          />
        </div>
        
        <div className="flex flex-col gap-2 min-h-[50vh] lg:min-h-0 relative z-10">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab("memory")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "memory" ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              <Layers size={14} /> Memory
            </button>
            <button
              onClick={() => setActiveTab("calltree")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "calltree" ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              <GitMerge size={14} /> Call Tree
            </button>
            {(activeTab === "database" || engine.steps.some((s: any) => 'affectedTables' in s || 'collections' in s)) && (
              <button
                onClick={() => setActiveTab("database")}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === "database" ? "bg-white/15 text-white shadow-sm" : "text-white/50 hover:text-white/90 hover:bg-white/5"
                }`}
              >
                <Database size={14} /> Database
              </button>
            )}
          </div>
          
          <div className="flex-1 min-h-0 relative rounded-xl border border-white/10 bg-black/40 shadow-inner overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={fadeScaleVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
              >
                {activeTab === "database" ? (
                   <DatabaseBoard 
                   sqlStep={engine.currentStep && 'affectedTables' in engine.currentStep ? (engine.currentStep as QueryStep) : null}
                   nosqlStep={engine.currentStep && 'collections' in engine.currentStep ? (engine.currentStep as NoSQLStep) : null}
                   prevSqlStep={engine.currentIndex > 0 && 'affectedTables' in engine.steps[engine.currentIndex - 1] ? (engine.steps[engine.currentIndex - 1] as QueryStep) : null}
                   prevNosqlStep={engine.currentIndex > 0 && 'collections' in engine.steps[engine.currentIndex - 1] ? (engine.steps[engine.currentIndex - 1] as NoSQLStep) : null}
                 />
                ) : activeTab === "memory" ? (
                  <MemoryBoard step={engine.currentStep as ExecutionStep} />
                ) : (
                  <CallTreeView step={engine.currentStep as ExecutionStep} allSteps={engine.steps as ExecutionStep[]} currentIndex={engine.currentIndex} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
