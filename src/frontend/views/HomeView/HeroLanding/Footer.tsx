"use client";

import React from "react";
import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-[#050505] overflow-hidden pt-16 pb-8">
      {/* Ambient background glow at the bottom */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#00E676]/10 blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          
          {/* Brand & Newsletter Section */}
          <div className="col-span-1 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00E676]/20 bg-[#00E676]/10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                    <path
                      d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
                      stroke="currentColor"
                      strokeWidth={8}
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tight text-white">CodeTrace</span>
              </div>
              <p className="mb-8 max-w-sm text-base text-white/50 leading-relaxed font-medium">
                The ultimate code execution and visualization engine. Build the future with powerful AI insights and frame-by-frame debugging.
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <span className="mb-3 block text-sm font-semibold tracking-wide text-white/80 uppercase">
                Stay Updated
              </span>
              <div className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#00E676]/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,230,118,0.1)]"
                />
                <button className="absolute right-1 top-1 bottom-1 rounded-lg bg-[#00E676] px-4 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:ml-auto">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/80">Products</h4>
            <ul className="space-y-4 text-sm font-medium text-white/40">
              <li><a href="#" className="hover:text-[#00E676] transition-colors duration-300">Trace Engine</a></li>
              <li><a href="#" className="hover:text-[#00E676] transition-colors duration-300">Visualizer UI</a></li>
              <li><a href="#" className="hover:text-[#00E676] transition-colors duration-300">AI Assistant</a></li>
              <li><a href="#" className="hover:text-[#00E676] transition-colors duration-300">CodeTrace API</a></li>
              <li><a href="#" className="hover:text-[#00E676] transition-colors duration-300">Enterprise</a></li>
            </ul>
          </div>
          
          <div className="lg:ml-auto">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/80">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-white/40">
              <li><a href="/docs" className="hover:text-[#00E676] transition-colors duration-300">Documentation</a></li>
              <li><a href="/opensource" className="hover:text-[#00E676] transition-colors duration-300">GitHub Open Source</a></li>
              <li><a href="/algorithms" className="hover:text-[#00E676] transition-colors duration-300">Algorithm Library</a></li>
              <li><a href="/discord" className="hover:text-[#00E676] transition-colors duration-300">Community Discord</a></li>
              <li><a href="/blog" className="hover:text-[#00E676] transition-colors duration-300">Blog & Updates</a></li>
            </ul>
          </div>
          
          <div className="lg:ml-auto">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/80">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-white/40">
              <li><a href="/about" className="hover:text-[#00E676] transition-colors duration-300">About Us</a></li>
              <li><a href="/contact" className="hover:text-[#00E676] transition-colors duration-300">Contact Me</a></li>
              <li><a href="/privacy" className="hover:text-[#00E676] transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#00E676] transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm font-medium text-white/40">
            © {new Date().getFullYear()} CodeTrace Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/40 transition-colors duration-300 hover:text-[#00E676]">
              <Github size={20} />
            </a>
            <a href="#" className="text-white/40 transition-colors duration-300 hover:text-[#00E676]">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-white/40 transition-colors duration-300 hover:text-[#00E676]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
