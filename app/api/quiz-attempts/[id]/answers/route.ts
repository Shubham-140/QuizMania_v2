import { prisma } from "@/lib/prisma";
import { readSelection } from "@/lib/quizAttemptRequest";
import { scoreAttempt } from "@/lib/quizScoring";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const request = await readSelection(req, params);
  if (!request.ok) return request.response;
  const { userId, attempt, selected } = request;

  const { answers } = scoreAttempt(attempt.answers, selected, 0, null);

  try {
    const { count } = await prisma.quizAttempt.updateMany({
      where: { id: attempt.id, userId, status: "IN_PROGRESS" },
      data: { answers },
    });
    if (count === 0) {
      return NextResponse.json({ id: attempt.id }, { status: 409 });
    }
    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Save quiz answers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
