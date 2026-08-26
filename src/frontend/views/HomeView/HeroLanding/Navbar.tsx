"use client";

import React, { useState } from "react";
import { Github, Menu, MonitorSmartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "FEATURES", href: "/#features" },
  { name: "LANGUAGES", href: "/#languages" },
  { name: "ALGORITHMS", href: "/#algorithms" },
  { name: "DOCS", href: "/docs" },
  { name: "CONTACT", href: "/contact" },
];

export const Navbar = ({ onStart }: { onStart: () => void }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#010409]/80 shadow-[0_8px_30px_rgba(0,0,0,0.55),0_0_50px_-15px_rgba(0,230,118,0.25)] backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <a href="/" className="flex items-center gap-3.5 group hover:opacity-90 transition-opacity">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F172A]/80 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_0_15px_rgba(0,230,118,0.15)] overflow-hidden transition-all duration-300 group-hover:border-[#00E676]/50 group-hover:shadow-[0_0_25px_rgba(0,230,118,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E676]/20 via-transparent to-emerald-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
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
          
          <div className="flex flex-col justify-center">
            <h1 className="text-[17px] leading-tight font-black tracking-tight text-white flex items-center">
              Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-emerald-500">Trace</span>
            </h1>
            <span className="text-[9px] font-mono font-medium text-white/40 tracking-[0.2em] uppercase leading-none mt-1">
              Visual Engine
            </span>
          </div>
        </a>

        <div className="flex h-full items-center gap-8">
          <nav className="hidden h-full items-center gap-1 lg:flex" onMouseLeave={() => setHoveredItem(null)}>
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                onMouseEnter={() => setHoveredItem(link.name)}
                className="relative px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {hoveredItem === link.name && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 z-[-1] rounded-md bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 overflow-hidden rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              <Github size={16} />
              <span>GitHub</span>
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">
                <span>3.5k</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-400"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </a>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle theme"
            >
              <MonitorSmartphone size={18} />
            </button>
          </div>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};
