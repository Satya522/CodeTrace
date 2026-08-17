"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { MainWorkspace } from "./MainWorkspace";

import { ComplexityCounterBar } from "@/frontend/components/ComplexityCounterBar";
import { PredictMode } from "@/frontend/components/PredictMode";
import { CommandPalette } from "@/frontend/components/CommandPalette";
import { useVisualizerEngine } from "@/frontend/hooks/useVisualizerEngine";
import { runPythonTrace } from "@/frontend/engines/pythonEngine";
import { runJsTrace } from "@/frontend/engines/jsEngine";
import { runPistonTrace } from "@/backend/services/pistonEngine";
import { executeSql } from "@/database/engines/sqlEngine";
import { executeNoSql } from "@/database/engines/nosqlEngine";
import { runAITrace } from "@/frontend/engines/aiEngine";
import { EXAMPLES } from "@/frontend/lib/index";
import type { ExecutionStep } from "@/frontend/types";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles } from "lucide-react";
import { fadeScaleVariant } from "@/frontend/lib/motion/variants";

export function CodeTraceApp() {
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<any[]>([]);
  const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLES[0].id);
  const [currentLanguage, setCurrentLanguage] = useState(EXAMPLES[0].language);
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  
  const engine = useVisualizerEngine();
  const searchParams = useSearchParams();

  // Accumulate console output from all steps up to the current index
  const accumulatedConsoleOutput = useMemo(() => {
    if (engine.steps.length === 0) return "";
    const outputs: string[] = [];
    for (let i = 0; i <= engine.currentIndex; i++) {
      const s = engine.steps[i] as any;
      if (s?.consoleOutput) {
        outputs.push(s.consoleOutput);
      }
    }
    return outputs.join("\n");
  }, [engine.steps, engine.currentIndex]);

  useEffect(() => {
    const sharedCode = searchParams.get("code");
    const lang = searchParams.get("lang") || "javascript";
    const autorun = searchParams.get("autorun");
    if (sharedCode) {
      try {
        const decoded = atob(sharedCode);
        setCode(decoded);
        setSelectedExampleId("custom");
        setCurrentLanguage(lang as any);
        if (autorun === "1") {
          setTimeout(() => handleRun(), 500);
        }
      } catch (e) {
        console.error("Failed to decode shared code");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const engineRef = useRef(engine);
  engineRef.current = engine;
  const cmdPaletteRef = useRef(setIsCommandPaletteOpen);
  cmdPaletteRef.current = setIsCommandPaletteOpen;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        cmdPaletteRef.current(true);
      }
      if (e.key === " " && document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        eng.isPlaying ? eng.pause() : eng.play();
      }
      if (e.key === "ArrowRight" && document.activeElement?.tagName !== "TEXTAREA") {
        eng.next();
      }
      if (e.key === "ArrowLeft" && document.activeElement?.tagName !== "TEXTAREA") {
        eng.prev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function handleRun() {
    setIsRunning(true);
    setErrorMsg(null);
    setErrorLine(null);
    try {
      let trace;
      if (isAiMode) {
        trace = await runAITrace(code);
      } else if (currentLanguage === "sql") {
        trace = await executeSql(code);
      } else if (currentLanguage === "nosql") {
        trace = executeNoSql(code);
      } else if (currentLanguage === "javascript") {
        trace = await runJsTrace(code);
      } else if (currentLanguage === "python") {
        trace = await runPythonTrace(code);
      } else {
        trace = await runPistonTrace(code, currentLanguage);
      }
      
      const errorMsgStr = trace.error || null;
      if (errorMsgStr) {
        setErrorMsg(errorMsgStr);
        // Try to parse line number
        const match = errorMsgStr.match(/(?:line\s+|:)(\d+)/i);
        if (match && match[1]) {
          setErrorLine(parseInt(match[1], 10));
        }
      }
      engine.setSteps(trace.steps as any);
    } catch (err: any) {
      const errorMsgStr = err?.message ?? "Failed to run code.";
      setErrorMsg(errorMsgStr);
      const match = errorMsgStr.match(/(?:line\s+|:)(\d+)/i);
      if (match && match[1]) {
        setErrorLine(parseInt(match[1], 10));
      }
    } finally {
      setIsRunning(false);
    }
  }

  const loadWorkspaces = async () => {
    setShowWorkspaces(true);
    try {
      const res = await fetch("/api/snippets");
      if (res.ok) {
        const data = await res.json();
        setSavedSnippets(data.snippets || []);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const commands = [
    { id: "play", name: "Play Execution", icon: <Play size={16} />, action: engine.play },
    { id: "pause", name: "Pause Execution", icon: <Pause size={16} />, action: engine.pause },
    { id: "next", name: "Next Step", icon: <SkipForward size={16} />, action: engine.next },
    { id: "prev", name: "Previous Step", icon: <SkipBack size={16} />, action: engine.prev },
    { id: "reset", name: "Reset Execution", icon: <RotateCcw size={16} />, action: engine.reset },
    { id: "run", name: "Run Code", icon: <Sparkles size={16} />, action: handleRun },
  ];

  return (
    <main className="flex lg:h-screen min-h-screen flex-col gap-4 p-2 lg:p-4 text-white/90 relative">
      <AppHeader
        selectedExampleId={selectedExampleId}
        currentLanguage={currentLanguage}
        code={code}
        isRunning={isRunning}
        isPlaying={engine.isPlaying}
        isAiMode={isAiMode}
        onToggleAiMode={() => setIsAiMode(!isAiMode)}
        onLanguageChange={(id, lang, exCode) => {
          setSelectedExampleId(id);
          setCurrentLanguage(lang);
          setCode(exCode);
          setErrorMsg(null);
          setErrorLine(null);
          engine.setSteps([]);
        }}
        onRun={handleRun}
        onLoadWorkspaces={loadWorkspaces}
        engine={engine}
      />

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-accentRed/40 bg-accentRed/10 px-3 py-2 text-xs text-accentRed">
          {errorMsg}
        </motion.div>
      )}

      {engine.steps.length > 0 && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex-1 min-h-[2.25rem] rounded-full bg-black/40 border border-accentBlue/20 px-5 py-2 text-sm text-accentBlue/90 relative z-10 shadow-inner flex items-center">
            <Sparkles size={14} className="mr-2 opacity-70" />
            {engine.currentStep ? (engine.currentStep.explanation?.en || "Executing step...") : "Run your code to start stepping through it."}
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <ComplexityCounterBar 
              counters={engine.currentStep && 'counters' in engine.currentStep ? engine.currentStep.counters : undefined} 
              history={engine.steps.slice(0, engine.currentIndex + 1).map((s: any) => 'counters' in s ? s.counters : undefined).filter(Boolean) as any}
            />
          </div>
        </div>
      )}

      <MainWorkspace
        code={code}
        onChangeCode={(newCode) => {
          setCode(newCode);
          if (errorMsg) setErrorMsg(null);
          if (errorLine) setErrorLine(null);
        }}
        currentLine={engine.currentStep && 'line' in engine.currentStep ? engine.currentStep.line : null}
        currentLanguage={currentLanguage}
        engine={engine}
        errorLine={errorLine}
        errorMessage={errorMsg}
        consoleOutput={accumulatedConsoleOutput}
      />



      
      {engine.showPredictMode && (
        <PredictMode onContinue={engine.resolvePredictMode} variableContext={engine.currentStep?.explanation?.en} />
      )}

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} commands={commands} />

      <AnimatePresence>
        {showWorkspaces && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              variants={fadeScaleVariant} initial="hidden" animate="visible" exit="exit"
              className="w-[500px] max-w-full rounded-2xl border border-white/10 bg-[#0a0a0a]/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-white">My Workspaces</h2>
                <button onClick={() => setShowWorkspaces(false)} className="text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1">
                  &times;
                </button>
              </div>
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {savedSnippets.length === 0 ? (
                  <div className="text-center text-sm text-white/40 py-8 font-medium">No saved workspaces yet.</div>
                ) : (
                  savedSnippets.map((s: any) => (
                    <motion.button 
                      whileHover={{ scale: 1.01, x: 2 }} whileTap={{ scale: 0.99 }}
                      key={s.id} 
                      className="text-left rounded-xl border border-white/5 bg-white/5 p-4 hover:border-accentBlue/40 hover:bg-white/10 transition-all duration-200 group relative overflow-hidden"
                      onClick={() => { setCode(s.code); setCurrentLanguage(s.language); setSelectedExampleId("custom"); setShowWorkspaces(false); }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accentBlue/0 via-accentBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="font-semibold text-sm text-white/90 group-hover:text-white relative z-10">{s.title}</div>
                      <div className="text-xs font-medium text-white/40 mt-1.5 flex justify-between relative z-10">
                        <span className="capitalize text-accentBlue/70">{s.language}</span>
                        <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
