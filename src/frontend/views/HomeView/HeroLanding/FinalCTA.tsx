"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TerminalSquare } from "lucide-react";

export const FinalCTA = ({ onStart }: { onStart?: () => void }) => {
  return (
    <section className="relative w-full border-t border-white/5 bg-black py-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/20 to-[#00E676]/20 blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="container mx-auto max-w-5xl px-6 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-[#0A0A0A]/50 p-12 md:p-20 backdrop-blur-xl shadow-[0_0_100px_-20px_rgba(0,230,118,0.15)]"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E676]/20 to-blue-500/20 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
            <TerminalSquare className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Stop guessing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-cyan-400">
              Start visualizing.
            </span>
          </h2>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-white/50 leading-relaxed">
            Join thousands of developers who are already using CodeTrace to debug faster, understand complex logic, and write better code. No credit card required.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button 
              onClick={onStart}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              Start Coding for Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/[0.08] hover:border-white/20 active:scale-95 sm:w-auto">
              Book a Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
