import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const quizResultSchema = z
  .object({
    category: z.string().trim().min(1).max(50),
    difficulty: z.enum(["easy", "medium", "hard"]),
    score: z.number().int().min(0),
    totalQuestions: z.number().int().min(1).max(50),
    timeTaken: z.number().int().min(0),
  })
  .refine((data) => data.score <= data.totalQuestions, {
    message: "Score can't be more than the number of questions",
  });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = quizResultSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  try {
    const [quizResult] = await prisma.$transaction([
      prisma.quizResult.create({
        data: { ...result.data, userId: session.user.id },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { quizAttended: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(quizResult, { status: 201 });
  } catch (error) {
    console.error("Save quiz result error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
