"use client";

import React, { useEffect, useState } from "react";
import { CodeTraceApp } from "@/frontend/views/HomeView/CodeTraceApp";

export default function VSCodeEmbedPage() {
  const [initialCode, setInitialCode] = useState<string | null>(null);
  const [initialLang, setInitialLang] = useState<string>("python");

  useEffect(() => {
    // Hide standard elements if we are in VSCode Webview
    document.body.classList.add("vscode-webview");

    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message && message.type === 'CODETRACE_LOAD') {
        setInitialCode(message.code);
        setInitialLang(message.lang || 'python');
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  if (initialCode === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/50 font-mono text-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p>Waiting for code from VS Code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0A0A0A] overflow-hidden">
      <CodeTraceApp initialCode={initialCode} initialLang={initialLang} isEmbed={true} />
    </div>
  );
}
