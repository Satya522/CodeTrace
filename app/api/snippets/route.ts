import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/lib/auth";
import { prisma } from "@/backend/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const snippets = await prisma.snippet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ snippets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { title, code, language } = await req.json();

    if (!code || !language || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const snippet = await prisma.snippet.create({
      data: {
        title,
        code,
        language,
        userId
      }
    });

    return NextResponse.json({ snippet });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
