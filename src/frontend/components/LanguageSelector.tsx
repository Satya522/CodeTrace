import React from "react";
import { EXAMPLES } from "@/frontend/lib";
import { ExecutionBadge } from "./ExecutionBadge";

export function LanguageSelector({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const currentExample = EXAMPLES.find((ex) => ex.id === selectedId);
  
  // We can determine the mode based on the language
  // Tier 1: python, javascript, sql -> live
  // Tier 2: c, cpp, java, go -> live output, simulated memory -> simulated for visualizer
  const mode = ["python", "javascript", "sql", "nosql"].includes(currentExample?.language || "")
    ? "live"
    : "simulated";

  return (
    <div className="flex items-center gap-3">
      <select
        className="rounded-lg border border-border bg-black/30 px-2 py-1.5 text-xs text-white/80"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
      >
        {EXAMPLES.map((ex) => (
          <option key={ex.id} value={ex.id} className="bg-neutral-900 text-white">
            {ex.name}
          </option>
        ))}
      </select>
      <ExecutionBadge mode={mode} />
    </div>
  );
}
