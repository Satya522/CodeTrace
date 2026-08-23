"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ExternalLink, Activity, BrainCircuit, Video } from "lucide-react";

const codeSnippets = [
  {
    language: "JavaScript",
    code: (
      <>
        <span className="text-pink-400">import</span> {'{'} <span className="text-blue-400">Sandbox</span>, <span className="text-blue-400">Visualizer</span> {'}'} <span className="text-pink-400">from</span> <span className="text-amber-300">'@codetrace/engine'</span>;
        <br/><br/>
        <span className="text-pink-400">const</span> config = {'{'}
        <br/>
        &nbsp;&nbsp;timeoutMs: <span className="text-purple-400">5000</span>,
        <br/>
        &nbsp;&nbsp;maxMemoryMb: <span className="text-purple-400">512</span>,
        <br/>
        &nbsp;&nbsp;captureFrames: <span className="text-purple-400">true</span>,
        <br/>
        &nbsp;&nbsp;experimental: <span className="text-purple-400">false</span>
        <br/>
        {'}'};
        <br/><br/>
        <span className="text-pink-400">async function</span> <span className="text-blue-400">traceExecution</span>(source) {'{'}
        <br/>
        &nbsp;&nbsp;<span className="text-pink-400">const</span> engine = <span className="text-pink-400">new</span> <span className="text-blue-400">Sandbox</span>(config);
        <br/>
        &nbsp;&nbsp;<span className="text-pink-400">const</span> trace = <span className="text-pink-400">await</span> engine.<span className="text-blue-400">execute</span>(source);
        <br/><br/>
        &nbsp;&nbsp;<span className="text-pink-400">if</span> (trace.<span className="text-blue-400">hasErrors</span>) {'{'}
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;Logger.<span className="text-blue-400">error</span>(trace.<span className="text-blue-400">errorDetails</span>);
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">return null</span>;
        <br/>
        &nbsp;&nbsp;{'}'}
        <br/><br/>
        &nbsp;&nbsp;<span className="text-pink-400">return</span> Visualizer.<span className="text-blue-400">render</span>(trace);
        <br/>
        {'}'}
        <br/><br/>
        <span className="text-white/40">// Terminal Output:</span><br/>
        <span className="text-emerald-400">&gt; Starting sandbox...</span><br/>
        <span className="text-emerald-400">&gt; Execution finished in 42ms.</span><br/>
        <span className="text-emerald-400">&gt; Trace completed. Captured 1,204 memory frames.</span><br/>
        <span className="text-emerald-400">&gt; Render engine ready.</span>
      </>
    )
  },
  {
    language: "Python",
    code: (
      <>
        <span className="text-pink-400">import</span> time
        <br/><br/>
        <span className="text-pink-400">def</span> <span className="text-blue-400">dfs</span>(node, graph, visited=<span className="text-purple-400">None</span>):
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">if</span> visited <span className="text-pink-400">is None</span>:
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visited = <span className="text-blue-400">set</span>()
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;visited.<span className="text-blue-400">add</span>(node)
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">print</span>(<span className="text-amber-300">f"Visiting: {'{'}node{'}'}"</span>)
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;time.<span className="text-blue-400">sleep</span>(<span className="text-purple-400">0.01</span>)
        <br/><br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">for</span> neighbor <span className="text-pink-400">in</span> graph[node]:
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">if</span> neighbor <span className="text-pink-400">not in</span> visited:
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">dfs</span>(neighbor, graph, visited)
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">return</span> visited
        <br/><br/>
        graph_data = {'{'}
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-300">'A'</span>: [<span className="text-amber-300">'B'</span>, <span className="text-amber-300">'C'</span>],
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-300">'B'</span>: [<span className="text-amber-300">'D'</span>],
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-300">'C'</span>: [<span className="text-amber-300">'E'</span>],
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-300">'D'</span>: [], <span className="text-amber-300">'E'</span>: []
        <br/>
        {'}'}
        <br/><br/>
        <span className="text-blue-400">dfs</span>(<span className="text-amber-300">'A'</span>, graph_data)
        <br/><br/>
        <span className="text-white/40"># Terminal Output:</span><br/>
        <span className="text-emerald-400">&gt; Visiting: A</span><br/>
        <span className="text-emerald-400">&gt; Visiting: B</span><br/>
        <span className="text-emerald-400">&gt; Visiting: D</span><br/>
        <span className="text-emerald-400">&gt; Visiting: E</span><br/>
        <span className="text-emerald-400">&gt; Visiting: C</span><br/>
      </>
    )
  },
  {
    language: "SQL",
    code: (
      <>
        <span className="text-pink-400">WITH RECURSIVE</span> hierarchy <span className="text-pink-400">AS</span> (
        <br/>
        &nbsp;&nbsp;<span className="text-blue-400">SELECT</span> id, name, manager_id, <span className="text-purple-400">1</span> <span className="text-pink-400">AS</span> level
        <br/>
        &nbsp;&nbsp;<span className="text-blue-400">FROM</span> employees 
        <br/>
        &nbsp;&nbsp;<span className="text-blue-400">WHERE</span> manager_id <span className="text-pink-400">IS NULL</span>
        <br/><br/>
        &nbsp;&nbsp;<span className="text-pink-400">UNION ALL</span>
        <br/><br/>
        &nbsp;&nbsp;<span className="text-blue-400">SELECT</span> e.id, e.name, e.manager_id, h.level + <span className="text-purple-400">1</span>
        <br/>
        &nbsp;&nbsp;<span className="text-blue-400">FROM</span> employees e
        <br/>
        &nbsp;&nbsp;<span className="text-blue-400">JOIN</span> hierarchy h <span className="text-pink-400">ON</span> e.manager_id = h.id
        <br/>
        )
        <br/>
        <span className="text-blue-400">SELECT</span> 
        <br/>
        &nbsp;&nbsp;id,
        <br/>
        &nbsp;&nbsp;<span className="text-blue-400">REPEAT</span>(<span className="text-amber-300">'-'</span>, lvl-<span className="text-purple-400">1</span>) || name <span className="text-pink-400">AS</span> tree,
        <br/>
        &nbsp;&nbsp;level
        <br/>
        <span className="text-blue-400">FROM</span> hierarchy
        <br/>
        <span className="text-blue-400">ORDER BY</span> level, name;
        <br/><br/>
        <span className="text-white/40">-- Terminal Output:</span><br/>
        <span className="text-emerald-400">&gt; Query execution started...</span><br/>
        <span className="text-emerald-400">&gt; Index scan triggered on `manager_id`</span><br/>
        <span className="text-emerald-400">&gt; Query OK, 142 rows affected (0.04 sec)</span>
      </>
    )
  }
];

