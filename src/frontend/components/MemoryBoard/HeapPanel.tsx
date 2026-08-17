"use client";

import React from "react";
import type { HeapObject } from "@/frontend/types";

interface HeapPanelProps {
  heap: HeapObject[];
  prevHeap?: HeapObject[];
}

export const HeapPanel = React.memo(({ heap, prevHeap }: HeapPanelProps) => {
  const prevDataMap = new Map<string, string>();
  if (prevHeap) {
    for (const obj of prevHeap) {
      prevDataMap.set(obj.id, obj.data);
    }
  }

  if (heap.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-white/30 italic">
        No heap objects yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
      {heap.map((obj) => {
        const prevData = prevDataMap.get(obj.id);
        const hasChanged = prevData !== undefined && prevData !== obj.data;
        const isNew = prevData === undefined && prevHeap && prevHeap.length > 0;

        return (
          <div
            key={obj.id}
            id={`heap-${obj.address}`}
            className={`rounded-lg border overflow-hidden ${
              isNew
                ? "border-accentGreen/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                : hasChanged
                ? "border-accentYellow/40 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                : "border-white/10"
            } bg-white/[0.02]`}
          >
            {/* Type badge header */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.03] border-b border-white/5">
              <TypeBadge kind={obj.structureKind} type={obj.type} />
              <span className="text-[10px] text-white/25 font-mono ml-auto">@{obj.address}</span>
            </div>

            {/* Rendered content */}
            <div className="p-2">
              <RenderHeapObject obj={obj} prevData={prevData} />
            </div>
          </div>
        );
      })}
    </div>
  );
});
HeapPanel.displayName = "HeapPanel";

/* ─── Type Badge ─── */
function TypeBadge({ kind, type }: { kind: string; type: string }) {
  const colorMap: Record<string, string> = {
    primitive: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    linkedList: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    binaryTree: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    graph: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    matrix: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    stack: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    queue: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    hashMap: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    generic: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  const color = colorMap[kind] || colorMap.generic;

  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded border ${color}`}>
      {type || kind}
    </span>
  );
}

/* ─── Render Heap Object ─── */
function RenderHeapObject({ obj, prevData }: { obj: HeapObject; prevData?: string }) {
  let parsed: any;
  try {
    parsed = JSON.parse(obj.data);
  } catch {
    parsed = obj.data;
  }

  let prevParsed: any = null;
  if (prevData) {
    try { prevParsed = JSON.parse(prevData); } catch { prevParsed = null; }
  }

  const renderValue = (val: any) => {
    if (val && typeof val === "object" && val.__address) {
      return <span className="text-accentYellow font-bold">→ @{val.__address}</span>;
    }
    if (typeof val === "string") return <span className="text-sky-300">&quot;{val}&quot;</span>;
    if (typeof val === "number") return <span className="text-amber-300">{val}</span>;
    if (typeof val === "boolean") return <span className="text-purple-300">{String(val)}</span>;
    if (val === null || val === undefined) return <span className="text-white/30">None</span>;
    return <span className="text-white/80">{String(val)}</span>;
  };

  // ─── Array / List ───
  if (Array.isArray(parsed)) {
    const prevArr = Array.isArray(prevParsed) ? prevParsed : null;
    return (
      <div className="overflow-x-auto">
        <table className="border-collapse font-mono text-xs">
          <thead>
            <tr>
              {parsed.map((_: any, i: number) => (
                <th key={i} className="px-2 py-0.5 text-[9px] text-white/30 font-normal text-center border-b border-white/5 min-w-[32px]">
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {parsed.map((cell: any, i: number) => {
                const cellChanged = prevArr && i < prevArr.length && JSON.stringify(prevArr[i]) !== JSON.stringify(cell);
                return (
                  <td
                    key={i}
                    className={`px-2 py-1.5 text-center border border-white/10 min-w-[32px] ${
                      cellChanged ? "bg-accentYellow/15 border-accentYellow/30" : "bg-white/[0.03]"
                    }`}
                  >
                    {renderValue(cell)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ─── Dict / HashMap / Generic object ───
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const entries = Object.entries(parsed);
    const isClassInstance = obj.type.includes("instance") || obj.type.includes("Instance") || obj.structureKind === "generic";

    return (
      <table className="w-full border-collapse font-mono text-xs">
        <tbody>
          {entries.map(([key, val]) => {
            const prevVal = prevParsed ? prevParsed[key] : undefined;
            const cellChanged = prevVal !== undefined && JSON.stringify(prevVal) !== JSON.stringify(val);

            return (
              <tr key={key} className="border-b border-white/5 last:border-b-0">
                <td className="px-2 py-1 text-accentGreen/70 whitespace-nowrap border-r border-white/10 w-[1%]">
                  {isClassInstance ? key : renderValue(key)}
                </td>
                <td className={`px-2 py-1 ${cellChanged ? "bg-accentYellow/15" : ""}`}>
                  {renderValue(val)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // ─── Fallback ───
  return (
    <div className="text-xs font-mono text-white/70 whitespace-pre-wrap break-all">
      {typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2)}
    </div>
  );
}
