export interface CodeExample {
  id: string;
  name: string;
  language: "javascript" | "python" | "sql" | "nosql" | "cpp" | "java" | "go" | "rust" | "c" | "typescript";
  code: string;
}

export const EXAMPLES: CodeExample[] = [
  {
    id: "javascript",
    name: "JavaScript",
    language: "javascript",
    code: `// Write your JavaScript code here\n`
  },
  {
    id: "python",
    name: "Python",
    language: "python",
    code: `# Write your Python code here\n`
  },
  {
    id: "java",
    name: "Java",
    language: "java",
    code: `public class Main {\n    // Type 'psvm' and press Enter\n}`
  },
  {
    id: "cpp",
    name: "C++",
    language: "cpp",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}`
  },
  {
    id: "sql",
    name: "PostgreSQL",
    language: "sql",
    code: `-- Write your PostgreSQL queries here\n`
  },
  {
    id: "nosql",
    name: "MongoDB",
    language: "nosql",
    code: `// Write your MongoDB queries here\n`
  },
  {
    id: "typescript",
    name: "TypeScript",
    language: "typescript" as any,
    code: `// Write your TypeScript code here\n`
  },
  {
    id: "go",
    name: "Go",
    language: "go",
    code: `package main\n\nimport "fmt"\n\nfunc main() {\n\t// Type 'main' and press Enter\n}`
  },
  {
    id: "rust",
    name: "Rust",
    language: "rust",
    code: `fn main() {\n\t// Type 'main' and press Enter\n}`
  },
  {
    id: "c",
    name: "C",
    language: "c",
    code: `#include <stdio.h>\n\nint main() {\n\t// Type 'main' and press Enter\n\treturn 0;\n}`
  }
];
