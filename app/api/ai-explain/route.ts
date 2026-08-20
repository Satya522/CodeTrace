import { NextResponse } from "next/server";
import { explainStepDetailed } from "@/backend/services/aiExplain";

export async function POST(req: Request) {
  try {
    const { code, language, step } = await req.json();

    if (!code || !language || !step) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const explanation = await explainStepDetailed(code, language, step);
    return NextResponse.json({ explanation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
