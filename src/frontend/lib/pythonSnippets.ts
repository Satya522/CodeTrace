import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const PYTHON_KEYWORDS = [
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "False", "finally", "for",
  "from", "global", "if", "import", "in", "is", "lambda", "None",
  "nonlocal", "not", "or", "pass", "raise", "return", "True", "try",
  "while", "with", "yield"
];

const PYTHON_BUILTINS = [
  "abs", "all", "any", "ascii", "bin", "bool", "bytearray", "bytes", "callable",
  "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod",
  "enumerate", "eval", "exec", "filter", "float", "format", "frozenset", "getattr",
  "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance",
  "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min",
  "next", "object", "oct", "open", "ord", "pow", "print", "property", "range",
  "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod",
  "str", "sum", "super", "tuple", "type", "vars", "zip", "__import__"
];

export function getPythonCompletionProvider(monaco: any): languages.CompletionItemProvider {
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

      // Add Snippets
      suggestions.push({
        label: 'pr',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'print($1)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'print statement',
        range
      });

      suggestions.push({
        label: 'def',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'def ${1:function_name}(${2:args}):\n\t$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Function definition',
        range
      });

      suggestions.push({
        label: 'class',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'class ${1:ClassName}:\n\tdef __init__(self):\n\t\t$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Class definition',
        range
      });

      suggestions.push({
        label: 'fori',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for ${1:i} in range(${2:n}):\n\t$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'For loop with range',
        range
      });

      suggestions.push({
        label: 'main',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'if __name__ == "__main__":\n\t${1:main()}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Main block',
        range
      });

      suggestions.push({
        label: 'tryc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'try:\n\t$1\nexcept ${2:Exception} as ${3:e}:\n\tprint(${3:e})\n$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Try-Except block',
        range
      });

      suggestions.push({
        label: 'with',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'with open(${1:"file.txt"}, ${2:"r"}) as ${3:f}:\n\t$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'With file open block',
        range
      });

      // Add keywords
      PYTHON_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range
        });
      });

      // Add built-ins
      PYTHON_BUILTINS.forEach(builtin => {
        suggestions.push({
          label: builtin,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: builtin,
          documentation: "Built-in Python function: " + builtin + "()",
          range
        });
      });

      return { suggestions };
    }
  };
}
