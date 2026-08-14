import type { ExecutionMode } from "@/frontend/types";

export function ExecutionBadge({ mode }: { mode: ExecutionMode }) {
  const isLive = mode === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        isLive
          ? "border-accentGreen/40 bg-accentGreen/10 text-accentGreen"
          : "border-accentYellow/40 bg-accentYellow/10 text-accentYellow"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-accentGreen" : "bg-accentYellow"}`}
      />
      {isLive ? "Live Trace" : "AI-Simulated"}
    </span>
  );
}
