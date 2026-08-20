"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Braces } from "lucide-react";

const syntaxHighlight = (json: string) => {
  if (!json) return "";
  let processed = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return processed.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'text-[#dcdcaa]'; // number/boolean (VSCode pale yellow)
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-[#9cdcfe]'; // key (VSCode light blue)
        match = `"<span class="${cls}">${match.replace(/"/g, '').replace(/:$/, '')}</span>"<span class="text-zinc-500">:</span>`;
        return match;
      } else {
        cls = 'text-[#ce9178]'; // string (VSCode orange/brown)
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-[#569cd6]'; // boolean (VSCode blue keyword)
    } else if (/null/.test(match)) {
      cls = 'text-[#569cd6]'; // null (VSCode blue keyword)
    }
    return `<span class="${cls}">${match}</span>`;
  });
};

export function DocumentNode({ data }: { data: { doc: any; status: "none" | "inserted" | "updated" | "deleted" } }) {
  const { doc, status } = data;

  let bgClass = "bg-[#09090b] border-white/10 ring-1 ring-black";
  let headerClass = "bg-[#18181b] border-white/5";
  let iconColor = "text-zinc-500";
  let statusText = "text-zinc-400";
  let shadowClass = "shadow-2xl shadow-black/80";
  let opacity = "opacity-100";

  if (status === "inserted") {
    bgClass = "bg-[#09090b] border-accentGreen/50 ring-1 ring-accentGreen/20";
    headerClass = "bg-accentGreen/10 border-accentGreen/20";
    iconColor = "text-accentGreen";
    statusText = "text-accentGreen";
    shadowClass = "shadow-[0_10px_40px_rgba(46,204,113,0.15)] scale-[1.02]";
  } else if (status === "updated") {
    bgClass = "bg-[#09090b] border-accentYellow/50 ring-1 ring-accentYellow/20";
    headerClass = "bg-accentYellow/10 border-accentYellow/20";
    iconColor = "text-accentYellow";
    statusText = "text-accentYellow";
    shadowClass = "shadow-[0_10px_40px_rgba(241,196,15,0.15)] scale-[1.02]";
  } else if (status === "deleted") {
    bgClass = "bg-[#09090b] border-accentRed/30";
    headerClass = "bg-[#18181b] border-accentRed/20";
    iconColor = "text-accentRed/50";
    statusText = "text-accentRed/50 line-through";
    shadowClass = "shadow-none";
    opacity = "opacity-60 grayscale";
  }

  const docId = doc._id ? String(doc._id).substring(0, 8) : "doc";
  const jsonString = JSON.stringify(doc, null, 2);
  const highlightedJson = syntaxHighlight(jsonString);

  return (
    <div className={`min-w-[280px] max-w-[400px] rounded-xl border relative overflow-hidden transition-all duration-500 ${bgClass} ${shadowClass} ${opacity}`}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-600 !w-2 !h-2 !border-0 !top-[-4px]" />
      
      <div className={`px-4 py-3 flex items-center gap-3 border-b ${headerClass}`}>
        <div className={`p-1.5 rounded-md bg-white/5 ${iconColor}`}>
          <Braces size={16} strokeWidth={2.5} />
        </div>
        <span className={`font-mono text-[12px] font-bold tracking-widest uppercase ${statusText}`}>
          {status !== "none" ? status : "Document"}
        </span>
        <span className={`ml-auto font-mono text-[11px] font-bold px-2 py-1 rounded-md shadow-inner ring-1 ${
          status === "inserted" ? "bg-accentGreen/20 text-accentGreen ring-accentGreen/30" : 
          status === "updated" ? "bg-accentYellow/20 text-accentYellow ring-accentYellow/30" : 
          "bg-white/10 text-zinc-300 ring-white/20"
        }`}>
          #{docId}
        </span>
      </div>

      <div className="p-4 overflow-x-auto custom-scrollbar bg-[#09090b]">
        <pre 
          className={`font-mono text-[13px] leading-[1.6] text-zinc-300 ${status === 'deleted' ? 'line-through text-zinc-600' : ''}`}
          dangerouslySetInnerHTML={{ __html: highlightedJson }}
        />
      </div>
    </div>
  );
}
