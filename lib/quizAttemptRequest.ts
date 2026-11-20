import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getAttempt, selectionSchema } from "@/lib/quizAttempts";

export async function readSelection(
  req: Request,
  params: Promise<{ id: string }>
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const userId = session.user.id;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }

  const parsed = selectionSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      ),
    };
  }

  const attempt = await getAttempt(id, userId);
  if (!attempt) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Quiz not found" }, { status: 404 }),
    };
  }
  if (attempt.status !== "IN_PROGRESS") {
    return {
      ok: false as const,
      response: NextResponse.json(
        { id: attempt.id, status: attempt.status },
        { status: 409 }
      ),
    };
  }

  const { selected } = parsed.data;
  if (selected.length !== attempt.answers.length) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Answer count doesn't match the quiz" },
        { status: 400 }
      ),
    };
  }

  return { ok: true as const, userId, attempt, selected };
}
