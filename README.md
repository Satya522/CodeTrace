<div align="center">

<br/>
<br/>

<img src="https://skillicons.dev/icons?i=ts,react,nextjs,tailwind,prisma,vercel&theme=dark&perline=6" />

<br/>
<br/>

<h1 align="center">
  <b>CodeTrace</b>
</h1>

<p align="center">
  <a href="https://codetrace.dev">
    <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=500&size=22&duration=4000&pause=1000&color=00E676&center=true&vCenter=true&width=600&lines=See+your+code+think.;Step+by+step.;The+ultimate+algorithmic+playground." alt="Typing SVG" />
  </a>
</p>

<p align="center">
  A next-generation interactive execution visualizer, memory tracker, and AI-tutor.<br/>
  Built for developers who demand to see what happens under the hood.
</p>

<br/>

<div align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff&style=for-the-badge" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=fff&style=for-the-badge" alt="Tailwind CSS" /></a>
  <a href="https://github.com/Satya522/CodeTrace/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-00E676?style=for-the-badge" alt="License" /></a>
</div>

<br/>
<br/>

</div>

---

<br/>

> *"Most developers write code. The top 1% understand how it executes. CodeTrace bridges that gap by turning abstract memory management into a high-fidelity cinematic experience."*

<br/>

## ✦ The Vision

CodeTrace is not just another IDE or code runner. It is an **Execution Visualization Engine**. We parse your code into an Abstract Syntax Tree (AST), hook into the runtime environment, and stream the exact state of the Call Stack, Heap Memory, and execution pointers directly to a 60FPS hardware-accelerated frontend canvas.

Whether you are debugging a complex Recursive Backtracking algorithm, traversing a Red-Black Tree, or understanding exactly how the V8 Event Loop closures work — CodeTrace makes the invisible, visible.

<br/>

---

## ✦ Core Engine & Architecture

<br/>

<img align="right" width="120" src="https://skillicons.dev/icons?i=wasm&theme=dark" alt="WASM Engine" />

### 1. Deterministic Execution Sandbox
At the heart of CodeTrace lies a custom execution environment. By compiling execution traces into JSON delta payloads, we ensure that every memory mutation, variable assignment, and pointer shift is strictly deterministic. You can scrub through your code's execution timeline just like a YouTube video — forwards, backwards, or frame-by-frame.

<br/>
<br/>

<img align="right" width="120" src="https://skillicons.dev/icons?i=react&theme=dark" alt="React Renderer" />

### 2. High-Fidelity Memory Visualizer
The UI doesn't just print variables; it draws them. 
* **The Call Stack:** Watch frames push and pop in real-time.
* **The Heap:** Complex objects (Trees, Graphs, Linked Lists) are algorithmically mapped out using forced-directed graphs and spatial positioning.
* **Reference Pointers:** Glowing SVG curves connect stack variables to their heap allocations.

<br/>
<br/>

<img align="right" width="120" src="https://skillicons.dev/icons?i=gcp&theme=dark" alt="Google Gemini AI" />

### 3. Integrated AI Cognition
Powered by **Google Gemini**, the engine doesn't just show you *what* is happening, it tells you *why*. For every tick of the execution clock, the AI context-engine analyzes the AST node and generates human-readable micro-explanations. It’s like having a Staff Engineer sitting next to you, explaining why your loop just went infinite.

<br/>
<br/>

---

## ✦ The 52-Section Premium Library

CodeTrace ships with a massive, meticulously curated, 52-section interactive library. This isn't just text — every algorithm comes with live code that you can trace and modify instantly.

<details>
<summary><b>🟢 Data Structures & Algorithms (20 Sections)</b></summary>
<br/>

- **Foundations:** Arrays, Strings, Bit Manipulation, Math.
- **Linear Structures:** Linked Lists (Singly, Doubly, Circular), Stacks, Queues, Hash Tables.
- **Trees:** Binary Trees, BSTs, AVL Trees, Red-Black Trees, Tries.
- **Graphs:** Adjacency Matrices/Lists, Directed/Undirected, Weighted, MSTs (Kruskal/Prim).
- **Paradigms:** Two Pointers, Sliding Window, Greedy, Divide & Conquer.
- **Advanced:** Dynamic Programming (1D & 2D), Backtracking, Segment Trees.
</details>

