# CodeTrace — Phase 1 (real, working MVP)

A free, no-login memory & execution visualizer. This is **Phase 1** of the full
`CodeTrace-MegaPrompt.md` spec: a genuinely working slice, not a mock.

## What's real in this build

- **Real Python execution** via Pyodide (CPython → WebAssembly) running in a
  Web Worker, instrumented with `sys.settrace` — every step you see is the
  actual interpreter's actual state, not an LLM guess.
- **Real call stack** — every active frame and its live local variables.
- **Real heap** — lists, dicts, tuples, and custom objects, with a linked-list
  auto-detector (any object with a `.next` attribute renders as a chain).
- **Simplified GC visualization** — objects get one "GC Ready" grace step when
  they become unreachable, then disappear. CPython's real refcounting GC is
  near-instant, so this is a deliberate, honest simplification for teaching
  clarity, not a claim of showing real GC internals.
- **Best-effort complexity counters** — comparisons/swaps/array-accesses are
  detected by scanning the executed source line's text, not bytecode. Good
  enough to feel Big-O, not a precision profiler.
- Full playback engine (play/pause/step/speed), Monaco editor with live
  line-highlighting, dark glassmorphic UI.

## What's NOT built yet (see `CodeTrace-MegaPrompt.md` for the full plan)

JavaScript engine, Piston-backed compiled languages, SQL/database board,
binary tree & graph & matrix specialized renderers, animated pointer arrows,
recursion/call-tree view, Hindi toggle, Predict Mode, command palette, embed
mode, PWA/offline caching. These are Phase 2+ — say the word and I'll build
the next phase the same way (real code, verified build).

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. First "Run" click will take a few seconds —
it's downloading the ~10MB Pyodide runtime from jsDelivr's CDN; it's cached by
the browser after that.

## Deploy for free

Push this repo to GitHub, then import it on [vercel.com](https://vercel.com)
(Hobby tier, free) — zero config needed, it's a standard Next.js app.

## A note on dependencies

`npm audit` will show some advisories in Next.js 14.x itself (mostly
Server-Actions/rewrites-related, not relevant to this app's usage) and in
Monaco's `dompurify` sub-dependency. Fine for local/personal use; before any
public production deploy, run `npm audit fix` and keep dependencies current.
