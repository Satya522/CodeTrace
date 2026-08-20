import initSqlJs, { Database } from "sql.js";

let db: Database | null = null;
let sqlPromise: Promise<any> | null = null;

export interface SqlSnapshot {
  tables: Record<string, any[]>;
  schema: Record<string, string>;
  indexes: Record<string, string[]>;
  foreignKeys: Record<string, { column: string; referencesTable: string; referencesColumn: string; }[]>;
  queryPlan?: string;
  statement: string;
}

// Initialize sql.js
async function initDb() {
  if (sqlPromise) return sqlPromise;
  
  // Load sql-wasm.wasm from CDN to avoid Next.js dev server routing issues returning HTML
  sqlPromise = initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.1/${file}`
  });
  
  const SQL = await sqlPromise;
  db = new SQL.Database();
  return db;
}

self.onmessage = async (e: MessageEvent) => {
  const { code, requestId } = e.data;

  try {
    await initDb();
    if (!db) throw new Error("Database not initialized");

    const steps: SqlSnapshot[] = [];

    // Split code into statements (naive split for demo purposes)
    // A robust parser would use an AST, but for basic SQL this is sufficient
    const statements = code.split(';').map((s: string) => s.trim()).filter(Boolean);

    for (const stmt of statements) {
      if (!stmt) continue;

      // 1. Execute the statement
      db.run(stmt);

      // 2. Extract Query Plan if applicable (SELECT, UPDATE, DELETE, etc.)
      let queryPlan = undefined;
      const lowerStmt = stmt.toLowerCase();
      if (lowerStmt.startsWith('select') || lowerStmt.startsWith('update') || lowerStmt.startsWith('delete') || lowerStmt.startsWith('insert')) {
        try {
          const planResult = db.exec(`EXPLAIN QUERY PLAN ${stmt}`);
          if (planResult.length > 0 && planResult[0].values) {
            queryPlan = planResult[0].values.map(row => row[row.length - 1]).join("\n");
          }
        } catch (e) {
          // ignore explain plan errors for unsupported statements
        }
      }

      // 3. Snapshot all tables and indexes
      const tables: Record<string, any[]> = {};
      const schema: Record<string, string> = {};
      const indexes: Record<string, string[]> = {};
      const foreignKeys: Record<string, { column: string; referencesTable: string; referencesColumn: string; }[]> = {};
      
      const masterResult = db.exec("SELECT name, sql, type, tbl_name FROM sqlite_master WHERE type IN ('table', 'index')");
      
      if (masterResult.length > 0) {
        for (const row of masterResult[0].values) {
          const name = row[0] as string;
          const sql = row[1] as string;
          const type = row[2] as string;
          const tbl_name = row[3] as string;
          
          if (type === 'table') {
            schema[name] = sql;
            indexes[name] = []; // initialize
            foreignKeys[name] = []; // initialize

            // Fetch foreign keys
            try {
              const fkResult = db.exec(`PRAGMA foreign_key_list("${name}")`);
              if (fkResult.length > 0) {
                // columns: id, seq, table, from, to, on_update, on_delete, match
                for (const fkRow of fkResult[0].values) {
                  foreignKeys[name].push({
                    column: fkRow[3] as string,
                    referencesTable: fkRow[2] as string,
                    referencesColumn: fkRow[4] as string
                  });
                }
              }
            } catch (e) {
              // ignore fk errors
            }
            
            // Fetch all rows for the table
            try {
              const dataResult = db.exec(`SELECT * FROM ${name}`);
              if (dataResult.length > 0) {
                const columns = dataResult[0].columns;
                const rows = dataResult[0].values.map(valArray => {
                  const rowObj: any = {};
                  columns.forEach((col, i) => {
                    rowObj[col] = valArray[i];
                  });
                  return rowObj;
                });
                tables[name] = rows;
              } else {
                tables[name] = [];
              }
            } catch (e) {
              tables[name] = [];
            }
          } else if (type === 'index' && sql) {
            if (!indexes[tbl_name]) indexes[tbl_name] = [];
            indexes[tbl_name].push(sql);
          }
        }
      }

      steps.push({
        statement: stmt,
        tables,
        schema,
        indexes,
        foreignKeys,
        queryPlan
      });
    }

    self.postMessage({
      requestId,
      ok: true,
      steps,
      error: null
    });
  } catch (err: any) {
    self.postMessage({
      requestId,
      ok: false,
      steps: [],
      error: err.message ?? "SQL Execution Error"
    });
  }
};
