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
    <section className="flex flex-col min-h-0 rounded-xl border border-white/10 bg-[#0a0f1a] overflow-hidden">
      <header className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border-b border-white/5 shrink-0">
        <Terminal size={12} className="text-accentGreen" />
        <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">stdout</span>
        {lines.length > 0 && (
          <span className="text-[10px] text-white/30 ml-auto">{lines.filter(l => l).length} line{lines.filter(l => l).length !== 1 ? "s" : ""}</span>
        )}
      </header>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-2 font-mono text-xs custom-scrollbar"
      >
        {lines.length === 0 ? (
          <span className="text-white/20 italic">No output yet.</span>
        ) : (
          lines.map((line, i) => (
            <div
              key={`${i}-${line}`}
              className="text-accentGreen/90 leading-5 whitespace-pre-wrap break-all"
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
