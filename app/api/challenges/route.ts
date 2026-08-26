import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const dateQuery = req.nextUrl.searchParams.get("date");
    let date = new Date();
    
    if (dateQuery) {
      date = new Date(dateQuery);
    }
    
    // Normalize date to beginning of day
    date.setUTCHours(0, 0, 0, 0);

    let challenge = await prisma.challenge.findUnique({
      where: { date }
    });

    if (!challenge) {
      // Seed a default challenge if missing (for demo purposes)
      challenge = await prisma.challenge.create({
        data: {
          title: "Two Sum",
          description: "Find two numbers that add up to a target.",
          difficulty: "Easy",
          language: "javascript",
          initialCode: `function twoSum(nums, target) {
  // your code here
}`,
          date: date,
        }
      });
    }

    // In a real app, you would also fetch Questions from a related table.
    // For now we mock the questions based on the challenge data.
    const questions = [
      {
        text: "What is the optimal time complexity for this problem?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)", "O(n log n)"],
        correctIndex: 2,
      },
      {
        text: "Which data structure is typically used for the optimal solution?",
        options: ["Array", "Linked List", "Hash Map", "Binary Tree"],
        correctIndex: 2,
      },
      {
        text: "Can the problem have multiple valid answers?",
        options: ["Yes, always", "No, exactly one solution is assumed", "Depends on the array", "I don't know"],
        correctIndex: 1,
      }
    ];

    return NextResponse.json({
      id: challenge.id,
      title: challenge.title,
      code: challenge.initialCode,
      questions
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
