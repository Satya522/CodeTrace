"use client";

import React from "react";
import { Layers, Network, Video, BrainCircuit, Activity } from "lucide-react";
import { motion } from "framer-motion";

const featureList = [
  {
    title: "Call Stack & Heap",
    description: "Watch your variables and function calls get pushed and popped in real-time. Understand recursion and memory allocation at a deeper level.",
    icon: <Layers className="h-6 w-6 text-cyan-400" />,
  },
  {
    title: "Graph & Tree Rendering",
    description: "Complex data structures are no longer a mystery. Linked lists, trees, and graphs are automatically rendered as visual nodes.",
    icon: <Network className="h-6 w-6 text-amber-400" />,
  },
  {
    title: "Built-in Screen Recording",
    description: "Export your execution traces as MP4 or WebM videos. Perfect for creating educational content or sharing bugs with your team.",
    icon: <Video className="h-6 w-6 text-pink-400" />,
  },
  {
    title: "AI Analysis",
    description: "Get detailed, step-by-step explanations of your code logic from our built-in AI assistant. Spot time and space complexity instantly.",
    icon: <BrainCircuit className="h-6 w-6 text-green-400" />,
  },
  {
    title: "Predict Mode",
    description: "Challenge your understanding! The visualizer pauses and asks you to predict the next variable value or execution step before proceeding.",
    icon: <BrainCircuit className="h-6 w-6 text-purple-400" />, // Can reuse BrainCircuit or use another
  },
  {
    title: "Diff & Race Modes",
    description: "Compare two algorithms side-by-side in Diff Mode, or race them against each other in Race Mode to see which executes faster.",
    icon: <Activity className="h-6 w-6 text-orange-400" />,
  },
  {
    title: "Real-Time Big O Charts",
    description: "Live updating charts and counters tracking Time and Space complexity at every single step of your algorithm's execution.",
    icon: <Activity className="h-6 w-6 text-blue-400" />,
  },
  {
    title: "Time Travel Debugging",
    description: "Pause, step forward, or step backward through your code's execution. Never miss exactly where a bug occurred again.",
    icon: <Layers className="h-6 w-6 text-emerald-400" />,
  },
  {
    title: "Daily Challenges",
    description: "Keep your logic sharp by solving a new algorithmic challenge every day directly in the visualizer.",
    icon: <Network className="h-6 w-6 text-yellow-400" />,
  },
  {
    title: "Workspaces & Sharing",
    description: "Save your snippets to your workspace, or generate a shareable URL to easily embed your execution trace into blogs and forums.",
    icon: <Layers className="h-6 w-6 text-indigo-400" />,
  },
];

export const Features = () => {
  return (
    <section id="features" className="container mx-auto max-w-7xl px-6 pt-24 pb-4 md:px-8 scroll-mt-24">
      <div className="relative mb-24 md:mb-32">
        {/* Subtle background glow to break up the black space */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center text-center"
        >

          <h2 className="mx-auto mb-6 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            FEATURES
          </h2>
          <div className="mx-auto mb-6 h-px w-full max-w-md bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="mx-auto max-w-2xl text-center text-lg md:text-xl text-white/50 font-medium leading-relaxed">
            Everything you need to visualize, debug, and understand your code like never before.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {featureList.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: idx * 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_10px_40px_-10px_rgba(0,230,118,0.15)]"
          >
            {/* Subtle inner border glow on hover */}
            <div className="absolute inset-0 rounded-3xl border border-white/0 transition-colors duration-500 group-hover:border-emerald-500/20" />
            
            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 shadow-inner border border-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-emerald-400">{feature.title}</h3>
              <p className="text-white/60 text-base leading-relaxed md:text-lg">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        className="group relative overflow-hidden py-4 sm:py-6 md:py-8 transition-all duration-500"
      >

        <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
          <div className="flex-1">
            <h3 className="mb-5 text-3xl font-extrabold text-white tracking-tight">Step-by-Step Visualization Engine</h3>
            <p className="mb-8 text-lg leading-relaxed text-white/60">
              Our core engine parses your source code, instruments it, and runs it in a secure sandbox. 
              We extract variable states, scopes, and memory addresses at every step, delivering a 
              frame-by-frame JSON trace that powers the UI.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
                <Activity className="h-3.5 w-3.5" /> Time Complexity
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-400">
                <Layers className="h-3.5 w-3.5" /> Space Complexity
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-semibold text-cyan-400">
                <Network className="h-3.5 w-3.5" /> Call Stack
              </span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-[0_0_50px_-12px_rgba(37,99,235,0.15)] transition-transform duration-500 group-hover:scale-[1.02]">

              <div className="relative z-10 flex items-center gap-2 border-b border-white/5 bg-white/[0.03] backdrop-blur-md px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                <span className="ml-2 text-xs font-mono text-white/40 tracking-wider">trace_output.json</span>
              </div>
              <div className="relative z-10 p-6 font-mono text-sm text-white/70">
                <div className="text-white/40 mb-3">// Trace Output Example</div>
                <div><span className="text-pink-400">"step"</span>: <span className="text-purple-400">42</span>,</div>
                <div><span className="text-pink-400">"line"</span>: <span className="text-purple-400">15</span>,</div>
                <div><span className="text-pink-400">"callStack"</span>: [</div>
                <div className="pl-6"><span className="text-amber-300">"mergeSort"</span>, <span className="text-amber-300">"mergeSort"</span>, <span className="text-amber-300">"merge"</span></div>
                <div>],</div>
                <div><span className="text-pink-400">"locals"</span>: {'{'}</div>
                <div className="pl-6"><span className="text-cyan-400">"left"</span>: [<span className="text-purple-400">1</span>, <span className="text-purple-400">5</span>],</div>
                <div className="pl-6"><span className="text-cyan-400">"right"</span>: [<span className="text-purple-400">2</span>, <span className="text-purple-400">8</span>]</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
