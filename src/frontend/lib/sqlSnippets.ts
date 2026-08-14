import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AS", "JOIN", "INNER", "OUTER", "LEFT", "RIGHT",
  "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "INSERT", "INTO",
  "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER",
  "INDEX", "VIEW", "DATABASE", "PRIMARY", "KEY", "FOREIGN", "REFERENCES",
  "DEFAULT", "UNIQUE", "NOT", "NULL", "AND", "OR", "IN", "LIKE", "BETWEEN",
  "IS", "EXISTS", "COUNT", "SUM", "AVG", "MIN", "MAX", "CAST", "COALESCE",
  // PostgreSQL specific keywords
  "JSONB", "UUID", "SERIAL", "BIGSERIAL", "VARCHAR", "TEXT", "BOOLEAN", 
  "RETURNING", "ILIKE", "SIMILAR TO", "EXPLAIN", "ANALYZE", "TRUNCATE", "CASCADE"
];

export function getSqlCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        label: 'sel',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'SELECT * FROM $1;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'SELECT all snippet',
        range
      });

      suggestions.push({
        label: 'selw',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'SELECT * FROM $1\nWHERE $2;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'SELECT with WHERE',
        range
      });

      suggestions.push({
        label: 'ins',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'INSERT INTO $1 ($2)\nVALUES ($3);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'INSERT statement',
        range
      });

      suggestions.push({
        label: 'upd',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'UPDATE $1\nSET $2 = $3\nWHERE $4;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'UPDATE statement',
        range
      });

      suggestions.push({
        label: 'del',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'DELETE FROM $1\nWHERE $2;',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'DELETE statement',
        range
      });

      suggestions.push({
        label: 'join',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'JOIN $1 ON $2 = $3',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'JOIN statement',
        range
      });

      // Keywords
      SQL_KEYWORDS.forEach(keyword => {
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
