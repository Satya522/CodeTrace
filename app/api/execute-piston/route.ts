import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
    }

    const API_KEY = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "";
    if (!API_KEY) {
      return NextResponse.json({ error: "Server missing API configuration" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: API_KEY });

    const prompt = `You are a strict code execution engine for ${language}.
Here is the code to execute:

\`\`\`${language}
${code}
\`\`\`

Output ONLY the exact stdout text that this program would print to the console. 
If the code has syntax errors or runtime errors, output the exact error message.
CRITICAL RULES:
- DO NOT output any markdown formatting or backticks.
- DO NOT output any explanation.
- DO NOT output any <think> reasoning blocks.
- Just output the raw string output of the program exactly as it would appear in a terminal.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "qwen/qwen3.6-27b",
      temperature: 0,
    });

    let stdout = completion.choices[0]?.message?.content || "";
    
    // Clean up potential markdown blocks or reasoning blocks
    if (stdout.includes("</think>")) {
      stdout = stdout.split("</think>")[1].trim();
    }
    if (stdout.startsWith('\`\`\`')) {
       stdout = stdout.replace(/^\s*```[a-z]*\n/i, "").replace(/```\s*$/i, "").trim();
    }

    return NextResponse.json({
      stdout: stdout,
      stderr: "",
      code: 0
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
