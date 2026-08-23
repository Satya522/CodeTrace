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
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#00E676]">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path
                d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
                stroke="currentColor"
                strokeWidth={8}
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CodeTrace</span>
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
