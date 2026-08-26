import React from "react";
import type { HeapObject } from "@/frontend/types";
import { motion } from "framer-motion";

interface Props {
  obj: HeapObject;
}

export function DataStructureRenderer({ obj }: Props) {
  let parsed: any;
  try {
    parsed = JSON.parse(obj.data);
  } catch {
    parsed = obj.data;
  }

  // Helper to render nested pointers
  const renderValue = (val: any) => {
    if (val && typeof val === "object" && val.__address) {
      return <span className="text-accentBlue font-bold">{val.__address}</span>;
    }
    return typeof val === "string" ? `"${val}"` : String(val);
  };

  switch (obj.structureKind) {
    case "matrix":
      if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
        return (
          <div className="flex flex-col gap-1.5 p-3 bg-black/40 rounded-lg shadow-inner border border-white/5">
            {parsed.map((row: any[], i) => (
              <div key={i} className="flex gap-1.5 justify-center">
                {row.map((cell: any, j) => (
                  <motion.div 
                    layout
                    key={j} 
                    whileHover={{ scale: 1.1, zIndex: 10, boxShadow: "0 0 12px rgba(56, 189, 248, 0.4)" }}
                    className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 rounded-md border border-white/10 text-xs shadow-md transition-shadow cursor-default"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  >
                    {renderValue(cell)}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        );
      }
      break;

    case "primitive": // Regular array
      if (Array.isArray(parsed)) {
        return (
          <motion.div layout className="flex gap-1.5 p-3 bg-black/40 rounded-lg overflow-x-auto max-w-full shadow-inner border border-white/5 custom-scrollbar">
            {parsed.map((cell: any, i) => (
              <motion.div layout key={i} className="flex flex-col items-center shrink-0 group" transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
                <span className="text-[10px] text-white/40 mb-1 group-hover:text-accentBlue transition-colors">{i}</span>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -2, boxShadow: "0 0 12px rgba(56, 189, 248, 0.4)" }}
                  className="min-w-9 h-9 px-2.5 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 rounded-md border border-white/10 text-xs text-white shadow-md cursor-default"
                >
                  {renderValue(cell)}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        );
      }
      break;

    case "hashMap":
    case "generic":
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return (
          <div className="flex flex-col gap-1 p-2 bg-black/20 rounded-md text-xs w-full">
            {Object.entries(parsed).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-white/5 pb-1 last:border-0 last:pb-0">
                <span className="text-accentGreen opacity-80">{key}:</span>
                <span className="font-mono text-white">{renderValue(val)}</span>
              </div>
            ))}
          </div>
        );
      }
      break;
      
    case "binaryTree":
    case "linkedList":
    case "graph":
      if (parsed && typeof parsed === "object") {
        return (
          <div className="flex flex-col gap-1 p-2 bg-black/20 rounded-md text-xs w-full border-l-2 border-accentBlue">
            {Object.entries(parsed).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center gap-4 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                <span className="text-white/60">{key}:</span>
                <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-white">{renderValue(val)}</span>
              </div>
            ))}
          </div>
        );
      }
      break;
  }

  // Fallback
  return (
    <div className="p-2 text-xs font-mono text-white/80 whitespace-pre-wrap break-all bg-black/20 rounded-md">
      {typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2)}
    </div>
  );
}
