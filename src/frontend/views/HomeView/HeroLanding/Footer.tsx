"use client";

import React, { useState } from "react";
import { Github, Twitter, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export const Footer = ({ onStart }: { onStart?: () => void }) => {
  const [comingSoonModal, setComingSoonModal] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: "" });

  const handleComingSoon = (title: string) => {
    setComingSoonModal({ isOpen: true, title });
  };

  return (
    <>
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
                <li><button onClick={() => onStart ? onStart() : window.location.href = "/?start=true"} className="hover:text-[#00E676] transition-colors duration-300 text-left">Trace Engine</button></li>
                <li><button onClick={() => onStart ? onStart() : window.location.href = "/?start=true"} className="hover:text-[#00E676] transition-colors duration-300 text-left">Visualizer UI</button></li>
                <li><button onClick={() => handleComingSoon("VS Code Extension")} className="hover:text-[#00E676] transition-colors duration-300 text-left">VS Code Extension</button></li>
                <li><button onClick={() => handleComingSoon("Browser Extension")} className="hover:text-[#00E676] transition-colors duration-300 text-left">Browser Extension</button></li>
                <li><button onClick={() => handleComingSoon("CLI Tool")} className="hover:text-[#00E676] transition-colors duration-300 text-left">CLI Tool</button></li>
                <li><button onClick={() => handleComingSoon("Self-Hosted (Docker)")} className="hover:text-[#00E676] transition-colors duration-300 text-left">Self-Hosted (Docker)</button></li>
              </ul>
            </div>
            
            <div className="lg:ml-auto">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/80">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-white/40">
                <li><Link href="/docs" className="hover:text-[#00E676] transition-colors duration-300">Documentation</Link></li>
                <li><Link href="/opensource" className="hover:text-[#00E676] transition-colors duration-300">GitHub Open Source</Link></li>
                <li><Link href="/algorithms" className="hover:text-[#00E676] transition-colors duration-300">Algorithm Library</Link></li>
                <li><Link href="/discord" className="hover:text-[#00E676] transition-colors duration-300">Community Discord</Link></li>
                <li><Link href="/blog" className="hover:text-[#00E676] transition-colors duration-300">Blog & Updates</Link></li>
              </ul>
            </div>
            
            <div className="lg:ml-auto">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/80">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-white/40">
                <li><Link href="/about" className="hover:text-[#00E676] transition-colors duration-300">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#00E676] transition-colors duration-300">Contact Me</Link></li>
                <li><Link href="/privacy" className="hover:text-[#00E676] transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#00E676] transition-colors duration-300">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm font-medium text-white/40">
              © {new Date().getFullYear()} CodeTrace Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-white/40 transition-colors duration-300 hover:text-[#00E676]">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-white/40 transition-colors duration-300 hover:text-[#00E676]">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Beautiful Coming Soon Modal */}
      <AnimatePresence>
        {comingSoonModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#00E676]/20 blur-[50px] pointer-events-none" />
              
              <button 
                onClick={() => setComingSoonModal({ isOpen: false, title: "" })}
                className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00E676]/10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                <Sparkles size={28} />
              </div>
              
              <h3 className="mb-2 text-2xl font-bold text-white">
                {comingSoonModal.title}
              </h3>
              <p className="mb-6 text-sm text-white/60 leading-relaxed">
                We are actively building this feature to seamlessly integrate CodeTrace into your workflow. Stay tuned for the early access release!
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setComingSoonModal({ isOpen: false, title: "" })}
                  className="flex-1 rounded-xl bg-[#00E676] py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Got it
                </button>
                <Link 
                  href="/discord"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Join Discord
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
