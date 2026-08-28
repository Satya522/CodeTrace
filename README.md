<div align="center">
  <br/>
  
  <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=800&size=60&duration=1&pause=99999&color=FFFFFF&center=true&vCenter=true&width=500&height=80&lines=CodeTrace" alt="CodeTrace" />
  
  <p><b>See your code think. Step by step.</b></p>
  
  <p>
    A next-generation interactive execution engine that visualizes call stacks, heap memory, and algorithm flows in real-time — bridging the gap between abstract code and physical execution.
  </p>
  
  <br/>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-050505?style=for-the-badge&logo=nextdotjs&logoColor=00E676" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-050505?style=for-the-badge&logo=typescript&logoColor=00E676" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-050505?style=for-the-badge&logo=tailwind-css&logoColor=00E676" alt="Tailwind CSS" /></a>
    <a href="https://codetrace.dev"><img src="https://img.shields.io/badge/Vercel-050505?style=for-the-badge&logo=vercel&logoColor=00E676" alt="Vercel" /></a>
  </p>
  
  <p>
    <a href="https://codetrace.dev"><img src="https://img.shields.io/badge/%F0%9F%A2%A2%20Live%20Demo-00E676?style=for-the-badge&logoColor=white" alt="Live Demo" /></a>
    <a href="#-features"><img src="https://img.shields.io/badge/%E2%9C%A8%20Features-050505?style=for-the-badge" alt="Features" /></a>
    <a href="#-architecture"><img src="https://img.shields.io/badge/%E2%9A%99%EF%B8%8F%20Architecture-050505?style=for-the-badge" alt="Architecture" /></a>
    <a href="#-the-52-section-premium-library"><img src="https://img.shields.io/badge/%F0%9F%93%9A%20The%20Library-050505?style=for-the-badge" alt="The Library" /></a>
    <a href="#-quick-start"><img src="https://img.shields.io/badge/%F0%9F%9A%80%20Quick%20Start-050505?style=for-the-badge" alt="Quick Start" /></a>
    <a href="#-contributing"><img src="https://img.shields.io/badge/%F0%9F%A4%9D%20Contributing-050505?style=for-the-badge" alt="Contributing" /></a>
  </p>
</div>

<br/>
<br/>

### ✦ The Philosophy

Most developers write code. The top one percent understand exactly how it executes.

CodeTrace exists to close that gap. Instead of relying on scattered `console.log()` calls or a static debugger, CodeTrace parses your source into an Abstract Syntax Tree, hooks into a deterministic sandbox runtime, and streams the live state of the Call Stack, the Heap, and the Execution Pointer into a cinematic, glassmorphic canvas.

We don't just run your code. We render its mechanics.

Every mutation — a variable reassignment, a pushed stack frame, a newly allocated object on the heap — becomes a visible, scrubbable event on a timeline you fully control.

<br/>
<br/>

### ✦ Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h4>🕰️ Time Travel Debugging</h4>
      <p>Scrub through execution like a video. Pause, rewind, fast-forward, or step frame-by-frame through a pure, immutable history of every memory mutation your program makes.</p>
    </td>
    <td width="50%" valign="top">
      <h4>🧠 Deep Memory Inspection</h4>
      <p>Watch the Call Stack manage lexical environments in real time while the Heap allocates objects, draws reference pointers, and maps circular dependencies as force-directed graphs.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>🌐 Multi-Language Core</h4>
      <p>One unified execution tracer across Python, JavaScript, TypeScript, Java, C++, and SQL — consistent visualization semantics no matter which runtime is underneath.</p>
    </td>
    <td width="50%" valign="top">
      <h4>🏁 Algorithm Race Mode</h4>
      <p>Pit two algorithms head-to-head — QuickSort vs. BubbleSort — and watch array mutations, comparisons, and operation counts race side-by-side in real time.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>✨ AI Cognition Layer</h4>
      <p>The active execution pointer streams to the Gemini API, which returns contextual, human-readable explanations of exactly why your code is behaving the way it is.</p>
    </td>
    <td width="50%" valign="top">
      <h4>🖥️ Responsive Workspace</h4>
      <p>Toggle instantly between Laptop Mode (horizontal split) and Tablet Mode (vertical split) — the workspace reflows without losing execution state.</p>
    </td>
  </tr>
</table>

<br/>
<br/>

### ✦ Architecture

CodeTrace runs on a decoupled, high-performance pipeline so that heavy trace compilation never blocks the UI thread.

1. **Deterministic Execution Engine** — every mutation, assignment, and pointer shift compiles down to a strict, ordered JSON delta payload. This is what makes the execution timeline scrubbable in any direction, forwards or backwards, with zero drift.
2. **High-Fidelity Render Pipeline** — AST nodes map spatially onto Canvas and React Flow surfaces. As the call stack pushes and pops, state transitions animate seamlessly via Framer Motion.
3. **Integrated AI Cognition (Gemini)** — the engine doesn't only show what happened. It sends the active trace context to Gemini and streams back why it happened, in plain language.

**Directory Structure**

