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
  errorLine?: number | null;
  errorMessage?: string | null;
  onLineClick?: (lineNumber: number) => void;
}

export function EditorPanel({ code, onChange, currentLine, language = "python", errorLine, errorMessage, onLineClick }: EditorPanelProps) {
  const editorRef = useRef<MonacoEditorNs.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<MonacoEditorNs.IEditorDecorationsCollection | null>(null);
  const errorDecorationsRef = useRef<MonacoEditorNs.IEditorDecorationsCollection | null>(null);

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

  useEffect(() => {
    const editorInstance = editorRef.current;
    const monaco = monacoRef.current;
    if (!editorInstance || !monaco) return;

    const model = editorInstance.getModel();
    if (!model) return;

    if (errorLine == null) {
      errorDecorationsRef.current?.clear();
      monaco.editor.setModelMarkers(model, 'runtime-error', []);
      return;
    }

    const newDecorations: MonacoEditorNs.IModelDeltaDecoration[] = [
      {
        range: {
          startLineNumber: errorLine,
          startColumn: 1,
          endLineNumber: errorLine,
          endColumn: 1,
        } as any,
        options: {
          isWholeLine: true,
          className: "ct-error-line",
          glyphMarginClassName: "ct-error-line-glyph",
        },
      },
    ];

    if (!errorDecorationsRef.current) {
      errorDecorationsRef.current = editorInstance.createDecorationsCollection(newDecorations);
    } else {
      errorDecorationsRef.current.set(newDecorations);
    }

    monaco.editor.setModelMarkers(model, 'runtime-error', [{
      startLineNumber: errorLine,
      startColumn: 1,
      endLineNumber: errorLine,
      endColumn: model.getLineMaxColumn(errorLine),
      message: errorMessage || 'Error occurred here',
      severity: monaco.MarkerSeverity.Error
    }]);

    editorInstance.revealLineInCenter(errorLine);
  }, [errorLine, errorMessage]);

  return (
    <div className="h-full w-full overflow-hidden rounded-t-3xl lg:rounded-none bg-[#010409] transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] group border-t border-white/5">
      <style jsx global>{`
        .ct-current-line {
          background: rgba(59, 130, 246, 0.16);
          border-left: 3px solid #3b82f6;
        }
        .ct-error-line {
          background: rgba(239, 68, 68, 0.15);
          border-left: 3px solid #ef4444;
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
          monacoRef.current = monaco;
          monaco.editor.defineTheme("codetrace-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
              { background: "010409", foreground: "e6edf3" },
              { token: "comment", foreground: "8b949e", fontStyle: "italic" },
              { token: "string", foreground: "a5d6ff" },
              { token: "keyword", foreground: "ff7b72" },
              { token: "number", foreground: "79c0ff" },
              { token: "type", foreground: "ffa657" },
              { token: "class", foreground: "ffa657" },
              { token: "identifier", foreground: "e6edf3" },
              { token: "function", foreground: "d2a8ff" },
              { token: "method", foreground: "d2a8ff" },
              { token: "property", foreground: "79c0ff" },
              { token: "variable", foreground: "e6edf3" },
              { token: "constant", foreground: "79c0ff" },
              { token: "operator", foreground: "ff7b72" },
              { token: "punctuation", foreground: "c9d1d9" },
            ],
            colors: {
              "editor.background": "#010409",
              "editor.foreground": "#e6edf3",
              "editor.lineHighlightBackground": "#161b22",
              "editor.lineHighlightBorder": "#00000000",
              "editorCursor.foreground": "#58a6ff",
              "editor.selectionBackground": "#264f78",
              "editor.inactiveSelectionBackground": "#1b3752",
              "editorBracketMatch.background": "#3b82f630",
              "editorBracketMatch.border": "#3b82f650",
              "editorIndentGuide.background": "#21262d",
              "editorIndentGuide.activeBackground": "#484f58",
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

          // Wire glyph-margin click → onLineClick
          editorInstance.onMouseDown((e: any) => {
            if (
              e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN ||
              e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS
            ) {
              const lineNumber = e.target.position?.lineNumber;
              if (lineNumber && onLineClick) {
                onLineClick(lineNumber);
              }
            }
          });
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          glyphMargin: true,
          padding: { top: 16 },
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          lineNumbersMinChars: 3,
          lineDecorationsWidth: 5,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
