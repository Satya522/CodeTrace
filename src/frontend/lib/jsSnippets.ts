import type { editor as MonacoEditorNs, languages } from "monaco-editor";

export function getJsCompletionProvider(monaco: any): languages.CompletionItemProvider {
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
        label: 'log',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'console.log($1);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Log to the console',
        range
      });

      suggestions.push({
        label: 'err',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'console.error($1);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Log error to the console',
        range
      });

      suggestions.push({
        label: 'afn',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'const ${1:name} = (${2:params}) => {\n\t$0\n};',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Arrow Function',
        range
      });

      suggestions.push({
        label: 'fn',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'function ${1:name}(${2:params}) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Standard Function',
        range
      });

      suggestions.push({
        label: 'fori',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for (let i = 0; i < ${1:array}.length; i++) {\n\tconst element = ${1:array}[i];\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'For loop',
        range
      });

      suggestions.push({
        label: 'forof',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for (const ${1:item} of ${2:iterable}) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'For...of loop',
        range
      });

      suggestions.push({
        label: 'ife',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'if (${1:condition}) {\n\t$2\n} else {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'If-Else block',
        range
      });

      suggestions.push({
        label: 'tryc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'try {\n\t$1\n} catch (error) {\n\tconsole.error(error);\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Try-Catch block',
        range
      });

      suggestions.push({
        label: 'st',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'setTimeout(() => {\n\t$0\n}, ${1:1000});',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'setTimeout block',
        range
      });

      suggestions.push({
        label: 'si',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'setInterval(() => {\n\t$0\n}, ${1:1000});',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'setInterval block',
        range
      });

      suggestions.push({
        label: 'docq',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "document.querySelector('$1');",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'document.querySelector',
        range
      });

      // DOM Snippets
      suggestions.push({
        label: 'dgei',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "document.getElementById('$1');",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'document.getElementById',
        range
      });

      suggestions.push({
        label: 'dqs',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "document.querySelector('$1');",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'document.querySelector',
        range
      });

      suggestions.push({
        label: 'dqsa',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "document.querySelectorAll('$1');",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'document.querySelectorAll',
        range
      });

      suggestions.push({
        label: 'cel',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "document.createElement('$1');",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'document.createElement',
        range
      });

      suggestions.push({
        label: 'aevt',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "${1:element}.addEventListener('${2:click}', (e) => {\n\t$0\n});",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'addEventListener',
        range
      });

      suggestions.push({
        label: 'seta',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "${1:element}.setAttribute('${2:name}', '${3:value}');",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'setAttribute',
        range
      });

      return { suggestions };
    }
  };
}
