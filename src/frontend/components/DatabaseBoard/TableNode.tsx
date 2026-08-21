"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { TableState } from "@/frontend/types";
import { Database, Key } from "lucide-react";

export function TableNode({ data }: { data: { table: TableState; prevTable?: TableState; isTarget?: boolean } }) {
  const { table, prevTable, isTarget } = data;
  const cols = table.columns.length > 0 ? table.columns : (table.rows.length > 0 ? Object.keys(table.rows[0]) : []);

  return (
    <div className={`min-w-[280px] max-w-[450px] rounded-xl border overflow-hidden transition-all duration-500 shadow-2xl ${
      isTarget ? "bg-[#09090b] border-accentBlue/50 ring-1 ring-accentBlue/20 shadow-accentBlue/10 scale-[1.02]" : "bg-[#09090b] border-white/10 ring-1 ring-black scale-100"
    }`}>
      {/* Target indicator handle */}
      <Handle type="target" position={Position.Top} className="!bg-accentBlue !w-3 !h-1.5 !rounded-full !border-0 !top-[-3px]" />
      
      {/* Sleek Header */}
      <div className={`px-4 py-3 flex items-center gap-3 border-b relative transition-colors duration-500 ${
        isTarget ? "bg-accentBlue/10 border-accentBlue/20 text-accentBlue" : "bg-[#18181b] border-white/5 text-zinc-300"
      }`}>
        {isTarget && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accentBlue to-transparent opacity-50" />
        )}
        <div className={`p-1.5 rounded-md ${isTarget ? "bg-accentBlue/20" : "bg-white/5"} text-inherit`}>
          <Database size={16} strokeWidth={2.5} />
        </div>
        <span className="font-mono text-[13px] font-bold uppercase tracking-widest">{table.name}</span>
        {table.rows.length > 0 && (
          <span className={`ml-auto font-mono text-[11px] font-bold px-2 py-1 rounded-md ring-1 ${
            isTarget ? "bg-accentBlue/20 text-accentBlue ring-accentBlue/30" : "bg-white/10 text-zinc-400 ring-white/20"
          }`}>
            {table.rows.length} row{table.rows.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Columns / Schema summary */}
      <div className="bg-[#09090b] px-4 py-2 border-b border-white/5 flex flex-col gap-y-1.5">
        {cols.map(c => {
          const isId = c.toLowerCase() === 'id' || c.toLowerCase().includes('_id');
          return (
            <div key={c} className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 font-medium">
              {isId ? <Key size={12} className="text-accentYellow shrink-0" /> : <div className="w-3" />}
              <span>{c}</span>
              <span className="ml-auto text-[9px] text-white/20 uppercase tracking-widest">{isId ? 'PK' : 'COL'}</span>
            </div>
          );
        })}
      </div>

      {/* Data Rows Preview */}
      {table.rows.length > 0 ? (
        <div className="max-h-[180px] overflow-y-auto custom-scrollbar bg-[#050505]">
          <table className="w-full text-left text-[11px] font-mono text-zinc-300 border-collapse">
            <thead className="bg-[#18181b] text-zinc-500 sticky top-0 shadow-sm">
              <tr>
                {cols.map(c => (
                  <th key={c} className="px-3 py-2 border-r border-white/5 last:border-0 font-medium tracking-wide uppercase">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rIdx) => {
                let status = "none";
                if (prevTable) {
                  const prevRows = prevTable.rows;
                  const rowString = JSON.stringify(row);
                  const idCol = cols.find(c => c.toLowerCase() === 'id');
                  
                  if (idCol && row[idCol] !== undefined) {
                    const pr = prevRows.find((r: any) => r[idCol] === row[idCol]);
                    if (!pr) status = "inserted";
                    else if (JSON.stringify(pr) !== rowString) status = "updated";
                  } else {
                    if (!prevRows.some((r: any) => JSON.stringify(r) === rowString)) {
                      status = "inserted";
                    }
                  }
                }

                return (
                  <tr key={rIdx} className={`border-b border-white/5 last:border-0 transition-colors duration-500 ${
                    status === "inserted" ? "bg-accentGreen/10 text-accentGreen" :
                    status === "updated" ? "bg-accentYellow/10 text-accentYellow" :
                    "bg-[#09090b] hover:bg-white/5"
                  }`}>
                    {cols.map(c => (
                      <td key={c} className="px-3 py-2 border-r border-white/5 last:border-0 truncate max-w-[140px]" title={String(row[c])}>
                        {row[c] !== null ? (
                          typeof row[c] === 'number' ? <span className="text-[#dcdcaa]">{row[c]}</span> : 
                          typeof row[c] === 'string' ? <span className="text-[#ce9178]">'{row[c]}'</span> : 
                          String(row[c])
                        ) : (
                          <span className="text-[#569cd6] italic">NULL</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-[11px] text-zinc-600 italic text-center bg-[#050505]">Empty table</div>
      )}

      {/* Source output handle */}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !w-2 !h-2 !border-0 !bottom-[-4px]" />
    </div>
  );
}
