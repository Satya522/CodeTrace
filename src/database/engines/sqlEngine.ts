import { DatabaseTrace } from "@/frontend/types";

let sqlWorker: Worker | null = null;

export function executeSql(code: string): Promise<DatabaseTrace> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot run SQL on server"));
      return;
    }

    if (!sqlWorker) {
      sqlWorker = new Worker(new URL("../workers/sql.worker.ts", import.meta.url), {
        type: "module",
      });
    }

    const requestId = Math.random().toString(36).substring(7);

    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (data.requestId === requestId) {
        sqlWorker?.removeEventListener("message", onMessage);
        
        if (data.ok) {
          resolve({
            engine: "sqlite",
            steps: data.steps.map((s: any, i: number) => ({
              step: i + 1,
              sql: s.statement,
              explanation: {
                en: `Executed SQL statement.`,
                hi: `SQL स्टेटमेंट चलाया गया।`
              },
              affectedTables: Object.keys(s.schema).map(tableName => ({
                name: tableName,
                columns: [], // We could extract columns from schema or first row
                rows: s.tables[tableName] || [],
                indexes: s.indexes ? s.indexes[tableName] || [] : [],
                foreignKeys: s.foreignKeys ? s.foreignKeys[tableName] || [] : []
              })),
              queryPlan: s.queryPlan || "No query plan available.",
              rowsAffected: 0, // mock
              mode: "live"
            }))
          });
        } else {
          reject(new Error(data.error));
        }
      }
    };

    sqlWorker.addEventListener("message", onMessage);
    sqlWorker.postMessage({ code, requestId });
  });
}
