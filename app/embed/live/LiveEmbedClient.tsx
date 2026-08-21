"use client";

import { useSearchParams } from "next/navigation";
import { EmbedVisualizer } from "../[id]/EmbedVisualizer";
import { useMemo } from "react";
import type { CodeExample } from "@/frontend/lib";

export function LiveEmbedClient() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  const langParam = searchParams.get("lang") || "javascript";
  
  const example = useMemo<CodeExample | null>(() => {
    if (!codeParam) return null;
    try {
      // Handle the base64 encoding from the share URL
      let decoded = "";
      try {
        decoded = decodeURIComponent(atob(codeParam));
      } catch {
        decoded = atob(codeParam);
      }
      return {
        id: "live",
        name: "Live Embed",
        category: "live",
        language: langParam as any,
        code: decoded
      };
    } catch (e) {
      console.error("Failed to decode code param");
      return null;
    }
  }, [codeParam, langParam]);

  if (!example) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-white/50 p-8 text-center bg-[#0a0f1a]">
        <div className="text-xl font-bold mb-2">Invalid Embed</div>
        <div className="text-sm">Missing or invalid code parameter in URL</div>
      </div>
    );
  }

  return <EmbedVisualizer example={example} />;
}
