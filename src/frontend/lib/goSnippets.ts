import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const GO_KEYWORDS = [
  "break", "default", "func", "interface", "select",
  "case", "defer", "go", "map", "struct",
  "chan", "else", "goto", "package", "switch",
  "const", "fallthrough", "if", "range", "type",
  "continue", "for", "import", "return", "var"
];

const GO_BUILTINS = [
  "append", "cap", "close", "complex", "copy", "delete", "imag", "len",
  "make", "new", "panic", "print", "println", "real", "recover",
  "string", "int", "int64", "float64", "bool", "byte", "rune", "error"
];

export function getGoCompletionProvider(monaco: any): languages.CompletionItemProvider {
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

      suggestions.push({
        label: 'main',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func main() {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'main function',
        range
      });

      suggestions.push({
        label: 'pl',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'fmt.Println($1)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'fmt.Println',
        range
      });

      suggestions.push({
        label: 'pf',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'fmt.Printf("$1\\n", $2)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'fmt.Printf',
        range
      });

      suggestions.push({
        label: 'fori',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for i := 0; i < $1; i++ {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'for loop',
        range
      });

      suggestions.push({
        label: 'forr',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for i, v := range ${1:slice} {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'for range loop',
        range
      });

      GO_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range
        });
      });

      GO_BUILTINS.forEach(builtin => {
        suggestions.push({
          label: builtin,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: builtin,
          range
        });
      });

      return { suggestions };
    }
  };
}
