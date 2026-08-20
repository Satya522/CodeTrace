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

  const prompt = `You are an expert execution trace simulator and CS tutor.
The user provides a ${language} program. Its actual stdout output is: ${stdout || "(no output)"}

Generate a JSON array of ExecutionStep objects — one per meaningful line execution.

CRITICAL RULES for explanation field:
1. explanation.en MUST be a detailed, narrated explanation like a tutor talking to a student.
   BAD: "Executing line 3"
   GOOD: "Variable 'i' is incremented from 2 to 3. The loop condition 'i < n' is checked: since 3 < 5 is true, we enter the loop body again."
   GOOD: "Comparing arr[1] (value 34) with arr[2] (value 25). Since 34 > 25, we swap them."
2. explanation.hi MUST be the Hindi translation of explanation.en
3. For sorting/searching algorithms, mention which indices are being compared, swapped, or found.
   Use exact format: "Comparing arr[j] and arr[j+1]" or "Swap arr[2] and arr[3]" so the visualizer can parse indices.
4. If this line prints to stdout, put ONLY what this specific line prints in consoleOutput.

CRITICAL RULES for stack:
Each stack frame must have: { id: string, name: string, variables: [{ name, type, value, isReference }], returnValue?: string, parentCallId?: string }
- id: unique like "frame_main_1"
- For arrays/lists: put them in heap, reference them from stack with isReference: true

CRITICAL RULES for heap:
Array of objects: { id, type, data (JSON string), isOrphaned, address, referencedBy, structureKind }
- structureKind: "primitive" | "linkedList" | "binaryTree" | "graph" | "matrix" | "stack" | "queue" | "hashMap" | "generic"
- data for arrays: "[5, 2, 8, 1, 9]" (JSON string)
- type for arrays: "list" (Python), "Array" (JS), "int[]" (Java), "vector<int>" (C++)

CRITICAL RULES for counters:
Track comparisons (if/while conditions), swaps, arrayAccesses, recursiveCalls accurately per step.

Output ONLY valid JSON. No markdown, no backticks, no explanation outside JSON.

interface ExecutionStep {
  step: number;
  line: number;
  explanation: { en: string; hi: string };
  stack: { id: string; name: string; variables: { name: string; type: string; value: string; isReference: boolean; address?: string }[]; returnValue?: string; parentCallId?: string }[];
  heap: { id: string; type: string; data: string; isOrphaned: boolean; address: string; referencedBy: string[]; structureKind: string }[];
  systemLog: string;
  consoleOutput?: string;
  counters: { comparisons: number; swaps: number; arrayAccesses: number; recursiveCalls: number };
  mode: "simulated";
}

Program:
${code}`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  let text = result.response.text();
  // Strip markdown code fences if present
  text = text.replace(/^\s*```json\s*/i, "").replace(/```\s*$/i, "").trim();
  
  return JSON.parse(text);
}
