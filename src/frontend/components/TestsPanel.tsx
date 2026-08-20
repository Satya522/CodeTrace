"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Play, Terminal, Loader2, CheckCircle, XCircle } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface TestsPanelProps {
  language: string;
  testCode: string;
  onTestCodeChange: (code: string) => void;
  onRunTests: () => void;
  isRunning: boolean;
  result: any;
}

export function TestsPanel({ language, testCode, onTestCodeChange, onRunTests, isRunning, result }: TestsPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#0a0f1a] text-white overflow-hidden relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-[#0d1320]">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-accentBlue" />
          <span className="font-semibold text-sm">Test Suite</span>
          <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5 ml-2 border border-white/5">
            {language}
          </span>
        </div>
        
        <button 
          onClick={onRunTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 bg-accentGreen/10 hover:bg-accentGreen/20 text-accentGreen rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-accentGreen/20"
        >
          {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {isRunning ? "Running Tests..." : "Run Tests"}
        </button>
      </div>

      {/* Editor Section */}
      <div className="flex-1 relative border-b border-white/10">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={language === "nosql" ? "javascript" : language}
          value={testCode}
          onChange={(v) => onTestCodeChange(v || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            padding: { top: 16 },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
          onMount={(editor, monaco) => {
            monaco.editor.setTheme("codetrace-dark");
          }}
        />
        {testCode.trim() === "" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 pointer-events-none font-mono text-sm text-center">
            Write assertions here...
            <br />
            <span className="text-xs opacity-50">Example: assert myFunc(1) == 2</span>
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="h-[40%] bg-[#050505] overflow-y-auto custom-scrollbar p-4 font-mono text-sm relative">
        {!result && !isRunning && (
          <div className="text-white/30 text-xs text-center mt-10">
            Terminal Output
          </div>
        )}
        
        {isRunning && (
          <div className="flex items-center justify-center text-accentBlue/70 mt-10 text-xs gap-2">
            <Loader2 size={16} className="animate-spin" />
            Executing on Piston Sandbox...
          </div>
        )}

        {result && !isRunning && (
          <div className="flex flex-col gap-3">
            <div className={`flex items-center gap-2 font-semibold ${result.run?.code === 0 ? "text-accentGreen" : "text-accentYellow"}`}>
              {result.run?.code === 0 ? <CheckCircle size={16} /> : <XCircle size={16} />}
              Exited with code {result.run?.code || 0}
            </div>
            
            {result.compile?.stderr && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 whitespace-pre-wrap text-xs">
                <div className="font-bold mb-1 opacity-70">Compilation Error:</div>
                {result.compile.stderr}
              </div>
            )}
            
            {result.run?.stderr && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 whitespace-pre-wrap text-xs">
                {result.run.stderr}
              </div>
            )}
            
            {result.run?.stdout && (
              <div className="bg-white/5 border border-white/10 rounded-md p-3 text-white/80 whitespace-pre-wrap text-xs">
                {result.run.stdout}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
