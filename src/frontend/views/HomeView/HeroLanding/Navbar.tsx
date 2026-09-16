"use client";

import React, { useState } from "react";
import { Github, Menu, MonitorSmartphone, Tablet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "FEATURES", href: "/#features" },
  { name: "LANGUAGES", href: "/#languages" },
  { name: "ALGORITHMS", href: "/#algorithms" },
  { name: "DOCS", href: "/docs" },
  { name: "CONTACT", href: "/contact" },
];

export const Navbar = ({ 
  onStart, 
  deviceMode = "laptop", 
  setDeviceMode 
}: { 
  onStart: () => void;
  deviceMode?: "laptop" | "tablet";
  setDeviceMode?: (mode: "laptop" | "tablet") => void;
}) => {
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
          <img src="/logo-icon.png" alt="CodeTrace" className="w-9 h-9 rounded-lg transition-all duration-300 group-hover:scale-110" />
          
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

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={onStart}
              className="flex items-center gap-2 rounded-lg bg-[#00E676] px-5 py-2 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Playground
            </button>
            <a
              href="https://github.com/Satya522/CodeTrace"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};
