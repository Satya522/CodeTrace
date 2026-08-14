import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const C_KEYWORDS = [
  "auto", "break", "case", "char", "const", "continue", "default", "do",
  "double", "else", "enum", "extern", "float", "for", "goto", "if", "int",
  "long", "register", "return", "short", "signed", "sizeof", "static",
  "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"
];

const C_BUILTINS = [
  "printf", "scanf", "malloc", "calloc", "realloc", "free", "strlen", "strcpy",
  "strncpy", "strcmp", "strncmp", "strcat", "strncat", "fopen", "fclose", "fread",
  "fwrite", "fprintf", "fscanf", "NULL", "size_t", "FILE"
];

export function getCCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        insertText: 'int main() {\n\t$0\n\treturn 0;\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'int main()',
        range
      });

      suggestions.push({
        label: 'inc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: '#include <$1.h>\n$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: '#include directive',
        range
      });

      suggestions.push({
        label: 'pr',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'printf("$1\\n", $2);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'printf',
        range
      });

      C_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range
        });
      });

      C_BUILTINS.forEach(builtin => {
        suggestions.push({
          label: builtin,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: builtin,
          range
        });
      });

      return { suggestions };
    }
  };
}
