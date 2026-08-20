"use client";

import React, { useState } from "react";
import { Layers, GitMerge, Database, BarChart3, TreePine } from "lucide-react";
import { EditorPanel } from "@/frontend/components/EditorPanel";
import { MemoryBoard } from "@/frontend/components/MemoryBoard";
import { CallTreeView } from "@/frontend/components/CallTreeView";
import { TreeVisualizer } from "@/frontend/components/TreeVisualizer";
import { DatabaseBoard } from "@/frontend/components/DatabaseBoard/index";
import { AlgorithmVisualizer } from "@/frontend/components/AlgorithmVisualizer";
import { TestsPanel } from "@/frontend/components/TestsPanel";
import type { ExecutionStep, QueryStep, NoSQLStep } from "@/frontend/types";
import { AnimatePresence, motion } from "framer-motion";
import { fadeScaleVariant } from "@/frontend/lib/motion/variants";

interface MainWorkspaceProps {
  activeSnippetId?: string;
  code: string;
  onChangeCode: (code: string) => void;
  currentLine: number | null;
  currentLanguage: any;
  engine: any;
  errorLine?: number | null;
  errorMessage?: string | null;
  consoleOutput?: string;
  testCode?: string;
  onTestCodeChange?: (code: string) => void;
  onRunTests?: () => void;
  isTestingRunning?: boolean;
  testResult?: any;
  uiLanguage?: "en" | "hi";
  prefersReducedMotion?: boolean;
}

export function MainWorkspace({ 
  activeSnippetId, code, onChangeCode, currentLine, currentLanguage, engine, 
  errorLine, errorMessage, consoleOutput = "",
  testCode = "", onTestCodeChange = () => {}, onRunTests = () => {},
  isTestingRunning = false, testResult = null, uiLanguage = "en",
  prefersReducedMotion = false
}: MainWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"memory" | "algorithm" | "tree" | "calltree" | "database" | "tests" | "split">("memory");

  // Compute previous step for change detection
  const prevStep = engine.currentIndex > 0 ? engine.steps[engine.currentIndex - 1] : null;

  // Check if database tab should be shown
  const hasDbSteps = engine.steps.some((s: any) => 'affectedTables' in s || 'collections' in s);

  return (
    <div className="flex lg:grid min-h-0 flex-1 flex-col lg:grid-cols-2 gap-4">
      <div className="min-h-[40vh] lg:min-h-0 h-[40vh] lg:h-auto z-10 relative">
        <EditorPanel
          code={code}
          onChange={onChangeCode}
          currentLine={currentLine}
          language={currentLanguage}
          errorLine={errorLine}
          errorMessage={errorMessage}
          onLineClick={(lineNumber: number) => {
            engine.goToLine(lineNumber);
          }}
        />
      </div>

      <div className="flex flex-col min-h-[50vh] lg:min-h-0 relative z-10 rounded-t-3xl rounded-b-none bg-[#0F172A]/80 backdrop-blur-md shadow-inner overflow-hidden border-t border-white/5">
        {/* Panel Header with Tabs */}
        <div className="flex items-center gap-4 px-4 pt-3 pb-0 bg-black/20 border-b border-white/5 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("memory")}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ${
              activeTab === "memory" ? "text-accentBlue border-accentBlue" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
            }`}
          >
            <Layers size={14} /> Memory
          </button>
          <button
            onClick={() => setActiveTab("algorithm")}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ${
              activeTab === "algorithm" ? "text-accentBlue border-accentBlue" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
            }`}
          >
            <BarChart3 size={14} /> Algorithm
          </button>
          <button
            onClick={() => setActiveTab("tree")}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ${
              activeTab === "tree" ? "text-accentBlue border-accentBlue" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
            }`}
          >
            <TreePine size={14} /> Tree
          </button>
          <button
            onClick={() => setActiveTab("calltree")}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ${
              activeTab === "calltree" ? "text-accentBlue border-accentBlue" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
            }`}
          >
            <GitMerge size={14} /> Call Tree
          </button>
          {(activeTab === "database" || hasDbSteps) && (
            <button
              onClick={() => setActiveTab("database")}
              className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ${
                activeTab === "database" ? "text-accentBlue border-accentBlue" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
              }`}
            >
              <Database size={14} /> Database
            </button>
          )}
          <button
            onClick={() => setActiveTab("split")}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ml-auto ${
              activeTab === "split" ? "text-purple-400 border-purple-400" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
            }`}
          >
            <Layers size={14} /> Split View
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap border-b-2 ml-4 ${
              activeTab === "tests" ? "text-accentGreen border-accentGreen" : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
            }`}
          >
            Tests
          </button>
        </div>

        <div className="flex-1 min-h-0 relative">
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
                  uiLanguage={uiLanguage}
                />
              ) : activeTab === "algorithm" ? (
                <AlgorithmVisualizer step={engine.currentStep as ExecutionStep} activeSnippetId={activeSnippetId} uiLanguage={uiLanguage} prefersReducedMotion={prefersReducedMotion} />
              ) : activeTab === "tree" ? (
                <TreeVisualizer step={engine.currentStep as ExecutionStep} uiLanguage={uiLanguage} prefersReducedMotion={prefersReducedMotion} />
              ) : activeTab === "memory" ? (
                <MemoryBoard
                  step={engine.currentStep as ExecutionStep}
                  prevStep={prevStep as ExecutionStep | null}
                  consoleOutput={consoleOutput}
                />
              ) : activeTab === "split" ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1 min-h-0 border-b border-white/10">
                    <MemoryBoard
                      step={engine.currentStep as ExecutionStep}
                      prevStep={prevStep as ExecutionStep | null}
                      consoleOutput={consoleOutput}
                    />
                  </div>
                  <div className="flex-[1.5] min-h-0">
                    <AlgorithmVisualizer step={engine.currentStep as ExecutionStep} activeSnippetId={activeSnippetId} uiLanguage={uiLanguage} prefersReducedMotion={prefersReducedMotion} />
                  </div>
                </div>
              ) : activeTab === "tests" ? (
                <TestsPanel
                  language={currentLanguage}
                  testCode={testCode}
                  onTestCodeChange={onTestCodeChange}
                  onRunTests={onRunTests}
                  isRunning={isTestingRunning}
                  result={testResult}
                />
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
