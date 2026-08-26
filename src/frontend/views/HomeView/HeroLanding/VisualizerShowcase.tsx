"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Layers, Box, Terminal, BarChart3 } from "lucide-react";

/* ─── Mock Execution Data ─── */
const MOCK_STEPS = [
  {
    step: 1, line: 1,
    explanation: "Initialize array arr = [38, 27, 43, 3, 9, 82, 10]",
    stack: [{ id: "f1", name: "Global", variables: [{ name: "arr", value: "[38,27,43,3,9,82,10]", type: "list", isReference: true, address: "0x001" }] }],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [38, 27, 43, 3, 9, 82, 10], structureKind: "primitive" }],
    console: "",
    barStates: new Map<number, string>(),
  },
  {
    step: 2, line: 3,
    explanation: "Comparing arr[0]=38 and arr[1]=27",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[38,27,43,3,9,82,10]", type: "list", isReference: true, address: "0x001" }] },
      { id: "f2", name: "bubbleSort", variables: [{ name: "i", value: "0", type: "int" }, { name: "j", value: "0", type: "int" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [38, 27, 43, 3, 9, 82, 10], structureKind: "primitive" }],
    console: "",
    barStates: new Map<number, string>([[0, "comparing"], [1, "comparing"]]),
  },
  {
    step: 3, line: 4,
    explanation: "Swapping arr[0] and arr[1] → 38 ↔ 27",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[27,38,43,3,9,82,10]", type: "list", isReference: true, address: "0x001" }] },
      { id: "f2", name: "bubbleSort", variables: [{ name: "i", value: "0", type: "int" }, { name: "j", value: "0", type: "int" }, { name: "temp", value: "38", type: "int" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [27, 38, 43, 3, 9, 82, 10], structureKind: "primitive" }],
    console: "Swap: 38 ↔ 27\n",
    barStates: new Map<number, string>([[0, "swapping"], [1, "swapping"]]),
  },
  {
    step: 4, line: 3,
    explanation: "Comparing arr[1]=38 and arr[2]=43 — no swap needed",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[27,38,43,3,9,82,10]", type: "list", isReference: true, address: "0x001" }] },
      { id: "f2", name: "bubbleSort", variables: [{ name: "i", value: "0", type: "int" }, { name: "j", value: "1", type: "int" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [27, 38, 43, 3, 9, 82, 10], structureKind: "primitive" }],
    console: "Swap: 38 ↔ 27\n",
    barStates: new Map<number, string>([[1, "comparing"], [2, "comparing"]]),
  },
  {
    step: 5, line: 3,
    explanation: "Comparing arr[2]=43 and arr[3]=3",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[27,38,43,3,9,82,10]", type: "list", isReference: true, address: "0x001" }] },
      { id: "f2", name: "bubbleSort", variables: [{ name: "i", value: "0", type: "int" }, { name: "j", value: "2", type: "int" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [27, 38, 43, 3, 9, 82, 10], structureKind: "primitive" }],
    console: "Swap: 38 ↔ 27\n",
    barStates: new Map<number, string>([[2, "comparing"], [3, "comparing"]]),
  },
  {
    step: 6, line: 4,
    explanation: "Swapping arr[2] and arr[3] → 43 ↔ 3",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[27,38,3,43,9,82,10]", type: "list", isReference: true, address: "0x001" }] },
      { id: "f2", name: "bubbleSort", variables: [{ name: "i", value: "0", type: "int" }, { name: "j", value: "2", type: "int" }, { name: "temp", value: "43", type: "int" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [27, 38, 3, 43, 9, 82, 10], structureKind: "primitive" }],
    console: "Swap: 38 ↔ 27\nSwap: 43 ↔ 3\n",
    barStates: new Map<number, string>([[2, "swapping"], [3, "swapping"]]),
  },
  {
    step: 7, line: 8,
    explanation: "Pass complete. Largest element 82 bubbled to end. arr[6] is sorted ✓",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[27,38,3,9,10,43,82]", type: "list", isReference: true, address: "0x001" }] },
      { id: "f2", name: "bubbleSort", variables: [{ name: "i", value: "0", type: "int" }, { name: "sorted", value: "1", type: "int" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [27, 38, 3, 9, 10, 43, 82], structureKind: "primitive" }],
    console: "Swap: 38 ↔ 27\nSwap: 43 ↔ 3\nPass 1 complete\n",
    barStates: new Map<number, string>([[6, "sorted"]]),
  },
  {
    step: 8, line: 10,
    explanation: "Sorting complete! Final: [3, 9, 10, 27, 38, 43, 82]",
    stack: [
      { id: "f1", name: "Global", variables: [{ name: "arr", value: "[3,9,10,27,38,43,82]", type: "list", isReference: true, address: "0x001" }, { name: "result", value: "sorted", type: "str" }] },
    ],
    heap: [{ id: "0x001", type: "list", address: "0x001", data: [3, 9, 10, 27, 38, 43, 82], structureKind: "primitive" }],
    console: "Swap: 38 ↔ 27\nSwap: 43 ↔ 3\nPass 1 complete\n✅ Array is sorted!\n",
    barStates: new Map<number, string>([[0, "sorted"], [1, "sorted"], [2, "sorted"], [3, "sorted"], [4, "sorted"], [5, "sorted"], [6, "sorted"]]),
  },
];

/* ─── Mini Components ─── */

const MiniBar = ({ value, maxValue, state }: { value: number; maxValue: number; state: string }) => {
  const heightPercent = Math.max((value / maxValue) * 100, 12);
  const barClass =
    state === "comparing"
      ? "from-blue-500/50 to-blue-400 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
      : state === "swapping"
      ? "from-rose-500/50 to-rose-400 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
      : state === "sorted"
      ? "from-emerald-500/50 to-emerald-400 border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
      : "from-white/5 to-white/25 border-white/15";

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 24, duration: 0.4 }}
      className="flex flex-col items-center justify-end"
      style={{ height: "100%", flex: 1 }}
    >
      <motion.div
        className={`w-full rounded-t-sm border-t border-l border-r bg-gradient-to-t ${barClass} transition-all duration-300`}
        style={{ height: `${heightPercent}%` }}
        animate={
          state === "swapping" ? { scale: [1, 1.08, 1] } :
          state === "comparing" ? { scale: [1, 1.04, 1] } : {}
        }
        transition={{ duration: 0.4 }}
      />
      <span className={`text-[9px] mt-1 font-mono tabular-nums ${
        state === "sorted" ? "text-emerald-400" :
        state === "comparing" ? "text-blue-400" :
        state === "swapping" ? "text-rose-400" : "text-white/50"
      }`}>
        {value}
      </span>
    </motion.div>
  );
};

const MiniStackFrame = ({ frame, isActive }: { frame: any; isActive: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    className={`rounded-lg border overflow-hidden text-[10px] font-mono ${
      isActive
        ? "border-blue-500/40 bg-blue-500/[0.06] shadow-[0_0_10px_rgba(59,130,246,0.15)]"
        : "border-white/10 bg-white/[0.02] opacity-60"
    }`}
  >
    <div className={`px-2 py-1 border-b flex items-center gap-1.5 ${
      isActive ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/[0.03] border-white/5 text-white/50"
    }`}>
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
      {frame.name}{frame.name !== "Global" && <span className="text-white/30">()</span>}
    </div>
    <div className="px-2 py-1 space-y-0.5">
      {frame.variables.map((v: any) => (
        <div key={v.name} className="flex items-center justify-between gap-2">
          <span className="text-white/50">{v.name}</span>
          {v.isReference ? (
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
          ) : (
            <span className="text-white/80">{v.value}</span>
          )}
        </div>
      ))}
    </div>
  </motion.div>
);

const MiniHeapObject = ({ obj }: { obj: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-sm text-[10px]"
  >
    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] border-b border-white/5">
      <span className="inline-flex items-center px-1 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9px] font-semibold">
        {obj.type}
      </span>
      <span className="text-white/25 font-mono ml-auto">@{obj.address}</span>
    </div>
    <div className="p-1.5">
      <div className="flex gap-0.5 overflow-hidden">
        {(obj.data as number[]).map((val: number, i: number) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[8px] text-white/30">{i}</span>
            <div className="min-w-[20px] h-5 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 rounded border border-white/10 text-[9px] text-amber-300 font-mono">
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ─── Main Section ─── */

export const VisualizerShowcase = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const step = MOCK_STEPS[currentStep];

  const next = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % MOCK_STEPS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentStep((prev) => (prev - 1 + MOCK_STEPS.length) % MOCK_STEPS.length);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, 2200);
    return () => clearInterval(timer);
  }, [isPlaying, next]);

  const maxVal = 82;
  const arrData = step.heap[0].data as number[];

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/8 via-emerald-500/8 to-purple-500/8 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
            <Layers className="h-3.5 w-3.5" />
            INTERACTIVE PREVIEW
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
            See Your Code{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Come Alive
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/50 font-medium leading-relaxed">
            Watch memory allocation, call stacks, and algorithm execution in real-time. This is exactly what you see inside CodeTrace.
          </p>
        </motion.div>

        {/* The Visualizer Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-[#0A0A0A]/80 shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] backdrop-blur-xl overflow-hidden"
        >
          {/* Title Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.4)]" />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.4)]" />
                <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.4)]" />
              </div>
              <span className="text-xs font-mono text-white/40 ml-2">CodeTrace — bubble_sort.py</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Playback Controls */}
              <button onClick={() => { prev(); setIsPlaying(false); }} className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <SkipBack size={14} />
              </button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={() => { next(); setIsPlaying(false); }} className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <SkipForward size={14} />
              </button>
              <button onClick={reset} className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <RotateCcw size={14} />
              </button>
              <div className="ml-3 h-4 w-px bg-white/10" />
              <span className="text-[10px] font-mono text-white/30 ml-2">
                Step {step.step}/{MOCK_STEPS.length}
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            {/* Left: Code Editor Mock */}
            <div className="lg:col-span-4 border-r border-white/5 p-4 relative">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-1.5">
                <Terminal size={11} className="text-emerald-400" /> Source Code
              </div>
              <div className="font-mono text-[11px] leading-[1.8] space-y-0">
                {[
                  { num: 1, code: <><span className="text-pink-400">def</span> <span className="text-blue-400">bubble_sort</span>(arr):</> },
                  { num: 2, code: <><span className="text-pink-400">  for</span> i <span className="text-pink-400">in</span> <span className="text-blue-400">range</span>(<span className="text-blue-400">len</span>(arr)):</> },
                  { num: 3, code: <><span className="text-pink-400">    for</span> j <span className="text-pink-400">in</span> <span className="text-blue-400">range</span>(<span className="text-blue-400">len</span>(arr)-i-<span className="text-purple-400">1</span>):</> },
                  { num: 4, code: <><span className="text-pink-400">      if</span> arr[j] &gt; arr[j+<span className="text-purple-400">1</span>]:</> },
                  { num: 5, code: <>        arr[j], arr[j+<span className="text-purple-400">1</span>] = arr[j+<span className="text-purple-400">1</span>], arr[j]</> },
                  { num: 6, code: <><span className="text-pink-400">        print</span>(<span className="text-amber-300">f&quot;Swap: &#123;arr[j]&#125; ↔ &#123;arr[j+1]&#125;&quot;</span>)</> },
                  { num: 7, code: <></> },
                  { num: 8, code: <>arr = [<span className="text-purple-400">38, 27, 43, 3, 9, 82, 10</span>]</> },
                  { num: 9, code: <><span className="text-blue-400">bubble_sort</span>(arr)</> },
                  { num: 10, code: <><span className="text-blue-400">print</span>(<span className="text-amber-300">&quot;✅ Array is sorted!&quot;</span>)</> },
                ].map((line) => (
                  <div
                    key={line.num}
                    className={`flex items-start px-2 py-0 rounded-sm transition-all duration-300 ${
                      step.line === line.num
                        ? "bg-emerald-500/10 border-l-2 border-emerald-400 shadow-[inset_0_0_20px_rgba(0,230,118,0.06)]"
                        : "border-l-2 border-transparent"
                    }`}
                  >
                    <span className={`w-6 shrink-0 text-right mr-3 select-none ${
                      step.line === line.num ? "text-emerald-400 font-bold" : "text-white/20"
                    }`}>
                      {line.num}
                    </span>
                    <span className="text-white/80">{line.code}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Memory (Stack + Heap) */}
            <div className="lg:col-span-4 border-r border-white/5 p-4">
              <div className="grid grid-cols-2 gap-3 h-full">
                {/* Stack */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-1.5">
                    <Layers size={11} className="text-blue-400" /> Frames
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {step.stack.map((frame, i) => (
                        <MiniStackFrame
                          key={frame.id}
                          frame={frame}
                          isActive={i === step.stack.length - 1}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Heap */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-1.5">
                    <Box size={11} className="text-amber-400" /> Objects
                  </div>
                  <div className="space-y-2">
                    {step.heap.map((obj) => (
                      <MiniHeapObject key={obj.id} obj={obj} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Algorithm Viz + Console */}
            <div className="lg:col-span-4 p-4 flex flex-col gap-3">
              {/* Algorithm Bars */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-1.5">
                  <BarChart3 size={11} className="text-pink-400" /> Algorithm
                </div>
                <div className="flex items-end gap-1 h-28 p-2 rounded-lg bg-black/40 border border-white/5">
                  {arrData.map((val, i) => (
                    <MiniBar
                      key={i}
                      value={val}
                      maxValue={maxVal}
                      state={step.barStates.get(i) || "default"}
                    />
                  ))}
                </div>
              </div>

              {/* Console */}
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="rounded-lg border border-white/10 bg-black flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1C1C1E] border-b border-white/5 shrink-0">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                      <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                      <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                    </div>
                    <Terminal size={10} className="text-white/30 ml-1" />
                    <span className="text-[9px] text-white/30 font-mono">stdout</span>
                  </div>
                  <div className="flex-1 px-2.5 py-2 font-mono text-[10px] text-[#00FF41] [text-shadow:0_0_6px_rgba(0,255,65,0.3)] overflow-y-auto">
                    {step.console ? (
                      step.console.split("\n").filter(Boolean).map((line, i) => (
                        <div key={i}>{line}</div>
                      ))
                    ) : (
                      <span className="text-white/15 italic">Waiting for output...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] px-3 py-2 text-[11px] text-emerald-300/90 font-medium"
              >
                💡 {step.explanation}
              </motion.div>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="h-1 bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"
              animate={{ width: `${((currentStep + 1) / MOCK_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Bottom Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          {[
            { label: "Flowing Data Arrows", color: "border-sky-500/20 text-sky-400 bg-sky-500/10" },
            { label: "Update Flash", color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" },
            { label: "Time Travel", color: "border-purple-500/20 text-purple-400 bg-purple-500/10" },
            { label: "Heap Inspector", color: "border-amber-500/20 text-amber-400 bg-amber-500/10" },
            { label: "Live Console", color: "border-rose-500/20 text-rose-400 bg-rose-500/10" },
          ].map((pill) => (
            <span key={pill.label} className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold ${pill.color}`}>
              {pill.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
