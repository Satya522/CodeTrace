import React, { useMemo } from "react";
import { QueryStep, NoSQLStep, TableState, NoSQLCollection } from "@/frontend/types";
import { Database, FolderTree, Activity } from "lucide-react";

interface Props {
  sqlStep?: QueryStep | null;
  nosqlStep?: NoSQLStep | null;
  prevSqlStep?: QueryStep | null;
  prevNosqlStep?: NoSQLStep | null;
}

export function DatabaseBoard({ sqlStep, nosqlStep, prevSqlStep, prevNosqlStep }: Props) {
  if (!sqlStep && !nosqlStep) {
    return (
      <div className="flex h-full flex-col p-3 text-sm text-white/40 items-center justify-center">
        No database active.
      </div>
    );
  }

  if (nosqlStep) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex-1 p-3 overflow-y-auto">
          <header className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80">
            <FolderTree size={16} /> NoSQL Collections
          </header>
          
          <div className="flex flex-col gap-6">
            {nosqlStep.collections.map((collection, cIdx) => {
              const prevCollection = prevNosqlStep?.collections.find(c => c.name === collection.name);
              const prevDocs = prevCollection ? prevCollection.documents : [];
              
              return (
                <div key={cIdx} className="flex flex-col gap-2">
                  <h3 className="text-xs font-mono text-accentGreen uppercase tracking-wider">{collection.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {collection.documents.map((doc, dIdx) => {
                      // Compute Diff Status
                      let status = "none";
                      const prevDoc = prevDocs.find(d => d._id === doc._id);
                      if (!prevDoc) status = "inserted";
                      else if (JSON.stringify(prevDoc) !== JSON.stringify(doc)) status = "updated";

                      return (
                        <div key={dIdx} className={`rounded-md p-2 text-xs font-mono text-white/80 relative overflow-hidden border transition-colors duration-500 ${
                          status === "inserted" ? "bg-accentGreen/20 border-accentGreen shadow-[0_0_10px_rgba(46,204,113,0.3)]" :
                          status === "updated" ? "bg-accentYellow/20 border-accentYellow shadow-[0_0_10px_rgba(241,196,15,0.3)]" :
                          "bg-black/30 border-white/10"
                        }`}>
                          <pre className="whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
                        </div>
                      );
                    })}
                    
                    {/* Render Deleted Documents */}
                    {prevDocs.filter(pd => !collection.documents.some(cd => cd._id === pd._id)).map((deletedDoc, dIdx) => (
                      <div key={`del-${dIdx}`} className="bg-accentRed/20 border border-accentRed shadow-[0_0_10px_rgba(231,76,60,0.3)] rounded-md p-2 text-xs font-mono text-white/50 relative overflow-hidden transition-colors duration-500 line-through">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(deletedDoc, null, 2)}</pre>
                      </div>
                    ))}

                    {collection.documents.length === 0 && prevDocs.length === 0 && (
                      <div className="text-xs text-white/30 italic">Empty collection</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (sqlStep) {
    return (
      <div className="flex h-full flex-col gap-4">
        {/* Tables View */}
        <div className="flex-[2] p-3 overflow-y-auto flex flex-col">
          <header className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80 shrink-0">
            <Database size={16} /> Relational Tables
          </header>
          
          <div className="flex flex-col gap-6 overflow-y-auto pr-2">
            {sqlStep.affectedTables.map((table, tIdx) => {
              const prevTable = prevSqlStep?.affectedTables.find(t => t.name === table.name);
              const prevRows = prevTable ? prevTable.rows : [];

              // Extract column names from first row if not provided
              const cols = table.columns.length > 0 
                ? table.columns 
                : (table.rows.length > 0 ? Object.keys(table.rows[0]) : []);

              return (
                <div key={tIdx} className="flex flex-col gap-2">
                  <h3 className="text-xs font-mono text-accentBlue uppercase tracking-wider">{table.name}</h3>
                  {table.rows.length > 0 ? (
                    <div className="rounded-md border border-white/10 overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono text-white/80 border-collapse">
                        <thead className="bg-black/40 text-white/50 border-b border-white/10">
                          <tr>
                            {cols.map(c => (
                              <th key={c} className="p-2 border-r border-white/10 last:border-0">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rIdx) => {
                            let status = "none";
                            // Naive diffing for SQL tables since no guaranteed primary key
                            const rowString = JSON.stringify(row);
                            const idCol = cols.find(c => c.toLowerCase() === 'id');
                            
                            if (idCol && row[idCol] !== undefined) {
                              // If there is an ID, diff by ID
                              const prevRow = prevRows.find(r => r[idCol] === row[idCol]);
                              if (!prevRow) status = "inserted";
                              else if (JSON.stringify(prevRow) !== rowString) status = "updated";
                            } else {
                              // If no ID, diff by row equality
                              if (!prevRows.some(r => JSON.stringify(r) === rowString)) {
                                status = "inserted";
                              }
                            }

                            return (
                              <tr key={rIdx} className={`border-b border-white/5 last:border-0 transition-colors duration-500 ${
                                status === "inserted" ? "bg-accentGreen/30 text-accentGreen" :
                                status === "updated" ? "bg-accentYellow/30 text-accentYellow" :
                                "bg-black/20 hover:bg-white/5"
                              }`}>
                                {cols.map(c => (
                                  <td key={c} className="p-2 border-r border-white/5 last:border-0">{row[c] !== null ? String(row[c]) : "NULL"}</td>
                                ))}
                              </tr>
                            );
                          })}
                          
                          {/* Render Deleted Rows */}
                          {prevRows.map((prevRow, prIdx) => {
                            const rowString = JSON.stringify(prevRow);
                            const idCol = cols.find(c => c.toLowerCase() === 'id');
                            let isDeleted = false;
                            
                            if (idCol && prevRow[idCol] !== undefined) {
                              isDeleted = !table.rows.some(r => r[idCol] === prevRow[idCol]);
                            } else {
                              isDeleted = !table.rows.some(r => JSON.stringify(r) === rowString);
                            }

                            if (isDeleted) {
                              return (
                                <tr key={`del-${prIdx}`} className="bg-accentRed/30 text-accentRed/60 border-b border-white/5 last:border-0 transition-colors duration-500 line-through">
                                  {cols.map(c => (
                                    <td key={c} className="p-2 border-r border-white/5 last:border-0">{prevRow[c] !== null ? String(prevRow[c]) : "NULL"}</td>
                                  ))}
                                </tr>
                              );
                            }
                            return null;
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-xs text-white/30 italic">Empty table</div>
                  )}

                  {table.indexes && table.indexes.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1">
                      <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wide">Indexes</div>
                      <div className="flex flex-wrap gap-2">
                        {table.indexes.map((idxSql, i) => (
                          <div key={i} className="rounded bg-accentBlue/10 border border-accentBlue/20 px-2 py-1 text-[10px] font-mono text-accentBlue/80">
                            {idxSql.replace(/CREATE\s+(UNIQUE\s+)?INDEX\s+/i, '').replace(/\s+ON\s+/, ' ON ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Explain Query Plan */}
        <div className="flex-1 p-3 overflow-y-auto">
          <header className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Activity size={16} /> Query Plan
          </header>
          <pre className="text-xs font-mono text-white/60 bg-black/30 p-2 rounded-md whitespace-pre-wrap">
            {sqlStep.queryPlan}
          </pre>
        </div>
      </div>
    );
  }

  return null;
}