```text
CodeTrace/
├── app/                    # Next.js 14 App Router — pages, layouts, API routes
│   ├── algorithms/         # /algorithms route — the 52-section library UI
│   ├── api/                # Serverless route handlers (trace, AI, auth)
│   └── (workspace)/        # Main IDE-like execution workspace
├── src/
│   ├── frontend/
│   │   └── components/     # MemoryBoard, AlgorithmVisualizer, Monaco integration
│   ├── backend/            # Trace compilers + Gemini AI communication handlers
│   └── content/            # The 52-section algorithms.md knowledge base
├── prisma/                 # Database schema definitions (user + session data)
├── public/                 # Static assets
│
├── tracer_v2.py            # Standalone Python execution tracer (AST walker prototype)
├── fix_code_blocks.py      # Content pipeline utility for the 52-section library
├── test_api.py             # API route test harness
├── test_recursion.py       # Tracer test cases for recursive call stacks
│
├── AGENT_PROGRESS.md       # Internal build log — AI-agent development progress
├── CodeTrace-MegaPrompt.md # Master specification prompt for the project
├── CONTRIBUTING.md         # Contribution guidelines
├── .env.example            # Environment variable template
└── README.md
```

> `tracer_v2.py`, `fix_code_blocks.py`, and the `test_*.py` scripts are part of the Python-side tracing prototype and content tooling — they sit alongside the Next.js app rather than inside it, since they're used for tracer R&D and library maintenance rather than the runtime itself.

<br/>
<br/>

### ✦ The 52-Section Premium Library

CodeTrace ships with a massive, interactive computer-science encyclopedia built directly into the platform — every entry paired with live, traceable code, not static text.

<details>
<summary><strong>🟢 Data Structures & Algorithms — 20 Sections</strong></summary>
<br/>
<ul>
  <li><b>Linear structures:</b> Arrays, Linked Lists (Singly, Doubly, Circular), Stacks, Queues, Hash Tables</li>
  <li><b>Trees & Graphs:</b> Binary Trees, BSTs, AVL Trees, Tries, MSTs (Kruskal / Prim), Shortest Path (Dijkstra)</li>
  <li><b>Paradigms:</b> Two Pointers, Sliding Window, Greedy, Dynamic Programming, Backtracking</li>
</ul>
</details>

<details>
<summary><strong>🔵 Database Engineering — 15 Sections</strong></summary>
<br/>
<ul>
  <li><b>PostgreSQL:</b> ACID, Joins, Window Functions, CTEs, Indexing (B-Tree, GIN), EXPLAIN plans</li>
  <li><b>MongoDB:</b> Aggregation Pipelines, BSON, Replica Sets, Sharding</li>
  <li><b>Redis:</b> In-memory caching, Pub/Sub, Eviction Policies (LRU / LFU)</li>
</ul>
</details>

<details>
<summary><strong>🟡 Language Internals — 17 Sections</strong></summary>
<br/>
<ul>
  <li><b>JavaScript / TypeScript:</b> Event Loop, Microtasks, Closures, V8 fundamentals, Generics</li>
  <li><b>Python:</b> Global Interpreter Lock (GIL), Generators, Decorators, Dunder methods</li>
  <li><b>C++ / Java:</b> Pointers, Memory Leaks, RAII, JVM Architecture, Garbage Collection</li>
</ul>
</details>

<br/>
<br/>

### ✦ Quick Start

Requires Node.js 18.17+.

```bash
# 1. Clone the repository
git clone https://github.com/Satya522/CodeTrace.git
cd CodeTrace

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Launch the dev server
npm run dev
```

Once running, open `http://localhost:3000` to enter the workspace.

<br/>
<br/>

### ✦ Environment Variables

Populate `.env` with the following to unlock full functionality:

| Variable | Required For |
|----------|--------------|
| `GEMINI_API_KEY` | Powers the AI Cognition Layer's real-time logic breakdowns |
| `NEXTAUTH_SECRET` | Secures user session tokens |
| `DATABASE_URL` | Prisma connection string (SQLite locally, Postgres in production) |

<br/>
<br/>

### ✦ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router), React 18, TypeScript 5.4 |
| **UI & Animation** | Tailwind CSS 3.4, Framer Motion 13, Glassmorphism design system |
| **Code Editor** | Monaco Editor — the VS Code engine, in-browser |
| **AI Engine** | Google Gemini API |
| **Database** | Prisma ORM + SQLite |
| **Visualization** | Custom Canvas API, React Flow (force-directed memory maps) |
| **Execution Core** | Deterministic AST-tracing sandbox |

<br/>
<br/>

### ✦ Accessibility & UX

CodeTrace is built to be beautiful and usable by everyone.

- **Screen-reader support** — visually impaired developers can "hear" code execution step-by-step, not just see it.
- **Reduced-motion toggle** — complex algorithm animations respect `prefers-reduced-motion` and can be fully disabled.
- **Contrast-checked palette** — every glassmorphic surface in the dark UI is tuned to meet accessible contrast ratios.

<br/>
<br/>

### ✦ Roadmap

- [x] Phase 1 — Multi-language AST parsing & heap memory visualizer
- [x] Phase 2 — Gemini AI integration & the 52-section curriculum
- [ ] Phase 3 — Multiplayer Race Mode (real-time collaborative visualization)
- [ ] Phase 4 — Native VS Code extension
- [ ] Phase 5 — 3D WebGL visualizations for graphs and matrices

<br/>
<br/>

### ✦ Contributing

Contributions are what make the open-source community such an incredible place to learn and build. Any contribution is greatly appreciated.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes using [conventional commits](https://www.conventionalcommits.org/) (`git commit -m "feat: add some AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

> **Tip:** press <kbd>.</kbd> on this repository's GitHub page to open a full in-browser VS Code editor for quick exploration.

<br/>
<br/>

### ✦ License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

<br/>
<br/>

<div align="center">
  <p>Crafted with precision by <a href="https://github.com/Satya522">Satya</a></p>
  <br/>
  <p><i>CodeTrace is open-source software. If it helped you understand your code a little better, consider leaving a ⭐.</i></p>
</div>
