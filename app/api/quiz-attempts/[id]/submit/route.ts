import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getAttempt, secondsElapsed } from "@/lib/quizAttempts";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const submitSchema = z.object({
  selected: z.array(z.number().int().min(0).nullable()).max(50),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const attempt = await getAttempt(id, userId);
  if (!attempt) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }
  if (attempt.completedAt) {
    return NextResponse.json({ id: attempt.id }, { status: 409 });
  }

  const { selected } = parsed.data;
  if (selected.length !== attempt.answers.length) {
    return NextResponse.json(
      { error: "Answer count doesn't match the quiz" },
      { status: 400 }
    );
  }

  const answers = attempt.answers.map((answer, i) => {
    const pick = selected[i];
    return {
      ...answer,
      selectedIndex: pick !== null && pick < answer.options.length ? pick : null,
    };
  });
  const score = answers.filter(
    (answer) => answer.selectedIndex === answer.correctIndex
  ).length;
  const elapsed = secondsElapsed(attempt);
  const timeTaken =
    attempt.timeLimit === null ? elapsed : Math.min(elapsed, attempt.timeLimit);

  try {
    const completed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.quizAttempt.updateMany({
        where: { id, userId, completedAt: null },
        data: { answers, score, timeTaken, completedAt: new Date() },
      });
      if (count === 0) return false;
      await tx.user.update({
        where: { id: userId },
        data: { quizAttended: { increment: 1 } },
      });
      return true;
    });

    return NextResponse.json(
      { id: attempt.id },
      { status: completed ? 200 : 409 }
    );
  } catch (error) {
    console.error("Submit quiz attempt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
