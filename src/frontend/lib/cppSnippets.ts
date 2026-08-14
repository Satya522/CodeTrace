import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const CPP_KEYWORDS = [
  "alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand", "bitor",
  "bool", "break", "case", "catch", "char", "char8_t", "char16_t", "char32_t",
  "class", "compl", "concept", "const", "consteval", "constexpr", "constinit",
  "const_cast", "continue", "co_await", "co_return", "co_yield", "decltype",
  "default", "delete", "do", "double", "dynamic_cast", "else", "enum", "explicit",
  "export", "extern", "false", "float", "for", "friend", "goto", "if", "inline",
  "int", "long", "mutable", "namespace", "new", "noexcept", "not", "not_eq",
  "nullptr", "operator", "or", "or_eq", "private", "protected", "public",
  "register", "reinterpret_cast", "requires", "return", "short", "signed",
  "sizeof", "static", "static_assert", "static_cast", "struct", "switch",
  "template", "this", "thread_local", "throw", "true", "try", "typedef",
  "typeid", "typename", "union", "unsigned", "using", "virtual", "void",
  "volatile", "wchar_t", "while", "xor", "xor_eq"
];

const CPP_STD_TYPES = [
  "string", "vector", "map", "unordered_map", "set", "unordered_set", "queue",
  "priority_queue", "stack", "deque", "list", "array", "pair", "tuple", "optional",
  "variant", "any", "unique_ptr", "shared_ptr", "weak_ptr", "cout", "cin", "cerr",
  "endl", "ifstream", "ofstream", "stringstream"
];

export function getCppCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        label: 'main',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'int main() {\n\t$0\n\treturn 0;\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'int main() function',
        range
      });

      suggestions.push({
        label: 'inc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: '#include <$1>\n$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: '#include directive',
        range
      });

      suggestions.push({
        label: 'cout',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'std::cout << $1 << std::endl;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'std::cout print',
        range
      });

      suggestions.push({
        label: 'cin',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'std::cin >> $1;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'std::cin input',
        range
      });

      suggestions.push({
        label: 'fori',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for (int i = 0; i < $1; ++i) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'for loop',
        range
      });

      suggestions.push({
        label: 'forit',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for (auto it = ${1:vec}.begin(); it != ${1:vec}.end(); ++it) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'iterator for loop',
        range
      });

      // Keywords
      CPP_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range
        });
      });

      // STD Types
      CPP_STD_TYPES.forEach(type => {
        suggestions.push({
          label: type,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: type,
          documentation: "std::" + type,
          range
        });
      });

      return { suggestions };
    }
  };
}
