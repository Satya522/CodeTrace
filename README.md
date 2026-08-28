<div align="center">

<img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
<img src="https://img.shields.io/badge/Framer_Motion-13-FF0050?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />

# 🔬 CodeTrace

### *See your code think. Step by step.*

**CodeTrace** is an interactive code visualization engine that lets you watch your code execute in real-time — with live memory tracking, call stack visualization, algorithm animations, and step-by-step debugging.

Built for students, educators, and developers who want to truly *understand* how code works under the hood.

[**🚀 Live Demo**](https://codetrace.dev) · [**📖 Documentation**](https://codetrace.dev/docs) · [**💬 Discord**](https://codetrace.dev/discord) · [**🐛 Report Bug**](https://github.com/Satya522/CodeTrace/issues)

---

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Step-by-Step Execution** | Watch your code run line by line with real-time variable tracking |
| 🧠 **Memory Visualization** | See Stack Frames, Heap Objects, and reference arrows in real-time |
| 📊 **Algorithm Animations** | Sorting bars, graph traversals, tree operations — all animated |
| 🖥️ **Live Console Output** | stdout captured and displayed as your code runs |
| 🤖 **AI Explanations** | Gemini-powered natural language explanations for each step |
| ⚡ **Multi-Language Support** | Python, JavaScript, C++, Java, and SQL |
| 🎨 **Monaco Code Editor** | Full VS Code-like editing experience with syntax highlighting |
| 🏎️ **Algorithm Race Mode** | Compare two algorithms side-by-side in real-time |
| 📚 **52-Section Library** | Comprehensive DSA, Database (MongoDB, MySQL, PostgreSQL, Redis), and Language reference |
| 🧩 **Embeddable Widgets** | Embed visualizations in blogs, docs, or LMS platforms |
| ♿ **Accessibility** | Screen reader support, colorblind mode, reduced motion |
| 🌙 **Premium Dark UI** | Glassmorphism design with emerald-green accent theme |

## 🖼️ Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  CodeTrace — bubble_sort.py                    ⏮ ▶ ⏭ ↺  3/8  │
├──────────────┬──────────────────┬────────────────────────────────┤
│ Source Code  │  Frames │Objects│  Algorithm        │  Console   │
│              │         │       │  ██ ██             │            │
│  1 def sort  │ Global  │ list  │  ██ ██ ██          │ Swap: 38↔27│
│▸ 2   for i   │ sort()  │[27,38 │  ██ ██ ██ ██       │ Pass 1 done│
│  3     if    │  i = 0  │ ,43,3 │  ██ ██ ██ ██ ██    │            │
│  4       sw  │  j = 1  │ ,9,82 │  ██ ██ ██ ██ ██ ██ │ ✅ Sorted! │
│              │         │ ,10]  │  ██ ██ ██ ██ ██ ██ ██           │
├──────────────┴─────────┴───────┴─────────────────────────────────┤
│ 💡 Comparing arr[1]=38 and arr[2]=43 — no swap needed           │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/Satya522/CodeTrace.git
cd CodeTrace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys (Gemini, NextAuth, etc.)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it in action.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.4 |
| **Styling** | Tailwind CSS 3.4 + Glassmorphism |
| **Animations** | Framer Motion 13 |
| **Code Editor** | Monaco Editor (VS Code engine) |
| **AI** | Google Gemini API |
| **Database** | Prisma + SQLite |
| **Auth** | NextAuth.js |
| **Visualizations** | Custom Canvas + React Flow |
| **3D Effects** | Three.js + React Three Fiber |

## 📁 Project Structure

```
codetrace/
├── app/                    # Next.js App Router pages
│   ├── algorithms/         # Algorithm library page
│   ├── api/                # API routes (auth, trace, challenges)
│   ├── docs/               # Documentation page
│   └── embed/              # Embeddable widget pages
├── src/
│   ├── backend/            # Server-side services
│   │   ├── lib/            # Auth configuration
│   │   └── services/       # Trace engine, AI integration
│   ├── content/            # Markdown content (algorithms.md - 52 sections)
│   ├── database/           # Database workers & interpreters
│   └── frontend/
│       ├── components/     # Reusable UI components
│       │   ├── AlgorithmVisualizer/  # Sorting bars, graph viz
│       │   ├── MemoryBoard/          # Stack + Heap panels
│       │   └── ...
│       ├── lib/            # Utilities, snippets, examples
│       └── views/          # Page-level views
│           ├── HomeView/   # Landing page + App workspace
│           │   └── HeroLanding/  # Hero, Features, Navbar, Footer
│           └── AlgorithmsView/   # Algorithm library viewer
├── prisma/                 # Database schema
├── public/                 # Static assets
└── tailwind.config.ts      # Theme configuration
```

## 📚 Algorithm Library (52 Sections)

Our comprehensive reference covers **10 parts** across DSA, Databases, and Languages:

| Part | Category | Sections |
|------|----------|----------|
| **1** | Data Structures & Algorithms | Arrays, Hashing, Linked Lists, Stacks, Recursion, Sorting, Searching, Math, Bits, Strings, Heaps, Trees, Graphs, Greedy, Backtracking, DP |
| **2** | MongoDB | CRUD, Aggregation, Indexing, Schema Design, Transactions |
| **3** | MySQL | Joins, Subqueries, Window Functions, Indexing, Stored Procedures |
| **4** | PostgreSQL | Joins, CTEs, Window Functions, Indexing, Patterns, EXPLAIN |
| **5** | Redis | Data Structures, Caching Patterns |
| **6** | Python | Generators, Decorators, Comprehensions, Concurrency |
| **7** | JavaScript | Closures, Event Loop, Hoisting, Call/Apply, Promises, Prototypes |
| **8** | TypeScript | Types & Interfaces, Advanced Patterns |
| **9** | C++ | STL, Pointers, Memory Management |
| **10** | Java | OOPs, Collections, Garbage Collection |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) — The React Framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — VS Code's editor engine
- [Framer Motion](https://www.framer.com/motion/) — Production-ready animations
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Google Gemini](https://ai.google.dev/) — AI-powered explanations

---

<div align="center">

**Built with ❤️ by [Satya](https://github.com/Satya522)**

If you found this project useful, please consider giving it a ⭐

</div>
