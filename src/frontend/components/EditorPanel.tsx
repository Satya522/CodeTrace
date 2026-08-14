"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { editor as MonacoEditorNs } from "monaco-editor";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import { getJavaCompletionProvider } from "@/frontend/lib/javaSnippets";
import { getJsCompletionProvider } from "@/frontend/lib/jsSnippets";
import { getPythonCompletionProvider } from "@/frontend/lib/pythonSnippets";
import { getCppCompletionProvider } from "@/frontend/lib/cppSnippets";
import { getSqlCompletionProvider } from "@/frontend/lib/sqlSnippets";
import { getNoSqlCompletionProvider } from "@/frontend/lib/nosqlSnippets";
import { getTsCompletionProvider } from "@/frontend/lib/tsSnippets";
import { getGoCompletionProvider } from "@/frontend/lib/goSnippets";
import { getRustCompletionProvider } from "@/frontend/lib/rustSnippets";
import { getCCompletionProvider } from "@/frontend/lib/cSnippets";

interface EditorPanelProps {
  code: string;
  onChange: (value: string) => void;
  currentLine: number | null;
  language?: string;
}

export function EditorPanel({ code, onChange, currentLine, language = "python" }: EditorPanelProps) {
  const editorRef = useRef<MonacoEditorNs.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<MonacoEditorNs.IEditorDecorationsCollection | null>(null);

  useEffect(() => {
    const editorInstance = editorRef.current;
    if (!editorInstance) return;

    if (currentLine == null) {
      decorationsRef.current?.clear();
      return;
    }

    const newDecorations: MonacoEditorNs.IModelDeltaDecoration[] = [
      {
        range: {
          startLineNumber: currentLine,
          startColumn: 1,
          endLineNumber: currentLine,
          endColumn: 1,
        } as any,
        options: {
          isWholeLine: true,
          className: "ct-current-line",
          glyphMarginClassName: "ct-current-line-glyph",
        },
      },
    ];

    if (!decorationsRef.current) {
      decorationsRef.current = editorInstance.createDecorationsCollection(newDecorations);
    } else {
      decorationsRef.current.set(newDecorations);
    }

    editorInstance.revealLineInCenter(currentLine);
  }, [currentLine]);

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-border bg-[#0a0a0a]">
      <style jsx global>{`
        .ct-current-line {
          background: rgba(59, 130, 246, 0.16);
          border-left: 3px solid #3b82f6;
        }
      `}</style>
      <MonacoEditor
        height="100%"
        theme="vs-dark"
        language={language === "nosql" ? "javascript" : language}
        value={code}
        onChange={(value) => onChange(value ?? "")}
        onMount={(editorInstance, monaco) => {
          editorRef.current = editorInstance;
          monaco.editor.defineTheme("codetrace-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
              "editor.background": "#0a0a0a",
            },
          });
          monaco.editor.setTheme("codetrace-dark");

          // Register snippets only once
          if (!(window as any)._monacoSnippetsRegistered) {
            (window as any)._monacoSnippetsRegistered = true;
            
            // Java rich snippets and keywords
            monaco.languages.registerCompletionItemProvider('java', getJavaCompletionProvider(monaco));

            // JavaScript rich snippets
            monaco.languages.registerCompletionItemProvider('javascript', getJsCompletionProvider(monaco));

            // Python rich snippets
            monaco.languages.registerCompletionItemProvider('python', getPythonCompletionProvider(monaco));

            // C++ rich snippets
            monaco.languages.registerCompletionItemProvider('cpp', getCppCompletionProvider(monaco));

            // SQL rich snippets
            monaco.languages.registerCompletionItemProvider('sql', getSqlCompletionProvider(monaco));

            // NoSQL/MongoDB rich snippets (using javascript since we map nosql to javascript for syntax)
            monaco.languages.registerCompletionItemProvider('javascript', getNoSqlCompletionProvider(monaco));

            // TypeScript rich snippets
            monaco.languages.registerCompletionItemProvider('typescript', getTsCompletionProvider(monaco));

            // Go rich snippets
            monaco.languages.registerCompletionItemProvider('go', getGoCompletionProvider(monaco));

            // Rust rich snippets
            monaco.languages.registerCompletionItemProvider('rust', getRustCompletionProvider(monaco));

            // C rich snippets
            monaco.languages.registerCompletionItemProvider('c', getCCompletionProvider(monaco));
          }
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          glyphMargin: true,
          padding: { top: 16 },
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
        }}
      />
    </div>
  );
}
