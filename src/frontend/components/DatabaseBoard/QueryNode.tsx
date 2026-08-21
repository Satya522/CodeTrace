"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Activity, Code, GitMerge } from "lucide-react";
import { QueryStep, NoSQLStep } from "@/frontend/types";
import { Parser } from "node-sql-parser";

// Helper to stringify AST components safely
function stringifyExpr(expr: any): string {
  if (!expr) return "";
  if (typeof expr === 'string') return expr;
  if (expr.type === 'column_ref') return expr.column;
  if (expr.type === 'binary_expr') return `${stringifyExpr(expr.left)} ${expr.operator} ${stringifyExpr(expr.right)}`;
  if (expr.type === 'number') return expr.value;
  if (expr.value !== undefined) return String(expr.value);
  return "...";
}

function ASTViewer({ ast }: { ast: any }) {
  if (!ast) return null;
  const stmts = Array.isArray(ast) ? ast : [ast];

  return (
    <div className="flex flex-col gap-3 p-4 bg-black/60 font-mono text-[11px]">
      {stmts.map((stmt, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          {stmt.type === 'select' && (
            <>
              <div className="bg-blue-500/10 text-blue-300 px-2 py-1.5 rounded border border-blue-500/20 shadow-sm flex items-start gap-2">
                <span className="font-bold text-blue-400 mt-0.5">SELECT</span>
                <span className="whitespace-pre-wrap">{stmt.columns === '*' ? '*' : stmt.columns?.map((c: any) => stringifyExpr(c.expr)).join(', ')}</span>
              </div>
              
              {stmt.from && stmt.from.map((f: any, idx: number) => (
                <React.Fragment key={idx}>
                  {idx === 0 ? (
                    <div className="bg-emerald-500/10 text-emerald-300 px-2 py-1.5 rounded border border-emerald-500/20 shadow-sm ml-4 flex items-start gap-2">
                      <span className="font-bold text-emerald-400 mt-0.5">FROM</span>
                      <span>{f.table}</span>
                    </div>
                  ) : (
                    <div className="bg-purple-500/10 text-purple-300 px-2 py-1.5 rounded border border-purple-500/20 shadow-sm ml-8 flex items-start gap-2">
                      <span className="font-bold text-purple-400 mt-0.5">{f.join || 'JOIN'}</span>
                      <span>{f.table} {f.on ? `ON ${stringifyExpr(f.on)}` : ''}</span>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {stmt.where && (
                <div className="bg-amber-500/10 text-amber-300 px-2 py-1.5 rounded border border-amber-500/20 shadow-sm ml-4 flex items-start gap-2">
                  <span className="font-bold text-amber-400 mt-0.5">WHERE</span>
                  <span>{stringifyExpr(stmt.where)}</span>
                </div>
              )}
              
              {stmt.orderby && (
                <div className="bg-rose-500/10 text-rose-300 px-2 py-1.5 rounded border border-rose-500/20 shadow-sm ml-4 flex items-start gap-2">
                  <span className="font-bold text-rose-400 mt-0.5">ORDER BY</span>
                  <span>{stmt.orderby.map((o: any) => `${stringifyExpr(o.expr)} ${o.type}`).join(', ')}</span>
                </div>
              )}
            </>
          )}

          {stmt.type === 'insert' && (
            <div className="bg-emerald-500/10 text-emerald-300 px-2 py-1.5 rounded border border-emerald-500/20 shadow-sm flex items-start gap-2">
              <span className="font-bold text-emerald-400 mt-0.5">INSERT INTO</span>
              <span>{stmt.table?.[0]?.table}</span>
            </div>
          )}

          {stmt.type === 'create' && (
            <div className="bg-teal-500/10 text-teal-300 px-2 py-1.5 rounded border border-teal-500/20 shadow-sm flex items-start gap-2">
              <span className="font-bold text-teal-400 mt-0.5">CREATE TABLE</span>
              <span>{stmt.table?.[0]?.table}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function QueryNode({ data }: { data: { step: QueryStep | NoSQLStep; uiLanguage?: "en" | "hi" } }) {
  const { step, uiLanguage = "en" } = data;
  if (!step) return null;

  const isSQL = 'sql' in step;
  const queryText = isSQL ? step.sql : (step as NoSQLStep).query;
  const rowsAffected = isSQL ? step.rowsAffected : 0;
  const queryPlan = isSQL ? step.queryPlan : undefined;

  let ast: any = null;
  if (isSQL) {
    try {
      const parser = new Parser();
      ast = parser.astify(queryText, { database: 'mysql' });
    } catch (e) {
      // If parsing fails, we'll gracefully fallback to raw query text
    }
  }

  return (
    <div className="relative min-w-[340px] max-w-[500px] rounded-xl overflow-hidden group shadow-2xl shadow-black/80 ring-1 ring-white/10 bg-[#09090b]">
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accentYellow/50 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Sleek Header */}
        <div className="px-4 py-3 bg-[#18181b]/50 border-b border-white/5 flex items-center gap-3">
          <div className="p-1.5 bg-accentYellow/10 rounded-md">
            <Activity size={14} className="text-accentYellow" />
          </div>
          <span className="font-sans text-[12px] font-semibold text-white/90 tracking-wide">ACTIVE QUERY</span>
          {rowsAffected > 0 && (
            <span className="ml-auto text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-white/50 font-mono ring-1 ring-white/10">
              {rowsAffected} rows affected
            </span>
          )}
        </div>

        {/* Code Statement or AST */}
        {ast ? (
          <ASTViewer ast={ast} />
        ) : (
          <div className="p-4 bg-black/60 font-mono text-[12px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {queryText}
          </div>
        )}

        {/* Query Plan */}
        {queryPlan && (
          <div className="bg-[#09090b] px-4 py-3 border-t border-white/5">
            <div className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase mb-2">Execution Plan</div>
            <div className="font-mono text-[11px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {queryPlan}
            </div>
          </div>
        )}

        {/* Explanation */}
        {step.explanation && (
          <div className="px-4 py-2 bg-black/20 border-t border-white/5">
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{step.explanation[uiLanguage] || step.explanation.en}</p>
          </div>
        )}
      </div>

      {/* Sleek Output Port */}
      <Handle type="source" position={Position.Bottom} className="!bg-accentYellow !w-3 !h-1.5 !rounded-full !border-0 !bottom-[-3px]" />
    </div>
  );
}
