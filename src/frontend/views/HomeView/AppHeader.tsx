"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Share2, Github, Database, Loader2, Check, Play, Pause, SkipBack, SkipForward, RotateCcw, Maximize, Minimize, Menu, X, Gauge } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LanguageSelector } from "@/frontend/components/LanguageSelector";
import { SnippetPicker } from "@/frontend/components/SnippetPicker";
import type { AlgorithmSnippet } from "@/frontend/lib/algorithmSnippets";
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
  onSnippetSelect?: (snippet: AlgorithmSnippet) => void;
  onRun: () => void;
  onLoadWorkspaces: () => void;
  engine: any;
  uiLanguage: "en" | "hi";
  setUiLanguage: (lang: "en" | "hi") => void;
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
  onSnippetSelect,
  onRun,
  onLoadWorkspaces,
  engine,
  uiLanguage,
  setUiLanguage,
}: AppHeaderProps) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleShare = () => {
    try {
      // Handle non-Latin1 characters safely by URI encoding before base64
      const encodedCode = btoa(encodeURIComponent(code));
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
    <header className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 shadow-2xl backdrop-blur-xl z-20 transition-all hover:bg-white/10">
      <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="LogicTrace Logo" className="w-5 h-5 object-contain" />
          <h1 className="text-sm font-semibold tracking-tight">LogicTrace</h1>
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

        {onSnippetSelect && (
          <SnippetPicker
            currentLanguage={currentLanguage}
            onSelect={onSnippetSelect}
          />
        )}

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
            
            {/* Timeline slider */}
            <input
              type="range"
              min={0}
              max={Math.max(engine.steps.length - 1, 0)}
              value={engine.currentIndex}
              onChange={(e) => engine.goToStep(parseInt(e.target.value))}
              className="w-20 lg:w-32 h-1 accent-accentBlue bg-white/10 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accentBlue [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(59,130,246,0.5)]"
              title={`Step ${engine.currentIndex + 1} of ${engine.steps.length}`}
            />
            
            <div className="text-[11px] font-mono text-white/50 px-2 min-w-[40px] text-center">
              {engine.currentIndex + 1}/{engine.steps.length}
            </div>
            
            {/* Speed control */}
            <div className="flex items-center gap-1.5 ml-1 border-l border-white/10 pl-2">
              <Gauge size={12} className="text-white/40 shrink-0" />
              <select
                value={engine.speed}
                onChange={(e) => engine.setSpeed(Number(e.target.value))}
                className="bg-transparent text-[11px] font-mono text-white/70 border-none outline-none cursor-pointer appearance-none pr-1 hover:text-white transition-colors [&>option]:bg-[#0F172A] [&>option]:text-white"
                title="Playback speed"
              >
                <option value={3600}>0.25×</option>
                <option value={1800}>0.5×</option>
                <option value={900}>1×</option>
                <option value={450}>2×</option>
                <option value={225}>4×</option>
              </select>
            </div>
          </div>
        )}
        
        <button
          onClick={handleShare}
          className={`ml-2 flex items-center justify-center h-8 px-3 rounded-lg border text-xs font-semibold transition-colors ${
            copied 
              ? 'bg-accentGreen/10 border-accentGreen/30 text-accentGreen' 
              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
          }`}
          title="Share Link"
        >
          {copied ? <Check size={14} className="mr-1.5" /> : <Share2 size={14} className="mr-1.5" />}
          {copied ? "Copied" : "Share"}
        </button>
        
        <button
          onClick={() => setUiLanguage(uiLanguage === "en" ? "hi" : "en")}
          className="ml-2 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors"
          title="Toggle Language (English / Hindi)"
        >
          {uiLanguage === "en" ? "A/अ" : "अ/A"}
        </button>
        
        <div className="relative ml-2" ref={menuRef}>
          <Button variant="secondary" onClick={() => setIsMenuOpen(!isMenuOpen)} title="Menu">
            {isMenuOpen ? <X size={16} className="text-white/80" /> : <Menu size={16} className="text-white/80" />}
          </Button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#0F172A]/95 p-2 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1"
              >
                <button
                  onClick={() => { onToggleAiMode(); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all w-full text-left ${isAiMode ? "bg-accentBlue/10 text-accentBlue" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                >
                  <Sparkles size={15} className={isAiMode ? "text-accentBlue" : "text-white/40"} />
                  {isAiMode ? "AI Mode: ON" : "AI Mode"}
                </button>

                <button 
                  onClick={() => { toggleFullscreen(); setIsMenuOpen(false); }} 
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all w-full text-left"
                >
                  {isFullscreen ? <Minimize size={15} className="text-white/40" /> : <Maximize size={15} className="text-white/40" />}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
                
                <a 
                  href="https://github.com/Satya522/CodeTrace" 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all w-full text-left"
                >
                  <Github size={15} className="text-white/40" /> GitHub
                </a>

                <div className="h-px w-full bg-white/10 my-1" />
                
                {session ? (
                  <>
                    <button
                      onClick={() => { onLoadWorkspaces(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all w-full text-left"
                    >
                      <Database size={15} className="text-white/40" /> My Workspaces
                    </button>
                    <button 
                      onClick={() => { handleSaveSnippet(); setIsMenuOpen(false); }} 
                      disabled={isSaving} 
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-accentGreen hover:bg-accentGreen/10 transition-all w-full text-left"
                    >
                      {isSaving ? <Loader2 size={15} className="animate-spin text-accentGreen" /> : <Database size={15} className="text-accentGreen" />}
                      {isSaving ? "Saving..." : "Save to Cloud"}
                    </button>
                    <button
                      onClick={() => { signOut(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-accentRed/80 hover:bg-accentRed/10 hover:text-accentRed transition-all w-full text-left"
                    >
                       Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { signIn(); setIsMenuOpen(false); }} 
                    className="flex items-center justify-center rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 bg-white/5 hover:bg-white/10 hover:text-white transition-all w-full"
                  >
                     Sign In
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
