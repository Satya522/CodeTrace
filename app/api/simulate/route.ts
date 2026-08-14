import { NextResponse } from "next/server";
import { simulateTrace } from "@/backend/services/aiSimulate";

export async function POST(req: Request) {
  try {
    const { code, language, stdout } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
    }

    const steps = await simulateTrace(code, language, stdout);
    return NextResponse.json({ steps });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
