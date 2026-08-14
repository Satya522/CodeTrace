# CodeTrace — Master Build Prompt (v3)
### The Ultimate Memory, Execution & Database Visualizer (100% Free, Forever, No Login)

> Paste this entire document into Kimi (or any code-gen LLM) as a single prompt.
> It is structured in build phases so you can also feed it in chunks if the model has a small context/output window.

---

## 0. NORTH STAR

Build **CodeTrace**: a free, open-source, no-login web app where a user pastes code (Python, JavaScript, Java, C, C++, Go, ...) **or SQL**, and the app shows a live, animated diagram of:

- The **Call Stack** (frames, variables, scope) — including a dedicated **Recursion / Call Tree** view
- The **Heap** (objects, references, garbage collection) with **data-structure-aware rendering** (lists, trees, graphs, matrices) and **animated pointer arrows**
- **Database state** (tables, rows, indexes, query plans) when SQL is involved
- Step-by-step **explanations** in plain English **and Hindi** (toggleable)
- Live **complexity counters** (comparisons, swaps, recursive calls) so Big-O is felt, not just read
- A **Predict Mode** for active-recall learning

Two honesty tiers must be visually distinct in the UI at all times:

| Badge | Meaning | How it's produced |
|---|---|---|
| 🟢 **Live Trace** | Real execution, real memory state | Actual interpreter instrumentation (see §2) |
| 🟡 **AI-Simulated** | Plausible, educational approximation | LLM/heuristic-generated JSON (fallback only) |

Never silently pass off a simulated trace as a live one — this is a trust-critical UX rule.

---

## 1. TECH STACK

