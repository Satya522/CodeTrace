import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "GROQ_API_KEY is missing in environment variables" }, { status: 500 });
    }
    
    const groq = new Groq({ apiKey });
    
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json({ ok: false, error: "No code provided" }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // updated from decommissioned model
      messages: [
        {
          role: "system",
          content: `Act as an expert code debugger. Dry run the provided code step-by-step. Return a JSON object containing a "trace" array, where each object in the array represents a single execution step. The JSON schema for the returned object MUST exactly match:
{
  "trace": [
    {
      "step": (integer) Step sequence number starting from 1,
      "line": (integer) The exact line number currently being executed,
      "code": (string) The snippet of code on that line,
      "explanation": (string) A very short, 1-sentence explanation of what this line is doing,
      "memory": (object) Key-value pairs of all variables and their current values in memory at this step
    }
  ]
}
Do not include any markdown formatting or extra text outside the JSON object.`
        },
        {
          role: "user",
          content: code
        }
      ],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
        throw new Error("No response text from Groq");
    }

    // Parse the JSON object and extract the "trace" array
    const jsonResponse = JSON.parse(text);
    const jsonTrace = jsonResponse.trace || [];

    return NextResponse.json({ ok: true, trace: jsonTrace });
  } catch (err: any) {
    console.error("AI Trace Error:", err);
    return NextResponse.json({ ok: false, error: err.message || "Failed to generate AI trace" }, { status: 500 });
  }
}
