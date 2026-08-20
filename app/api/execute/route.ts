import { NextResponse } from "next/server";

const LANGUAGE_VERSIONS: Record<string, string> = {
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0",
  javascript: "18.15.0",
  typescript: "5.0.3",
  go: "1.16.2",
  rust: "1.68.2",
  sql: "3.36.0",
};

const PISTON_LANG_MAP: Record<string, string> = {
  python: "python",
  java: "java",
  cpp: "c++",
  c: "c",
  javascript: "javascript",
  typescript: "typescript",
  go: "go",
  rust: "rust",
  sql: "sqlite3",
};

export async function POST(req: Request) {
  try {
    const { language, code, testCode } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: "Missing language or code" }, { status: 400 });
    }

    const pistonLang = PISTON_LANG_MAP[language] || language;
    const version = LANGUAGE_VERSIONS[language] || "*";

    // Combine code and test cases
    const fullCode = testCode ? `${code}\n\n${testCode}` : code;

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonLang,
        version: version,
        files: [
          {
            content: fullCode,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Execution failed: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      run: data.run,
      compile: data.compile,
    });
  } catch (error: any) {
    console.error("Execution API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
