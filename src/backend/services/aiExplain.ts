import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExecutionStep } from "@/frontend/types";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function explainStepDetailed(code: string, language: string, step: ExecutionStep) {
  if (!API_KEY) {
    return {
      en: "Detailed explanation unavailable. (No API key found in .env.local)",
      hi: "विस्तृत विवरण अनुपलब्ध। (कोई API कुंजी नहीं मिली)"
    };
  }

  const prompt = `You are an expert CS tutor.
The user is stepping through a ${language} program.
Here is the full source code:
\`\`\`${language}
${code}
\`\`\`

The user is currently at line ${step.line}.
The current state of the stack is:
${JSON.stringify(step.stack, null, 2)}
The current state of the heap is:
${JSON.stringify(step.heap, null, 2)}

Provide a highly detailed, insightful explanation of what is happening at this exact moment in the code.
Do NOT just repeat the line of code. Explain WHY it is happening, what the variables mean in this context, and what the immediate consequence will be.
If there's an interesting algorithmic property or invariant being maintained here, mention it!

Return ONLY a valid JSON object with the following schema:
{
  "en": "Your detailed explanation in English",
  "hi": "The exact same detailed explanation translated to Hindi"
}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  let text = result.response.text();
  // Strip markdown code fences if present
  text = text.replace(/^\s*```json\s*/i, "").replace(/```\s*$/i, "").trim();
  
  return JSON.parse(text);
}
