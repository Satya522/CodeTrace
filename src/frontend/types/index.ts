// Global types shared across the whole app.
// These mirror §3 of the CodeTrace master build spec.

export type ExecutionMode = "live" | "simulated";

export interface BilingualText {
  en: string;
  hi: string;
}

export interface Variable {
  name: string;
  type: string;
  value: string;
  isReference: boolean;
  address?: string; // heap pointer, present when isReference is true
}

export interface StackFrame {
  id: string;
  name: string;
  variables: Variable[];
  returnAddress?: string;
  returnValue?: string;
  isRecursiveCall?: boolean;
  parentCallId?: string; // used later for the recursion/call-tree view (Phase 2)
}

// Hints so the renderer can pick a specialized diagram instead of a generic box.
// Phase 1 fully renders: "generic" and "linkedList".
// "binaryTree" | "graph" | "hashMap" fall back to the generic card until Phase 2.
export type DataStructureKind =
  | "primitive"
  | "linkedList"
  | "binaryTree"
  | "graph"
  | "matrix"
  | "stack"
  | "queue"
  | "hashMap"
  | "generic";

export interface HeapObject {
  id: string;
  type: string;
  data: string;
  isOrphaned: boolean;
  address: string;
  referencedBy: string[];
  structureKind: DataStructureKind;
  structuredData?: Record<string, unknown>;
}

export interface ComplexityCounters {
  comparisons: number;
  swaps: number;
  recursiveCalls: number;
  arrayAccesses: number;
}

export interface ExecutionStep {
  step: number;
  line: number;
  explanation?: BilingualText;
  stack: StackFrame[];
  heap: HeapObject[];
  systemLog: string;
  consoleOutput?: string;
  counters: ComplexityCounters;
  queryData?: QueryStep;
  isAITrace?: boolean;
}

export interface ExecutionTrace {
  language: string;
  mode: ExecutionMode;
  steps: ExecutionStep[];
  error?: string;
}

export interface PredictChallenge {
  atStep: number;
  question: BilingualText;
  expectedAnswer: string;
}

// --- Database visualization types (wired up in a later phase) ---
export interface TableRow {
  [column: string]: string | number | null;
}

export interface TableState {
  name: string;
  columns: string[];
  rows: TableRow[];
  indexes: string[];
  foreignKeys?: {
    column: string;
    referencesTable: string;
    referencesColumn: string;
  }[];
}

export interface QueryStep {
  step: number;
  sql: string;
  explanation: BilingualText;
  affectedTables: TableState[];
  queryPlan: string;
  rowsAffected: number;
  mode: ExecutionMode;
}

export interface DatabaseTrace {
  engine: "sqlite" | "nosql";
  steps: QueryStep[] | NoSQLStep[];
  error?: string;
}

// --- NoSQL visualization types ---
export interface NoSQLCollection {
  name: string;
  documents: Record<string, any>[]; // JSON documents
}

export interface NoSQLStep {
  step: number;
  query: string;
  explanation: BilingualText;
  collections: NoSQLCollection[];
  mode: ExecutionMode;
}
