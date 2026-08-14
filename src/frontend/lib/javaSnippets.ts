import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const JAVA_KEYWORDS = [
  "abstract", "continue", "for", "new", "switch",
  "assert", "default", "goto", "package", "synchronized",
  "boolean", "do", "if", "private", "this",
  "break", "double", "implements", "protected", "throw",
  "byte", "else", "import", "public", "throws",
  "case", "enum", "instanceof", "return", "transient",
  "catch", "extends", "int", "short", "try",
  "char", "final", "interface", "static", "void",
  "class", "finally", "long", "strictfp", "volatile",
  "const", "float", "native", "super", "while"
];

const JAVA_STANDARD_CLASSES = [
  "String", "Object", "System", "Math", "Integer", "Double", "Boolean",
  "ArrayList", "HashMap", "HashSet", "LinkedList", "TreeMap", "TreeSet",
  "List", "Map", "Set", "Queue", "Stack", "Vector",
  "Scanner", "File", "InputStream", "OutputStream", "BufferedReader", "PrintWriter",
  "Exception", "RuntimeException", "IllegalArgumentException", "NullPointerException",
  "Thread", "Runnable", "Future", "ExecutorService"
];

export function getJavaCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        label: 'psvm',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'public static void main(String[] args) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'public static void main method',
        range
      });

      suggestions.push({
        label: 'sout',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'System.out.println($1);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'System.out.println()',
        range
      });

      suggestions.push({
        label: 'fori',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for (int i = 0; i < $1; i++) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'for loop',
        range
      });

      suggestions.push({
        label: 'ifelse',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'if ($1) {\n\t$2\n} else {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'if-else statement',
        range
      });

      // Add standard library classes
      JAVA_STANDARD_CLASSES.forEach(className => {
        suggestions.push({
          label: className,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: className,
          documentation: "java.lang." + className + " or java.util." + className,
          range
        });
      });

      // Add keywords
      JAVA_KEYWORDS.forEach(keyword => {
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
