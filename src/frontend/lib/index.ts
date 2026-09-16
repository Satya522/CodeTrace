export interface CodeExample {
  id: string;
  name: string;
  language: "javascript" | "python" | "sql" | "nosql" | "cpp" | "c" | "typescript" | "java";
  code: string;
}

export const EXAMPLES: CodeExample[] = [
  {
    id: "java",
    name: "Java",
    language: "java",
    code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}`
  },
  {
    id: "cpp",
    name: "C++",
    language: "cpp",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}`
  },
  {
    id: "python",
    name: "Python",
    language: "python",
    code: `# Write your Python code here\n`
  },
  {
    id: "javascript",
    name: "JavaScript",
    language: "javascript",
    code: `// Write your JavaScript code here\n`
  },
  {
    id: "c",
    name: "C",
    language: "c",
    code: `#include <stdio.h>\n\nint main() {\n\treturn 0;\n}`
  },
  {
    id: "typescript",
    name: "TypeScript",
    language: "typescript" as any,
    code: `// Write your TypeScript code here\n`
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
    code: `// MongoDB-style JavaScript queries\n\nconst users = [\n  { name: "Alice", age: 25 },\n  { name: "Bob", age: 30 },\n  { name: "Charlie", age: 35 }\n];\n\nconst adults = users.filter(u => u.age >= 30);\nconsole.log(adults);\n`
  }
];
