"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Layers, GitMerge, Database, BarChart3, TreePine, Beaker } from "lucide-react";
import { EditorPanel } from "@/frontend/components/EditorPanel";
import { MemoryBoard } from "@/frontend/components/MemoryBoard";
import { CallTreeView } from "@/frontend/components/CallTreeView";
import { TreeVisualizer } from "@/frontend/components/TreeVisualizer";
import { DatabaseBoard } from "@/frontend/components/DatabaseBoard/index";
import { ERDiagram } from "@/frontend/components/DatabaseBoard/ERDiagram";
import { AlgorithmVisualizer } from "@/frontend/components/AlgorithmVisualizer";
import { TestsPanel } from "@/frontend/components/TestsPanel";
import type { ExecutionStep, QueryStep, NoSQLStep } from "@/frontend/types";
import { AnimatePresence, motion } from "framer-motion";
import { fadeScaleVariant } from "@/frontend/lib/motion/variants";

const WorkspaceTab = ({ id, label, icon: Icon, activeTab, setActiveTab, activeColor = "text-accentBlue border-accentBlue", extraClasses = "" }: any) => {
  const isActive = activeTab === id;
  return (
    <div className={`relative group flex items-center justify-center ${extraClasses}`}>
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center justify-center p-2.5 border-t-2 border-b-0 transition-all duration-200 ${
          isActive 
            ? `${activeColor} bg-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]` 
            : `${activeColor.replace('text-', 'text-').replace('border-', 'border-transparent text-opacity-50 hover:text-opacity-100 hover:bg-white/5')}`
        }`}
      >
        <Icon size={16} />
      </button>
      <div className="absolute bottom-full mb-2 px-2 py-1 bg-[#1E293B] border border-white/10 shadow-lg text-white/90 text-[10px] font-medium whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {label}
      </div>
    </div>
  );
};

interface MainWorkspaceProps {
  activeSnippetId?: string;
  editorBottomBar?: React.ReactNode;
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
  colorblindMode?: boolean;
}

export function MainWorkspace({ 
  activeSnippetId,
  editorBottomBar,
  code, onChangeCode, currentLine, currentLanguage, engine, 
  errorLine, errorMessage, consoleOutput = "",
  testCode = "", onTestCodeChange = () => {}, onRunTests = () => {},
  isTestingRunning = false, testResult = null, uiLanguage = "en",
  prefersReducedMotion = false, colorblindMode = false
}: MainWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"memory" | "algorithm" | "tree" | "calltree" | "database" | "schema" | "tests" | "split">("memory");

  // Resizable Split Pane State
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    // Constrain between 20% and 80%
    setLeftWidth(Math.min(Math.max(newWidth, 20), 80));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Compute previous step for change detection
  const prevStep = engine.currentIndex > 0 ? engine.steps[engine.currentIndex - 1] : null;

  // Check if database tab should be shown
  const hasDbSteps = engine.steps.some((s: any) => 'affectedTables' in s || 'collections' in s);

  return (
    <div 
      ref={containerRef}
      className="flex min-h-0 flex-1 flex-col lg:flex-row"
    >
      <div 
        className="min-h-[40vh] lg:min-h-0 h-[40vh] lg:h-auto z-10 relative lg:flex-shrink-0 flex flex-col bg-[#010409]"
        style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
      >
        <div className="flex-1 min-h-0 relative">
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
      </div>

      {isDesktop && (
        <div className="w-0 relative z-50 flex items-center justify-center">
          <div 
            className="absolute -ml-1.5 w-3 h-full cursor-col-resize flex items-center justify-center group"
            onMouseDown={handleMouseDown}
          >
            <div className={`h-12 w-[1px] rounded-full transition-colors duration-150 ${isDragging ? 'bg-emerald-400' : 'bg-white/10 group-hover:bg-emerald-400/50'}`} />
          </div>
        </div>
      )}

      {/* Adding mt-4 on mobile since gap is removed from parent flex container */}
      <div className="flex flex-col min-h-[50vh] lg:min-h-0 relative z-10 rounded-t-3xl lg:rounded-none bg-[#010409]/80 backdrop-blur-md shadow-inner overflow-hidden border-t border-white/5 flex-1 mt-4 lg:mt-0 lg:border-l lg:border-white/5">
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
              ) : activeTab === "schema" && currentLanguage === "sql" ? (
                <ERDiagram code={code} />
              ) : activeTab === "algorithm" ? (
                <AlgorithmVisualizer step={engine.currentStep as ExecutionStep} activeSnippetId={activeSnippetId} uiLanguage={uiLanguage} prefersReducedMotion={prefersReducedMotion} colorblindMode={colorblindMode} />
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
                    <AlgorithmVisualizer step={engine.currentStep as ExecutionStep} activeSnippetId={activeSnippetId} uiLanguage={uiLanguage} prefersReducedMotion={prefersReducedMotion} colorblindMode={colorblindMode} />
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
        {/* Panel Footer with Tabs */}
        <div className="flex items-center gap-2 px-4 pt-0 pb-0 bg-[#010409]/60 backdrop-blur-md border-t border-white/5 mt-auto shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <WorkspaceTab id="memory" label="Memory" icon={Layers} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-blue-400 border-blue-400" />
          <WorkspaceTab id="algorithm" label="Algorithm" icon={BarChart3} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-pink-400 border-pink-400" />
          <WorkspaceTab id="tree" label="Tree" icon={TreePine} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-emerald-400 border-emerald-400" />
          <WorkspaceTab id="calltree" label="Call Tree" icon={GitMerge} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-orange-400 border-orange-400" />
          
          {(activeTab === "database" || hasDbSteps) && (
            <WorkspaceTab id="database" label="Database" icon={Database} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-indigo-400 border-indigo-400" />
          )}
          
          {currentLanguage === "sql" && (
            <WorkspaceTab id="schema" label="Schema (ER)" icon={Database} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-emerald-400 border-emerald-400" />
          )}
          
          <WorkspaceTab id="split" label="Split View" icon={Layers} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-purple-400 border-purple-400" />
          <WorkspaceTab id="tests" label="Tests" icon={Beaker} activeTab={activeTab} setActiveTab={setActiveTab} activeColor="text-green-400 border-green-400" />
          
          {editorBottomBar}
        </div>
      </div>
    </div>
  );
}
