"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Share2, Github, Database, Loader2, Check, Play, Pause, SkipBack, SkipForward, RotateCcw, Maximize, Minimize, Menu, X, Gauge, Eye, Palette, Columns2, Code, Swords, Video, Square, Target, LayoutDashboard } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LanguageSelector } from "@/frontend/components/LanguageSelector";
import { SnippetPicker } from "@/frontend/components/SnippetPicker";
import type { AlgorithmSnippet } from "@/frontend/lib/algorithmSnippets";
import { EXAMPLES } from "@/frontend/lib/index";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface AppHeaderProps {
  isEmbed?: boolean;
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
  prefersReducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  colorblindMode?: boolean;
  onToggleColorblindMode?: () => void;
  onOpenDiffMode?: () => void;
  onOpenRaceMode?: () => void;
  onBackToHome?: () => void;
}

const TooltipButton = ({ 
  icon: Icon, 
  onClick, 
  tooltip, 
  isActive = false, 
  activeClass = "text-emerald-400", 
  defaultClass = "text-white/70",
  className = "",
  disabled = false,
  pulse = false
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative flex items-center justify-center" 
         onMouseEnter={() => setIsHovered(true)} 
         onMouseLeave={() => setIsHovered(false)}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
        onClick={onClick}
        className={`flex items-center justify-center w-[32px] h-[32px] rounded-full transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'} ${className}`}
      >
        <Icon size={16} className={`${isActive ? activeClass : defaultClass} ${pulse ? 'animate-pulse' : ''}`} fill={pulse ? "currentColor" : "none"} />
      </motion.button>
      <AnimatePresence>
        {isHovered && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ delay: 0.15, duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-black/80 backdrop-blur-md text-white/90 text-[11px] font-medium whitespace-nowrap rounded-md shadow-lg pointer-events-none z-50 border border-white/10"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  prefersReducedMotion = false,
  onToggleReducedMotion = () => {},
  colorblindMode = false,
  onToggleColorblindMode = () => {},
  onOpenDiffMode = () => {},
  onOpenRaceMode = () => {},
  onBackToHome,
  isEmbed = false,
}: AppHeaderProps) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <>
      {/* Ambient mesh glow — sits fixed behind the page so the header's
          backdrop-blur actually has color/light to blur. Without this,
          glassmorphism on a flat background is invisible by definition. */}
      <div className="fixed inset-x-0 top-0 h-[440px] -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Circuit-board grid — grounds the "trace" concept, not decoration */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,230,118,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.5) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        {/* Channel 1 — cyan */}
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-36 left-[6%] w-[380px] h-[380px] rounded-full bg-emerald-400/20 blur-[120px]"
        />
        {/* Channel 2 — amber */}
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-28 right-[10%] w-[340px] h-[340px] rounded-full bg-amber-400/15 blur-[120px]"
        />
      </div>

      <motion.header 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#010409]/80 px-5 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.55),0_0_50px_-15px_rgba(0,230,118,0.25)] backdrop-blur-2xl border-b border-white/[0.06] z-20 relative"
      >
        {/* Noise texture overlay — soft-light reads on dark bg, overlay doesn't */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-soft-light pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Signature: the logic trace sweep — a signal that visibly runs
            along the bottom edge, echoing what the product itself does. */}
        <div className="absolute left-4 right-4 -bottom-px h-px overflow-hidden pointer-events-none">
          <div className="h-full w-full bg-white/[0.06]" />
          <motion.div
            animate={{ x: ["-30%", "130%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            style={{ boxShadow: "0 0 8px 1px rgba(0,230,118,0.85)" }}
          />
        </div>

      {/* Left section: Logo & Badge */}
      <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-start">
        <motion.div variants={itemVariants} className={`flex items-center gap-3.5 group ${isEmbed ? 'cursor-default' : 'cursor-pointer'}`} onClick={() => !isEmbed && onBackToHome?.()}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F172A]/80 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_0_15px_rgba(0,230,118,0.15)] overflow-hidden transition-all duration-300 group-hover:border-emerald-400/50 group-hover:shadow-[0_0_25px_rgba(0,230,118,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-emerald-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(0,230,118,0.6)]">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E676" />
                  <stop offset="100%" stopColor="#00B259" />
                </linearGradient>
                <linearGradient id="logoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="url(#logoGrad)" strokeWidth="8" strokeLinejoin="round" fill="rgba(0,230,118,0.15)" />
              <path d="M50 25 L50 50 L75 65" stroke="url(#logoGrad2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 65 L50 50" stroke="url(#logoGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="50" r="9" fill="#FFFFFF" />
              <circle cx="50" cy="25" r="6.5" fill="#FBBF24" />
              <circle cx="25" cy="65" r="6.5" fill="#00E676" />
              <circle cx="75" cy="65" r="6.5" fill="#00B259" />
            </svg>
          </div>
          
          {/* Typography */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[17px] leading-tight font-black tracking-tight text-white flex items-center">
              Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-emerald-500">Trace</span>
            </h1>
            <span className="text-[9px] font-mono font-medium text-white/40 tracking-[0.2em] uppercase leading-none mt-1">
              Visual Engine
            </span>
          </div>
        </motion.div>
        
      </div>

      {/* Center section: Pickers & Run */}
      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-center lg:ml-auto">
        <motion.div variants={itemVariants}>
          <LanguageSelector
            selectedId={selectedExampleId}
            currentLanguage={currentLanguage}
            onChange={(id) => {
              const ex = EXAMPLES.find((x) => x.id === id);
              if (ex) onLanguageChange(id, ex.language, ex.code);
            }}
          />
        </motion.div>

        {onSnippetSelect && (
          <motion.div variants={itemVariants}>
            <SnippetPicker
              currentLanguage={currentLanguage}
              onSelect={onSnippetSelect}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative group">
          <motion.button
            whileTap={(!isPlaying && !isRunning) ? { scale: 0.96 } : undefined}
            whileHover={(!isPlaying && !isRunning) ? { y: -1, scale: 1.02 } : undefined}
            onClick={onRun}
            disabled={isPlaying || isRunning}
            className="relative flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,146,60,0.45)] overflow-hidden"
          >
            {/* Animated Sheen via Framer Motion */}
            <motion.div
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none skew-x-[-20deg]"
            />
            
            <div className="relative z-10 flex items-center gap-2">
              {isRunning ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Running…
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> Run
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Right section: Playback & Icons */}
      <div className="flex items-center justify-center gap-4 lg:justify-end w-full lg:w-auto">
        {engine.steps.length > 0 && (
          <motion.div variants={itemVariants} className="flex items-center gap-1 bg-black/30 rounded-full p-1 shadow-inner border border-white/5">
            <TooltipButton icon={RotateCcw} onClick={engine.reset} tooltip="Reset" />
            <TooltipButton icon={SkipBack} onClick={engine.prev} tooltip="Step back" />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={isPlaying ? engine.pause : engine.play} 
              className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </motion.button>
            <TooltipButton icon={SkipForward} onClick={engine.next} tooltip="Step forward" />
            
            {/* Timeline slider */}
            <div className="relative group mx-2 w-20 lg:w-28 h-4 flex items-center">
              <input
                type="range"
                min={0}
                max={Math.max(engine.steps.length - 1, 0)}
                value={engine.currentIndex}
                onChange={(e) => engine.goToStep(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-1 my-auto bg-white/10 rounded-full cursor-pointer appearance-none outline-none z-10 
                  [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform group-hover:[&::-webkit-slider-thumb]:scale-125"
                title={`Step ${engine.currentIndex + 1} of ${engine.steps.length}`}
              />
              <div 
                className="absolute h-1 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full pointer-events-none" 
                style={{ width: `${engine.steps.length > 1 ? (engine.currentIndex / (engine.steps.length - 1)) * 100 : 0}%` }}
              />
            </div>
            
            <div className="text-[10px] font-mono text-white/50 px-1 min-w-[32px] text-center select-none">
              {engine.currentIndex + 1}/{engine.steps.length}
            </div>
            
            {/* Speed control */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-2 pr-1">
              <Gauge size={12} className="text-white/40" />
              <select
                value={engine.speed}
                onChange={(e) => engine.setSpeed(Number(e.target.value))}
                className="bg-transparent text-[10px] font-mono text-white/70 border-none outline-none cursor-pointer appearance-none pr-1 hover:text-white transition-colors [&>option]:bg-[#10141E] [&>option]:text-white"
                title="Playback speed"
              >
                <option value={3600}>.25x</option>
                <option value={1800}>.5x</option>
                <option value={900}>1x</option>
                <option value={450}>2x</option>
                <option value={225}>4x</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Right Menu */}
        <motion.div variants={itemVariants} className="flex items-center">
          <div className="relative" ref={menuRef}>
            <TooltipButton 
              icon={isMenuOpen ? X : Menu} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              tooltip="Menu" 
            />

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 max-h-[80vh] overflow-y-auto rounded-2xl border border-white/[0.08] border-t-emerald-400/[0.2] bg-[#010409]/90 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_40px_-15px_rgba(0,230,118,0.25)] backdrop-blur-2xl z-50 flex flex-col gap-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                >
                  {/* Mode Toggles with Sliding Switch */}
                  <div className="px-2 pb-2 mb-2 border-b border-white/10">
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">Settings</p>
                    
                    <button onClick={() => onToggleAiMode()} className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Sparkles size={14} className={isAiMode ? "text-emerald-400" : "text-white/40"} />
                        <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">AI Explanation</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors flex ${isAiMode ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'}`}>
                        <motion.div layout className={`w-3 h-3 rounded-full bg-white shadow-sm`} />
                      </div>
                    </button>

                    <button onClick={() => onToggleReducedMotion()} className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Eye size={14} className={prefersReducedMotion ? "text-emerald-400" : "text-white/40"} />
                        <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">Reduced Motion</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors flex ${prefersReducedMotion ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'}`}>
                        <motion.div layout className={`w-3 h-3 rounded-full bg-white shadow-sm`} />
                      </div>
                    </button>

                    <button onClick={() => onToggleColorblindMode()} className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Palette size={14} className={colorblindMode ? "text-emerald-400" : "text-white/40"} />
                        <span className="text-[13px] text-white/80 group-hover:text-white transition-colors">Colorblind Mode</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors flex ${colorblindMode ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'}`}>
                        <motion.div layout className={`w-3 h-3 rounded-full bg-white shadow-sm`} />
                      </div>
                    </button>
                  </div>

                  <div className="px-2 pb-2 mb-2 border-b border-white/10">
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">Views</p>
                    <button
                      onClick={() => { onOpenDiffMode(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all w-full text-left"
                    >
                      <Columns2 size={14} className="text-white/40" /> Diff Mode
                    </button>
                    <button
                      onClick={() => { onOpenRaceMode(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all w-full text-left"
                    >
                      <Swords size={14} className="text-white/40" /> Algorithm Race
                    </button>
                  </div>
                  
                  <div className="px-2 pb-1">
                    {session ? (
                      <>
                        <button
                          onClick={() => { onLoadWorkspaces(); setIsMenuOpen(false); }}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all w-full text-left"
                        >
                          <Database size={14} className="text-white/40" /> Load Snippet
                        </button>
                        <Link href="/profile">
                          <button
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all w-full text-left"
                          >
                            <LayoutDashboard size={14} className="text-white/40" /> My Profile
                          </button>
                        </Link>
                        <button 
                          onClick={() => { handleSaveSnippet(); setIsMenuOpen(false); }} 
                          disabled={isSaving} 
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all w-full text-left"
                        >
                          {isSaving ? <Loader2 size={14} className="animate-spin text-emerald-400" /> : <Database size={14} className="text-emerald-400" />}
                          {isSaving ? "Saving..." : "Save to Cloud"}
                        </button>
                        <button
                          onClick={() => { signOut(); setIsMenuOpen(false); }}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 mt-1 text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      </motion.header>
    </>
  );
}
