import { DatabaseTrace, NoSQLCollection, NoSQLStep } from "@/frontend/types";

class NoSQLDatabase {
  collections: Map<string, any[]> = new Map();

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
    }
    const col = this.collections.get(name)!;

    return {
      insertOne: (doc: any) => {
        if (!doc._id) doc._id = Math.random().toString(36).substr(2, 9);
        col.push(doc);
        return { insertedId: doc._id };
      },
      insertMany: (docs: any[]) => {
        docs.forEach(doc => {
          if (!doc._id) doc._id = Math.random().toString(36).substr(2, 9);
          col.push(doc);
        });
        return { insertedCount: docs.length };
      },
      updateOne: (filter: any, update: any) => {
        const doc = col.find(d => Object.keys(filter).every(k => d[k] === filter[k]));
        if (doc) {
          if (update.$set) {
            Object.assign(doc, update.$set);
          }
        }
      },
      deleteOne: (filter: any) => {
        const index = col.findIndex(d => Object.keys(filter).every(k => d[k] === filter[k]));
        if (index !== -1) {
          col.splice(index, 1);
        }
      },
      find: () => col
    };
  }
}

export function executeNoSql(code: string): DatabaseTrace {
  const db = new NoSQLDatabase();
  const steps: NoSQLStep[] = [];

  // Split code by lines or semicolons to execute step by step
  const statements = code.split(';').map(s => s.trim()).filter(Boolean);

  let stepCounter = 1;
  for (const stmt of statements) {
    try {
      // Create a sandbox execution function
      const func = new Function('db', `return ${stmt}`);
      func(db);

      // Snapshot collections
      const collectionsSnapshot: NoSQLCollection[] = [];
      for (const [name, docs] of db.collections.entries()) {
        // Deep clone docs
        collectionsSnapshot.push({
          name,
          documents: JSON.parse(JSON.stringify(docs))
        });
      }

      let verb = "Executed";
      if (stmt.includes('insertOne') || stmt.includes('insertMany')) verb = "Inserted document(s)";
      else if (stmt.includes('updateOne')) verb = "Updated document(s)";
      else if (stmt.includes('deleteOne')) verb = "Deleted document(s)";

      steps.push({
        step: stepCounter++,
        query: stmt,
        mode: "live",
        explanation: {
          en: `${verb} in NoSQL database.`,
          hi: `NoSQL डेटाबेस में ${verb === "Executed" ? "चलाया गया" : "बदलाव किया गया"}.`
        },
        collections: collectionsSnapshot
      });
    } catch (e: any) {
      // Ignore parse/execution errors for individual bad statements
    }
  }

  return {
    engine: "nosql",
    steps
  };
}
