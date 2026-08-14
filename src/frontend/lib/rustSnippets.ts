import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const RUST_KEYWORDS = [
  "as", "async", "await", "break", "const", "continue", "crate", "dyn", "else",
  "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let", "loop",
  "match", "mod", "move", "mut", "pub", "ref", "return", "self", "Self",
  "static", "struct", "super", "trait", "true", "type", "unsafe", "use",
  "where", "while"
];

const RUST_STD = [
  "String", "Vec", "Option", "Result", "Box", "Rc", "Arc", "HashMap", "HashSet",
  "Some", "None", "Ok", "Err", "println!", "format!", "panic!"
];

export function getRustCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        insertText: 'fn main() {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'main function',
        range
      });

      suggestions.push({
        label: 'pl',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'println!("$1", $2);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'println! macro',
        range
      });

      suggestions.push({
        label: 'fori',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for i in 0..$1 {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'for loop',
        range
      });

      RUST_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range
        });
      });

      RUST_STD.forEach(std => {
        suggestions.push({
          label: std,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: std,
          range
        });
      });

      return { suggestions };
    }
  };
}
