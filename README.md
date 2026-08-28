<div align="center">
  <br />
  <br />
  <a href="https://codetrace.dev">
    <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="CodeTrace" width="80" />
  </a>
  
  <br />
  <br />

  <h1>CodeTrace</h1>

  <p>
    <b>See your code think. Step by step.</b>
  </p>
  
  <p>
    A next-generation interactive execution engine that visualizes call stacks,<br/> 
    heap memory, and algorithm flows in real-time.
  </p>

  <br />

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://codetrace.dev"><img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" /></a>
    <a href="https://github.com/Satya522/CodeTrace/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" /></a>
  </p>

  <br />

  <p>
    <a href="https://codetrace.dev"><b>Live Demo</b></a> •
    <a href="#-architecture"><b>Architecture</b></a> •
    <a href="#-features"><b>Features</b></a> •
    <a href="#-the-52-section-library"><b>Library</b></a> •
    <a href="https://github.com/Satya522/CodeTrace/issues"><b>Issues</b></a>
  </p>

  <br />
  <br />
</div>

---

<br />

### ✦ The Philosophy

Most developers write code; the top 1% understand exactly how it executes. **CodeTrace** bridges that gap by turning abstract memory management into a high-fidelity visual experience. 

Instead of relying on `console.log()` or static debuggers, CodeTrace parses your source code into an **Abstract Syntax Tree (AST)**, hooks into the runtime, and streams the absolute state of the **Call Stack**, **Heap Memory**, and **Execution Pointers** directly to a 60FPS hardware-accelerated canvas. We don't just run your code—we render its underlying mechanics.

<br />

---

<br />

### ✦ Architecture

CodeTrace is built on a decoupled, high-performance architecture ensuring that heavy code compilation never blocks the main UI thread.

<dl>
  <dt><b>1. Deterministic Execution Engine</b></dt>
  <dd>By compiling execution traces into JSON delta payloads, we ensure that every memory mutation, variable assignment, and pointer shift is strictly deterministic. You can scrub through your code's execution timeline just like a video—forwards, backwards, or frame-by-frame.</dd>

  <br />

  <dt><b>2. High-Fidelity Render Pipeline</b></dt>
  <dd>The UI dynamically maps AST nodes to spatial SVG curves and DOM elements. As the call stack pushes and pops, the React-based engine animates state transitions seamlessly, providing a cinematic view of execution.</dd>

  <br />

  <dt><b>3. Integrated AI Cognition (Gemini API)</b></dt>
  <dd>CodeTrace doesn't just show you <i>what</i> is happening; it explains <i>why</i>. Powered by Google Gemini, the engine contextually analyzes the active execution pointer to generate real-time logic breakdowns.</dd>
</dl>

<br />

---

<br />

### ✦ Features

<br />

<img align="right" width="100" src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/WASM-Dark.svg" />

#### Time Travel Debugging
Control the flow of time. Pause, rewind, fast-forward, or step through your code frame-by-frame. CodeTrace maintains a pure state history of every memory mutation, meaning you never miss a variable update or a recursive callback.

<br />
<br />

<img align="left" width="100" src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" />
&nbsp;

#### Deep Memory Inspection
Watch as the **Call Stack** manages lexical environments. See the **Heap** allocate objects, draw reference pointers, and visualize circular dependencies. Complex data structures like Trees and Graphs are algorithmically mapped using force-directed graph physics.

<br clear="left" />
<br />
<br />

<img align="right" width="100" src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Python-Dark.svg" />

#### Multi-Language Core
CodeTrace normalizes execution across runtimes. Seamlessly switch between **Python, JavaScript, TypeScript, Java, C++, and SQL**. The universal engine ensures the visualization experience remains consistent regardless of the underlying language semantics.

<br />
<br />

<img align="left" width="100" src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vite-Dark.svg" />
&nbsp;

#### Algorithm Race Mode
Curious why QuickSort beats BubbleSort? Put them side-by-side. Race Mode allows two isolated execution environments to run concurrently, rendering their array mutations and operations count in a real-time visual competition.

<br clear="left" />
<br />

---

<br />

### ✦ The 52-Section Library

CodeTrace ships with a massive, meticulously curated, 52-section interactive library. This isn't just text—every algorithm comes with live code that you can trace and modify instantly.

<dl>
  <dt><b>🟢 Data Structures & Algorithms (20 Sections)</b></dt>
  <dd>
    <ul>
      <li><b>Linear:</b> Arrays, Linked Lists (Singly, Doubly, Circular), Stacks, Queues, Hash Tables.</li>
      <li><b>Trees & Graphs:</b> Binary Trees, BSTs, AVL, Tries, MSTs (Kruskal/Prim), Shortest Path (Dijkstra).</li>
      <li><b>Paradigms:</b> Two Pointers, Sliding Window, Greedy, Dynamic Programming, Backtracking.</li>
    </ul>
  </dd>

  <br />

  <dt><b>🔵 Database Architecture (15 Sections)</b></dt>
  <dd>
    <ul>
      <li><b>PostgreSQL:</b> ACID, Joins, Window Functions, CTEs, Indexing (B-Tree, GIN), EXPLAIN plans.</li>
      <li><b>MongoDB:</b> Aggregation Pipelines, BSON, Replica Sets, Sharding.</li>
      <li><b>Redis:</b> In-Memory Caching, Pub/Sub, Eviction Policies (LRU/LFU).</li>
    </ul>
  </dd>

  <br />

  <dt><b>🟡 Language Internals (17 Sections)</b></dt>
  <dd>
    <ul>
      <li><b>JavaScript/TS:</b> Event Loop, Microtasks, Closures, V8 Engine Basics, Generics.</li>
      <li><b>Python:</b> Global Interpreter Lock (GIL), Generators, Decorators, Dunder Methods.</li>
      <li><b>C++/Java:</b> Pointers, Memory Leaks, RAII, JVM Architecture, Garbage Collection.</li>
    </ul>
  </dd>
</dl>

<br />

---

<br />

### ✦ Quick Start

Experience CodeTrace on your own machine. The local environment is optimized with Turbopack for sub-second HMR.

```bash
# 1. Clone the repository securely
git clone https://github.com/Satya522/CodeTrace.git
cd CodeTrace

# 2. Install all necessary dependencies
npm install

# 3. Bootstrap your environment variables
cp .env.example .env

# 4. Launch the Turbopack engine
npm run dev
```

> **Note:** Requires `Node.js 18.17+`. Visit `http://localhost:3000` to access the workspace.

<br />

---

<br />

### ✦ Tech Stack

- **Framework:** Next.js 14 App Router, React 18
- **Styling:** TailwindCSS 3.4, Framer Motion 13, Glassmorphism design system
- **Editor:** Monaco Editor (VS Code Engine)
- **Visuals:** HTML5 Canvas, React Flow, Custom SVG algorithms
- **Backend/API:** Next.js Serverless Functions, Google Gemini API SDK
- **Database:** Prisma ORM, SQLite

<br />

---

<br />

<div align="center">
  <p><b>Crafted with Precision by Satya</b></p>
  
  <a href="https://github.com/Satya522">
    <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>
  
  <br /><br />
  
  <p><i>CodeTrace is open-source software licensed under the MIT License.</i></p>
</div>
