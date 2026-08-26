"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

interface ConsoleOutputProps {
  output: string;
}

export const ConsoleOutput = React.memo(({ output }: ConsoleOutputProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const lines = output ? output.split("\n") : [];

  return (
    <section className="flex flex-col min-h-0 rounded-xl border border-white/10 bg-[#000000] shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden h-full">
      <header className="flex items-center gap-3 px-3 py-2 bg-[#1C1C1E] border-b border-white/5 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Terminal size={12} className="text-white/40" />
          <span className="text-[10px] font-semibold text-white/50 tracking-wider">bash - stdout</span>
        </div>
        {lines.length > 0 && (
          <span className="text-[9px] text-white/30 ml-auto">{lines.filter(l => l).length} line{lines.filter(l => l).length !== 1 ? "s" : ""}</span>
        )}
      </header>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 font-mono text-[13px] custom-scrollbar selection:bg-accentGreen/30"
      >
        {lines.length === 0 ? (
          <span className="text-white/20 italic text-xs">No output yet.</span>
        ) : (
          lines.map((line, i) => (
            <div
              key={`${i}-${line}`}
              className="text-[#00FF41] leading-relaxed whitespace-pre-wrap break-all [text-shadow:0_0_8px_rgba(0,255,65,0.4)]"
            >
              {line || "\u00A0"}
            </div>
          ))
        )}
      </div>
    </section>
  );
});
ConsoleOutput.displayName = "ConsoleOutput";
