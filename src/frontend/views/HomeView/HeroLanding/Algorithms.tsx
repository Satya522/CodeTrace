"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code2, Network, ArrowRight } from "lucide-react";

const algorithms = [
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Pathfinding",
    difficulty: "Hard",
    color: "text-rose-400",
    icon: <Network className="h-5 w-5" />,
    desc: "Find the shortest paths between nodes in a graph. Watch how the priority queue expands its frontier in real-time.",
    code: `function dijkstra(graph, start) {
  const distances = new Map();
  const pq = new PriorityQueue();
  
  distances.set(start, 0);
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { node, dist } = pq.dequeue();
    // Visualize frontier expansion...
  }
}`
  },
  {
    id: "mergesort",
    name: "Merge Sort",
    category: "Sorting",
    difficulty: "Medium",
    color: "text-amber-400",
    icon: <Code2 className="h-5 w-5" />,
    desc: "A highly efficient, divide-and-conquer sorting algorithm. Visualize the recursive splitting and merging of arrays.",
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}`
  },
  {
    id: "binarysearch",
    name: "Binary Search",
    category: "Search",
    difficulty: "Easy",
    color: "text-emerald-400",
    icon: <Code2 className="h-5 w-5" />,
    desc: "Efficiently find an item from a sorted list of items. See the search space halve with every step.",
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
  }
];

export const Algorithms = ({ onStart }: { onStart?: (code?: string, lang?: string) => void }) => {
  const [activeId, setActiveId] = useState(algorithms[0].id);
  const activeAlgo = algorithms.find(a => a.id === activeId)!;

  return (
    <section id="algorithms" className="container mx-auto max-w-7xl px-6 pt-12 pb-8 md:px-8 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        className="mb-16 text-center md:text-left md:flex md:items-end md:justify-between"
      >
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs font-semibold tracking-widest text-white/50 uppercase">
            Curated Library
          </span>
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Built-in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-emerald-400">Algorithms</span>
          </h2>
          <p className="text-lg font-medium text-white/50 leading-relaxed">
            Don't want to write from scratch? Load our expertly crafted, highly-visualized classic algorithms with one click.
          </p>
        </div>
        <button 
          onClick={onStart}
          className="mt-8 hidden md:flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08] hover:scale-105 hover:border-[#00E676]/30"
        >
          View all templates <ArrowRight className="h-4 w-4 text-[#00E676]" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Side: Interactive List */}
        <div className="flex flex-col gap-3 lg:col-span-5">
          {algorithms.map((algo) => {
            const isActive = activeId === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => setActiveId(algo.id)}
                className={`group relative flex w-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 ${
                  isActive 
                    ? "border-[#00E676]/30 bg-[#00E676]/5 shadow-[0_0_30px_-10px_rgba(0,230,118,0.15)]" 
                    : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.5)]"
                  />
                )}
                
                <div className="mb-4 flex w-full items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300 ${isActive ? 'bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]' : 'bg-white/5 border-white/5 text-white/40 group-hover:text-white/70'}`}>
                    {algo.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${algo.color}`}>
                    {algo.difficulty}
                  </span>
                </div>
                
                <h3 className={`mb-2 text-xl font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                  {algo.name}
                </h3>
                <p className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${isActive ? 'text-white/70' : 'text-white/40 group-hover:text-white/60'}`}>
                  {algo.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Side: Dynamic Preview Window */}
        <div className="lg:col-span-7">
          <div className="relative flex h-full min-h-[400px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-[0_0_50px_-12px_rgba(37,99,235,0.15)]">


            {/* Mac-style Window Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-white/[0.03] backdrop-blur-md px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
              <div className="text-xs font-medium text-white/40 font-mono tracking-wider">
                {activeAlgo.id}.js
              </div>
              <div className="w-12" /> {/* Spacer for alignment */}
            </div>

            {/* Code Content */}
            <div className="relative z-10 flex-1 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <pre className="h-full font-mono text-sm leading-loose text-white/70 overflow-hidden whitespace-pre-wrap break-words">
                    <code>
                      {activeAlgo.code.split('\n').map((line, i) => (
                        <div key={i} className="flex hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                          <span className="w-8 select-none text-white/20 mr-4 text-right inline-block">{i + 1}</span>
                          <span dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/function|const|let|new|while|if|else|return/g, '<span class="text-rose-400">$&</span>')
                              .replace(/Math\.floor|PriorityQueue|Map/g, '<span class="text-amber-300">$&</span>')
                              .replace(/\/\/.*/g, '<span class="text-emerald-500/70">$&</span>')
                          }} />
                        </div>
                      ))}
                    </code>
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Sandbox Status</span>
                  <span className="text-xs font-semibold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">V8 Engine Ready</span>
                </div>
              </div>
              <button 
                onClick={() => onStart?.(activeAlgo.code, "javascript")}
                className="group relative flex items-center justify-center gap-2 rounded-xl border border-blue-500/50 bg-gradient-to-b from-blue-500 to-blue-700 px-8 py-3 text-sm font-bold text-white shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] transition-all overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)] hover:border-blue-400 active:scale-95"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Play className="relative z-10 h-4 w-4 fill-white transition-transform group-hover:scale-110" /> 
                <span className="relative z-10 tracking-wide">Load & Visualize</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button className="mx-auto mt-8 flex md:hidden items-center gap-2 rounded-full bg-white/[0.03] border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.08] active:scale-95">
        View all templates <ArrowRight className="h-4 w-4 text-[#00E676]" />
      </button>
    </section>
  );
};