<details>
<summary><b>🔵 Database Architecture (15 Sections)</b></summary>
<br/>

- **PostgreSQL:** ACID, Joins, Window Functions, CTEs, Indexing (B-Tree, GIN), EXPLAIN plans.
- **MySQL:** InnoDB Architecture, Locking Mechanisms, Sharding.
- **MongoDB:** BSON, Aggregation Pipelines, Replica Sets.
- **Redis:** In-Memory Caching, Pub/Sub, Eviction Policies (LRU/LFU).
</details>

<details>
<summary><b>🟡 Deep Language Internals (17 Sections)</b></summary>
<br/>

- **JavaScript/TypeScript:** Event Loop, Microtasks, Closures, Hoisting, V8 Engine Basics, Generics.
- **Python:** Global Interpreter Lock (GIL), Generators, Decorators, Dunder Methods.
- **C++:** Pointers, Memory Leaks, RAII, Smart Pointers, STL Deep Dive.
- **Java:** JVM Architecture, Garbage Collection (G1/ZGC), Multithreading.
</details>

<br/>

---

## ✦ System Flow Diagram

CodeTrace relies on a beautiful orchestration between the client layer and the execution engines.

```mermaid
sequenceDiagram
    participant User as 🧑‍💻 Developer
    participant Monaco as 🎨 Monaco Editor
    participant Engine as ⚙️ Trace Engine
    participant Memory as 🧠 Memory Graph
    participant AI as 🤖 Gemini AI
    
    User->>Monaco: Writes algorithm (e.g., QuickSort)
    User->>Engine: Clicks "Trace Execution"
    Engine->>Engine: Parses AST & Injects Hooks
    Engine->>Memory: Generates execution payload (Deltas)
    par Visual Render
        Memory-->>User: Animates Stack & Heap
    and AI Analysis
        Engine->>AI: Sends execution state context
        AI-->>User: Streams contextual explanation
    end
    User->>Memory: Scrubs timeline (Rewind/Forward)
```

<br/>

---

## ✦ Getting Started

Experience CodeTrace on your own machine. The local environment is optimized with Turbopack for sub-second HMR.

### Prerequisites
* Node.js v18.17.0+
* npm or pnpm

### Quick Installation

```bash
# 1. Clone the repository securely
git clone https://github.com/Satya522/CodeTrace.git

# 2. Navigate to the project directory
cd CodeTrace

# 3. Install all necessary dependencies
npm install

# 4. Bootstrap your environment variables
cp .env.example .env

# 5. Launch the Turbopack engine
npm run dev
```

Visit `http://localhost:3000` to access the workspace.

<br/>

---

## ✦ Project Structure

A clean, modular architecture makes CodeTrace easy to scale and contribute to.

```text
codetrace/
├── app/                    # Next.js 14 App Router
│   ├── algorithms/         # Interactive Markdown rendering engine
│   ├── api/                # Edge-ready API endpoints
│   └── docs/               # Technical documentation site
├── src/
│   ├── backend/            # Trace compilers, AST parsers, and AI handlers
│   ├── content/            # The 52-section algorithm markdown library
│   └── frontend/
│       ├── components/     # High-reusability React Server/Client Components
│       │   ├── Editor/     # Monaco implementations
│       │   ├── Visualizer/ # React Flow & Canvas rendering logic
│       │   └── UI/         # Glassmorphism design system (Tailwind)
│       └── views/          # Fully assembled page layouts
└── prisma/                 # Database schemas and edge-ready clients
```

<br/>

---

## ✦ Community & Contributing

We are building the future of computer science education, and we want you on board.

**How to contribute:**
1. Fork the repo & clone locally.
2. Branch out: `git checkout -b feature/your-feature-name`
3. Write clean, typed, and well-commented code.
4. Commit using conventional formats: `feat(engine): added AST support for structs`
5. Push & Open a PR.

*Check our [Contributing Guidelines](CONTRIBUTING.md) for deeper technical standards.*

<br/>

---

## ✦ License

Designed and open-sourced under the **[MIT License](LICENSE)**. You are free to use, modify, and distribute this software as long as you provide attribution.

<br/>

<div align="center">
  <p><b>Built with Absolute Precision & Passion by Satya</b></p>
  
  <a href="https://github.com/Satya522">
    <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>
</div>
