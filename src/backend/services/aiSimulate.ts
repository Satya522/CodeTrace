import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function simulateTrace(code: string, language: string, stdout: string) {
  if (!API_KEY) {
    return [
      {
        step: 1,
        line: 1,
        explanation: {
          en: "Simulated trace (No API key found)",
          hi: "सिम्युलेटेड ट्रेस (API कुंजी नहीं मिली)"
        },
        stack: [],
        heap: {},
        systemLog: stdout || "Simulation requires a GEMINI_API_KEY in .env.local",
        counters: { comparisons: 0, swaps: 0, arrayAccesses: 0, recursiveCalls: 0 },
        mode: "simulated"
      }
    ];
  }

  const prompt = `
You are an execution trace simulator.
The user provides a ${language} program and its standard output: ${stdout}.
Generate a JSON array of ExecutionStep objects representing the memory state (stack, heap, line numbers) as the code executes.
Do not output anything other than raw JSON.
Ensure you use this interface:
interface ExecutionStep {
  step: number;
  line: number;
  explanation: { en: string; hi: string };
  stack: any[];
  heap: any;
  systemLog: string;
  counters: { comparisons: number; swaps: number; arrayAccesses: number; recursiveCalls: number };
  mode: "simulated";
}

Program:
${code}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/^\\s*\`\`\`json/i, "").replace(/\`\`\`\\s*$/, "");
  
  return JSON.parse(text);
}
