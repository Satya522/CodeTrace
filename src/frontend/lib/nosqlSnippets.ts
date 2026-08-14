import type { editor as MonacoEditorNs, languages } from "monaco-editor";

const NOSQL_KEYWORDS = [
  "db", "collection", "find", "findOne", "insertOne", "insertMany",
  "updateOne", "updateMany", "replaceOne", "deleteOne", "deleteMany",
  "aggregate", "countDocuments", "distinct", "drop", "createIndex",
  "$match", "$group", "$sort", "$project", "$limit", "$skip", "$lookup",
  "$unwind", "$set", "$unset", "$push", "$pull", "$inc", "$exists", "$in",
  "$nin", "$gt", "$gte", "$lt", "$lte", "$ne", "$eq", "$or", "$and"
];

export function getNoSqlCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        label: 'find',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'db.${1:collection}.find({ $2 });',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'MongoDB find query',
        range
      });

      suggestions.push({
        label: 'ins1',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'db.${1:collection}.insertOne({\n\t$0\n});',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'MongoDB insertOne',
        range
      });

      suggestions.push({
        label: 'insm',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'db.${1:collection}.insertMany([\n\t{ $0 }\n]);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'MongoDB insertMany',
        range
      });

      suggestions.push({
        label: 'upd1',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'db.${1:collection}.updateOne(\n\t{ ${2:filter} },\n\t{ $set: { ${3:update} } }\n);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'MongoDB updateOne',
        range
      });

      suggestions.push({
        label: 'del1',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'db.${1:collection}.deleteOne({ ${2:filter} });',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'MongoDB deleteOne',
        range
      });

      suggestions.push({
        label: 'agg',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'db.${1:collection}.aggregate([\n\t{ $match: { $2 } },\n\t{ $group: { _id: "$3", total: { $sum: 1 } } }\n]);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'MongoDB aggregate pipeline',
        range
      });

      // Keywords
      NOSQL_KEYWORDS.forEach(keyword => {
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
