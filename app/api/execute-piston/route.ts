import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
    }

    // Map frontend language names to Piston language names and versions
    const pistonLangMap: Record<string, { language: string; version: string }> = {
      c: { language: "c", version: "10.2.0" },
      cpp: { language: "c++", version: "10.2.0" },
      java: { language: "java", version: "15.0.2" },
      go: { language: "go", version: "1.16.2" },
      rust: { language: "rust", version: "1.68.2" }
    };

    const pistonConfig = pistonLangMap[language] || { language, version: "*" };

    const response = await fetch("https://emacsx.com/api/v2/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonConfig.language,
        version: pistonConfig.version,
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Piston execution failed: ${errorText}` }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      code: data.run?.code || 0
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
