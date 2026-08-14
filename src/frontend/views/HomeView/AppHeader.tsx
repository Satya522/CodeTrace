"use client";

import React, { useState } from "react";
import { Sparkles, Share2, Github, Database, Loader2, Check, Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LanguageSelector } from "@/frontend/components/LanguageSelector";
import { Button } from "@/frontend/components/ui/Button";
import { EXAMPLES } from "@/frontend/lib/index";
import { AnimatePresence, motion } from "framer-motion";
import { fadeScaleVariant } from "@/frontend/lib/motion/variants";

interface AppHeaderProps {
  selectedExampleId: string;
  currentLanguage: any;
  code: string;
  isRunning: boolean;
  isPlaying: boolean;
  isAiMode: boolean;
  onToggleAiMode: () => void;
  onLanguageChange: (id: string, language: any, code: string) => void;
  onRun: () => void;
  onLoadWorkspaces: () => void;
  engine: any;
}

export function AppHeader({
  selectedExampleId,
  currentLanguage,
  code,
  isRunning,
  isPlaying,
  isAiMode,
  onToggleAiMode,
  onLanguageChange,
  onRun,
  onLoadWorkspaces,
  engine,
}: AppHeaderProps) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    try {
      const encodedCode = btoa(code);
      const url = new URL(window.location.href);
      url.searchParams.set("code", encodedCode);
      url.searchParams.set("lang", currentLanguage);
      url.searchParams.set("autorun", "1");
      
      navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to encode URL");
    }
  };

  const handleSaveSnippet = async () => {
    if (!session) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Saved Snippet " + new Date().toLocaleString(),
          code: code,
          language: currentLanguage
        })
      });
      if (res.ok) alert("Saved to cloud!");
      else alert("Failed to save.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 shadow-2xl backdrop-blur-xl z-20 transition-all hover:bg-white/10">
      <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accentBlue" />
          <h1 className="text-sm font-semibold tracking-tight">CodeTrace</h1>
        </div>
        <span className="rounded-full border border-accentGreen/40 bg-accentGreen/10 px-2 py-0.5 text-[11px] font-medium text-accentGreen">
          100% Free &amp; Open Source
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-3 w-full lg:w-auto justify-center">
        <LanguageSelector
          selectedId={selectedExampleId}
          onChange={(id) => {
            const ex = EXAMPLES.find((x) => x.id === id);
            if (ex) onLanguageChange(id, ex.language, ex.code);
          }}
        />

        <Button
          variant="primary"
          onClick={onRun}
          disabled={isPlaying || isRunning}
        >
          {isRunning && <Loader2 size={13} className="animate-spin" />}
          {isRunning ? "Running…" : "Run"}
        </Button>

        {engine.steps.length > 0 && (
          <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10 ml-2">
            <Button variant="icon" onClick={engine.reset} title="Reset">
              <RotateCcw size={14} />
            </Button>
            <Button variant="icon" onClick={engine.prev} title="Step back">
              <SkipBack size={14} />
            </Button>
            <Button 
              variant="primary" 
              className="!p-1.5 h-7 w-7 flex items-center justify-center rounded-md" 
              onClick={isPlaying ? engine.pause : engine.play} 
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </Button>
            <Button variant="icon" onClick={engine.next} title="Step forward">
              <SkipForward size={14} />
            </Button>
            <div className="text-[11px] font-mono text-white/50 px-2 min-w-[40px] text-center">
              {engine.currentIndex + 1}/{engine.steps.length}
            </div>
          </div>
        )}
        
        <Button
          variant={isAiMode ? "primary" : "secondary"}
          onClick={onToggleAiMode}
          className={isAiMode ? "!bg-accentBlue/20 !text-accentBlue !border-accentBlue/40" : ""}
          title="Toggle AI-Powered Execution Tracing"
        >
          <Sparkles size={14} className={isAiMode ? "text-accentBlue" : "text-white/40"} />
          {isAiMode ? "AI Mode: ON" : "AI Mode"}
        </Button>
        
        <Button variant="secondary" onClick={handleShare} title="Copy Shareable Link">
          {copied ? <Check size={14} className="text-accentGreen" /> : <Share2 size={14} />}
          {copied ? "Copied!" : "Share"}
        </Button>

        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 transition hover:text-white/80 p-1.5">
          <Github size={18} />
        </a>

        <div className="h-4 w-px bg-white/10 mx-1" />
        
        {session ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onLoadWorkspaces}
              className="text-xs font-semibold text-accentBlue hover:text-accentBlue/80 transition"
            >
              My Workspaces
            </button>
            <Button variant="secondary" onClick={handleSaveSnippet} disabled={isSaving} className="!bg-accentGreen/10 !text-accentGreen !border-accentGreen/40 hover:!bg-accentGreen/20">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
              {isSaving ? "Saving..." : "Save to Cloud"}
            </Button>
            <button
              onClick={() => signOut()}
              className="text-xs font-medium text-white/60 hover:text-white transition"
            >
              Sign Out ({session.user?.name})
            </button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