- **Framework:** Next.js 14+ (App Router), TypeScript strict mode, no `any`
- **Styling:** Tailwind CSS, dark glassmorphism UI (Vercel-style)
- **Editor:** `@monaco-editor/react`
- **Icons:** `lucide-react`
- **Real Python execution:** `pyodide` (CPython → WebAssembly), run inside a Web Worker
- **Real JS/TS execution:** `acorn` (AST parser) + a custom tree-walking step interpreter (or fork `JS-Interpreter` by Neil Fraser)
- **Real compiled-language execution (Java/C/C++/Go/Rust/...):** [Piston API](https://github.com/engineer-man/piston) — free public instance at `emkc.org/piston`, no API key, self-hostable via Docker for unlimited free use later
- **Real SQL execution:** `sql.js` (SQLite compiled to WebAssembly), runs fully client-side
- **Tree/Graph rendering:** `d3.js` (or a hand-rolled SVG force/tree layout) for BST/Graph/LinkedList diagrams
- **Pointer arrows:** `react-xarrows` or a custom SVG overlay that draws lines between DOM anchors
- **State:** React hooks (`useState`, `useReducer`, `useEffect`) — no external state library needed
- **Persistence (optional, still free):** URL-encoded state (base64 + LZ-string compression) for shareable/embeddable links — no database, no backend, no login, no cost
- **Offline caching:** Service Worker (`next-pwa` or hand-rolled) to cache the Pyodide/sql.js WASM binaries after first load

**Why this stack stays free forever:** every heavy computation (Python, JS, SQL execution) runs **inside the visitor's browser via WebAssembly**. Your server (Vercel Hobby tier) only ever serves static files. The only network call is the optional Piston request for compiled languages, and that's free/self-hostable too.

---

## 2. EXECUTION ENGINE STRATEGY (the core of the app — build this first)

### Tier 1 — Live Trace, fully client-side (build these two first, they're your MVP)

**Python (`lib/engines/pythonEngine.ts`):**
- Load Pyodide in a dedicated Web Worker (`workers/pyodide.worker.ts`) so the main thread never freezes.
- Inject a Python-side tracer using `sys.settrace(trace_func)` that fires on every line (`'line'` event).
- On each trace event, serialize: current line number, all local variables in every active frame (`frame.f_locals`), and walk referenced objects (lists/dicts/objects) to build heap entries with orphan detection (reference counting via `sys.getrefcount`).
- Also increment counters for comparisons (`==`, `<`, `>` operator hits), swaps, and recursive calls (function re-entry on the same name) — attach to each step for the complexity counter (§4).
- Post each step back to the main thread as an `ExecutionStep` (see §3) via `postMessage`.

**JavaScript / TypeScript (`lib/engines/jsEngine.ts`):**
- Parse user code with `acorn` into an AST.
- Walk the AST node-by-node in a custom interpreter (not `eval`/`Function` — you need pause/step control).
- On every statement boundary, snapshot the current scope chain → stack frames, and every live object/array/closure → heap entries.
- Track the same comparison/swap/recursive-call counters as the Python engine.
- This also runs in a Web Worker with a hard step-count limit (e.g. 50,000 steps) to prevent infinite-loop hangs from freezing the tab.

### Tier 2 — Live *output*, Simulated *memory diagram* (Java, C, C++, Go, Rust, ...)

- Send code to Piston API (`POST https://emkc.org/api/v2/piston/execute`) → get real stdout/stderr/exit code. Badge this part 🟢 **Live Output**.
- Since Piston doesn't expose internal memory state, generate the stack/heap diagram via a lightweight static-AST heuristic walk (best effort) — badge this part 🟡 **AI-Simulated Memory**.
- Clearly separate these two panels in the UI so users never confuse real output with simulated internals.

### Tier 3 — Full fallback (any language, or if Tiers 1/2 fail)

- Keep your original mock/LLM-generated `/api/simulate` route as a graceful fallback.
- Prompt the LLM to return **both** an English and Hindi `explanation` string per step (see §3 `BilingualText`), since simulated steps are free to generate in both languages.
- Always badge its output 🟡 **AI-Simulated** — never omit the badge.

*(Reference for inspiration, not copying: [pythontutor.com](https://pythontutor.com) / its open-source repo `pgbovine/OnlinePythonTutor` solved this exact problem for Python/Java/C/C++/JS — study its trace-JSON shape for ideas.)*

### Database Engine (`lib/engines/sqlEngine.ts`)

- Load `sql.js` client-side, run user SQL against an in-memory SQLite DB seeded with sample tables (or user-provided schema).
- Before/after each statement, snapshot every table's rows/columns/indexes.
- Run `EXPLAIN QUERY PLAN <stmt>` for the real query plan (index usage, scan type) — this is genuinely live, badge 🟢.
- Animate row insert/update/delete and index hits in the DB panel.

---

## 3. GLOBAL TYPES (`types/index.ts`)

```typescript
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
  address?: string; // heap pointer, if isReference
}

export interface StackFrame {
  id: string;
  name: string;
  variables: Variable[];
  returnAddress?: string;
  isRecursiveCall?: boolean;
  parentCallId?: string; // for building the recursion/call tree
}

// Hints so the renderer picks a specialized diagram instead of a generic box
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
  // optional structured payload for specialized renderers, e.g.
  // { next: "0x02" } for linkedList nodes, { left, right } for tree nodes,
  // { edges: [...] } for graphs, { rows, cols, values } for matrices
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
  explanation: BilingualText;
  stack: StackFrame[];
  heap: HeapObject[];
  systemLog: string;
  consoleOutput?: string;
  counters: ComplexityCounters;
}

export interface ExecutionTrace {
  language: string;
  mode: ExecutionMode;
  steps: ExecutionStep[];
}

// --- Predict Mode ---
export interface PredictChallenge {
  atStep: number;
  question: BilingualText;
  // what the UI should compare the user's guess against, e.g. a heap/stack snapshot
  expectedAnswer: string;
}

// --- Database visualization ---
export interface TableRow {
  [column: string]: string | number | null;
}

export interface TableState {
  name: string;
  columns: string[];
  rows: TableRow[];
  indexes: string[];
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
  engine: "sqlite";
  steps: QueryStep[];
}
```

---

## 4. COMPONENTS & FILES TO GENERATE

1. **`app/page.tsx`** — Responsive grid layout: header (project name + "100% Free & Open Source" + GitHub star badge + language toggle EN/HI), left = `EditorPanel`, right = tabbed `MemoryBoard` / `CallTreeView` / `DatabaseBoard`, bottom = playback control bar + `ComplexityCounterBar`.
2. **`components/LanguageSelector.tsx`** — Dropdown showing each language with its tier badge (🟢 Live / 🟡 Simulated) next to it, set honestly per §2.
3. **`components/EditorPanel.tsx`** — Monaco editor, dark theme override (`#0a0a0a`), highlights current line via `createDecorationsCollection`, auto-scrolls via `revealLineInCenter`.
4. **`components/MemoryBoard.tsx`** — Glassmorphic Call Stack + Heap panels, orphaned heap objects get red dashed border + "GC Ready" badge + dimmed opacity, smooth `transition-all duration-300` animations. Delegates each heap card to `DataStructureRenderer` based on `structureKind`.
5. **`components/DataStructureRenderer.tsx`** — Router component that renders a specialized diagram per `structureKind`:
   - `linkedList` → connected boxes with directional arrows to `next`/`prev`
   - `binaryTree` → real node/edge tree layout (D3 hierarchy or hand-rolled recursive SVG positioning), current node highlighted
   - `graph` → force-directed node/edge layout (D3 force simulation), visited nodes highlighted differently
   - `matrix` → 2D grid view with row/col indices, current cell being read/written highlighted (great for DP/sorting)
   - `stack` / `queue` → vertical/horizontal stacked visual with push/pop or enqueue/dequeue animation
   - `hashMap` → bucket-style layout showing key→value with collision chaining if relevant
   - `generic` / `primitive` → fallback to the original simple card
6. **`components/PointerArrows.tsx`** — SVG overlay (via `react-xarrows` or custom absolute-positioned `<svg><path>` bezier curves) drawing an animated arrow from every stack `Variable` with `isReference: true` to its target heap `address`. Recompute anchor positions on every step transition.
7. **`components/CallTreeView.tsx`** — Separate tab showing recursive calls as an actual collapsible tree (using `StackFrame.parentCallId`), not a flat stack — current active call pulses/highlighted, resolved branches show their return value, essential for backtracking/DFS/DP problems.
8. **`components/DatabaseBoard.tsx`** — Table cards showing live rows, animated row diff (green flash = inserted, red flash = deleted, yellow = updated), index badges, and a query-plan readout panel.
9. **`components/ExecutionBadge.tsx`** — Small reusable pill showing 🟢 Live Trace / 🟡 AI-Simulated, used everywhere trace data is displayed.
10. **`components/ComplexityCounterBar.tsx`** — Live ticking counters ("23 comparisons · 4 swaps · 7 recursive calls so far") pinned near the control bar, updates every step.
11. **`components/PredictMode.tsx`** — Optional toggle: every N steps, auto-pause and show a `PredictChallenge` question ("What will the heap look like after this line?"), user picks/types an answer, then reveals the real next step with a ✅/❌ indicator. Purely client-side logic, uses steps already computed.
12. **`components/CommandPalette.tsx`** — `Cmd/Ctrl+K` palette (build with plain React + a fuzzy-match filter, no paid library needed) listing all actions: load example, switch language, toggle Hindi, toggle Predict Mode, export, share link. Also wire global keyboard shortcuts: `Space` = play/pause, `→`/`←` = step forward/back, `R` = reset.
13. **`hooks/useVisualizerEngine.ts`** — Playback state machine: `play()`, `pause()`, `next()`, `prev()`, `setSpeed(ms)`, `reset()`, robust interval cleanup.
14. **`workers/pyodide.worker.ts`**, **`workers/jsInterpreter.worker.ts`** — Off-main-thread execution per §2.
15. **`app/api/execute-piston/route.ts`** — Thin proxy to Piston API (keeps their rate-limit key server-side if self-hosting later).
16. **`app/api/simulate/route.ts`** — Tier 3 fallback JSON generator (your original mock engine), always tagged `mode: "simulated"`, returns `BilingualText` for every explanation.
17. **`app/embed/[id]/page.tsx`** — Minimal, chrome-less version of the visualizer (no header/footer) that reads a compressed trace/code from the URL, meant to be dropped into an `<iframe>` on blogs/YouTube descriptions/teacher slides. Include a small "Powered by CodeTrace ↗" watermark linking back.
18. **`lib/examples/`** — Pre-loaded example programs: bubble sort, linked list reversal, BST insert, DFS/backtracking recursion demo, JOIN query demo, index-vs-no-index query demo — one-click "Load Example" dropdown.
19. **`public/sw.js`** + PWA manifest — Service Worker caching the Pyodide/sql.js WASM binaries and static assets after first visit, so repeat visits load instantly and Python/SQL mode keeps working fully offline.

---

## 5. FEATURE SUMMARY CHECKLIST (all confirmed for this build)

- [x] Data-structure-aware heap rendering (linked list / tree / graph / matrix / stack / queue / hashmap)
- [x] Animated SVG pointer arrows from stack variables to heap objects
- [x] Recursion / Call Tree view, separate from the flat call stack
- [x] Bilingual (English + Hindi) step explanations, toggleable
- [x] Live complexity counters (comparisons, swaps, recursive calls, array accesses)
- [x] Predict Mode (active-recall quiz during playback)
- [x] Embeddable `<iframe>` mode with shareable/compressed URL state
- [x] Service-Worker-cached WASM binaries for instant repeat loads + offline Python/SQL
- [x] Command palette (`Cmd/Ctrl+K`) + full keyboard shortcuts

Other nice-to-haves if time allows: Compare Mode (two snippets side by side), Export as GIF/MP4, Light/Dark theme toggle.

---

## 6. FREE, LONG-TERM ARCHITECTURE CHECKLIST

- [ ] No mandatory login/auth, no paid database — all state is client-side or URL-encoded.
- [ ] All heavy compute (Python/JS/SQL execution) runs in the browser via WASM → $0 server compute.
- [ ] Host on Vercel Hobby (free) or GitHub Pages (static export) — both fine for this architecture.
- [ ] Piston usage stays within its free public rate limit; document how to self-host it via Docker if you outgrow that.
- [ ] Service Worker caches WASM assets → low repeat-visit bandwidth, works offline.
- [ ] Open-source the repo (MIT license) on GitHub — sustainability via community PRs + a "Star/Sponsor" badge instead of monetization.
- [ ] Every trace object carries `mode: "live" | "simulated"` — never let the UI hide which one is showing.

---

## 7. EXECUTION ORDER FOR THE AI BUILDING THIS

1. Types (§3) → 2. `useVisualizerEngine` hook → 3. `EditorPanel` → 4. Pyodide worker + Python engine (first real Tier-1 language, include counters) → 5. `MemoryBoard` + `DataStructureRenderer` + `PointerArrows` wired to real Python traces → 6. JS engine (second Tier-1 language) → 7. `CallTreeView` (recursion) → 8. `page.tsx` layout + control bar + `ComplexityCounterBar` → 9. Piston proxy + Tier-2 languages → 10. sql.js + `DatabaseBoard` → 11. Tier-3 `/api/simulate` fallback with bilingual output → 12. `PredictMode` + `CommandPalette` → 13. `embed/[id]` route + Service Worker/PWA → 14. Example library + final polish/animations.

**Output the complete, production-ready code for every file above, no placeholders, no "implement later" comments. Start with Phase 1 (Types + Hook + Python Engine + EditorPanel + MemoryBoard + DataStructureRenderer) and confirm before continuing to later phases if your output length is limited.**
