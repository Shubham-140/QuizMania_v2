import { prisma } from "@/lib/prisma";
import { secondsElapsed } from "@/lib/quizAttempts";
import { readSelection } from "@/lib/quizAttemptRequest";
import { scoreAttempt } from "@/lib/quizScoring";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const request = await readSelection(req, params);
  if (!request.ok) return request.response;
  const { userId, attempt, selected } = request;

  const { answers, score, timeTaken } = scoreAttempt(
    attempt.answers,
    selected,
    secondsElapsed(attempt),
    attempt.timeLimit
  );
  const now = new Date();
  const completedAt =
    attempt.expiresAt && now > attempt.expiresAt ? attempt.expiresAt : now;

  try {
    const completed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.quizAttempt.updateMany({
        where: { id: attempt.id, userId, status: "IN_PROGRESS" },
        data: { status: "SUBMITTED", answers, score, timeTaken, completedAt },
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
