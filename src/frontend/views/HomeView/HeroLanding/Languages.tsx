"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  SiJavascript, SiTypescript, SiPython, SiCplusplus, SiMongodb,
  SiGo, SiRust, SiRuby, SiPhp, SiSwift, SiKotlin
} from "react-icons/si";
import { FaJava, FaDatabase } from "react-icons/fa";

const languages = [
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Java", icon: FaJava, color: "#E32D2D" },
  { name: "C++", icon: SiCplusplus, color: "#00599C" },
  { name: "Go", icon: SiGo, color: "#00ADD8" },
  { name: "Rust", icon: SiRust, color: "#DEA584" },
  { name: "Ruby", icon: SiRuby, color: "#CC342D" },
  { name: "PHP", icon: SiPhp, color: "#777BB4" },
  { name: "Swift", icon: SiSwift, color: "#F05138" },
  { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
  { name: "SQL", icon: FaDatabase, color: "#336791" },
  { name: "NoSQL", icon: SiMongodb, color: "#47A248" },
];

export const Languages = () => {
  return (
    <section id="languages" className="container mx-auto max-w-7xl px-6 pt-4 pb-8 md:px-8 scroll-mt-24">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        className="relative flex flex-col items-center justify-center p-6 py-12 text-center md:py-16 overflow-hidden"
      >
        <span className="mb-6 inline-flex rounded-full border border-[#00E676]/20 bg-[#00E676]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#00E676] uppercase">
          Universal Execution
        </span>
        
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Code in any language, instantly.
        </h2>
        
        <p className="mx-auto mb-16 max-w-2xl text-lg font-medium text-white/50 leading-relaxed md:text-xl">
          From native browser execution to lightning-fast cloud sandboxes, visualize logic in your favorite stack without leaving the tab.
        </p>

        {/* Infinite Marquee Container */}
        <div className="relative flex w-full max-w-[100vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-6 pr-6">
            {/* Render list twice to ensure seamless infinite looping */}
            {[...languages, ...languages, ...languages].map((lang, idx) => (
              <div
                key={idx}
                className="group flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-105"
                style={{
                  boxShadow: `inset 0 0 20px -10px ${lang.color}00`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `inset 0 0 20px -10px ${lang.color}40`;
                  e.currentTarget.style.borderColor = `${lang.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `inset 0 0 20px -10px ${lang.color}00`;
                  e.currentTarget.style.borderColor = `rgba(255,255,255,0.1)`;
                }}
              >
                <div 
                  className="flex h-6 w-6 items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ color: lang.color }}
                >
                  <lang.icon className="h-5 w-5 drop-shadow-md" />
                </div>
                <span className="whitespace-nowrap text-base font-bold text-white/80 transition-colors duration-300 group-hover:text-white">
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