const MockIDE = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-y-0 right-0 left-4 lg:left-0 rounded-l-2xl lg:rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden flex flex-col">
      {/* Title bar (Mac dots only, no border bottom) */}
      <div className="flex items-center px-4 py-4">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>
      </div>
      
      {/* Code Editor Body */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 px-6 font-mono text-[12px] sm:text-[14px] text-white/90 leading-relaxed overflow-hidden"
          >
            {codeSnippets[index].code}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const HeroSection = ({ onStart }: { onStart: () => void }) => {
  return (
    <section
      id="hero"
      className="relative container mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 pt-32 pb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:pr-0 lg:pl-8"
    >
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-[400px] w-[400px] translate-x-1/2 translate-y-1/4 rounded-full bg-[#2C3E92]/20 blur-[120px] pointer-events-none mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-full flex-col justify-center text-center lg:text-left relative z-10"
      >
        <div className="mb-4 flex w-full justify-center lg:justify-start">
          <div className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>NEW: Real-time AI Code Analysis 🚀</span>
          </div>
        </div>

        <div className="mb-6 space-y-5">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
            Code execution{" "}
            <span className="relative mb-4 inline-block px-2 py-1 md:px-4">
              <span className="absolute inset-x-0 top-2 -bottom-1 -skew-y-3 transform bg-gradient-to-r from-[#00E676] to-[#00C853] md:top-3 md:-bottom-2 shadow-[0_0_30px_rgba(0,230,118,0.4)]" />
              <span className="relative text-black">made simple</span>
            </span>{" "}
            <br className="hidden lg:block"/>for every business
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60 sm:text-xl lg:mx-0 font-medium leading-relaxed">
            Robust, scalable, and <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#00E676] underline decoration-[#00E676]/50 underline-offset-4 hover:opacity-80 transition-opacity">open-source ↗</a> online code execution system for humans and AI. Build the future with CodeTrace.
          </p>
        </div>

        <div className="flex w-full flex-col sm:flex-row justify-center gap-4 sm:gap-4 lg:justify-start">
          <button
            onClick={onStart}
            className="group relative flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00B259] px-8 text-base font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,230,118,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M8 5v14l11-7z" />
            </svg>
            Start Visualizing
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white/80 transition-all hover:border-white/20 hover:text-white">
            <Activity className="h-3.5 w-3.5 text-blue-400" />
            Real-time Trace
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white/80 transition-all hover:border-white/20 hover:text-white">
            <BrainCircuit className="h-3.5 w-3.5 text-purple-400" />
            AI Explanations
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white/80 transition-all hover:border-white/20 hover:text-white">
            <Video className="h-3.5 w-3.5 text-pink-400" />
            Built-in Recording
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative col-span-1 hidden h-full max-h-full lg:block min-h-[400px]"
      >
        <MockIDE />
      </motion.div>
    </section>
  );
};
