import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const TS_KEYWORDS = [
  "any", "boolean", "constructor", "declare", "enum", "export", "extends",
  "false", "implements", "import", "interface", "let", "module", "namespace",
  "never", "null", "number", "package", "private", "protected", "public",
  "readonly", "require", "string", "super", "this", "true", "type", "typeof",
  "undefined", "unknown", "void", "as", "is", "keyof", "infer"
];

export function getTsCompletionProvider(monaco: any): languages.CompletionItemProvider {
  return {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions: languages.CompletionItem[] = [];

      // Snippets
      suggestions.push({
        label: 'int',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'interface ${1:Name} {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'interface definition',
        range
      });

      suggestions.push({
        label: 'type',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'type ${1:Name} = $0;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'type definition',
        range
      });

      suggestions.push({
        label: 'log',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'console.log($1);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'console.log',
        range
      });

      // Keywords
      TS_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range
        });
      });

      return { suggestions };
    }
  };
}
