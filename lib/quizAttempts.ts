import "server-only";
import { cache } from "react";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { scoreAttempt } from "@/lib/quizScoring";

export const quizAnswerSchema = z
  .object({
    question: z.string().trim().min(1).max(500),
    options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
    correctIndex: z.number().int().min(0),
    selectedIndex: z.number().int().min(0).nullable(),
  })
  .refine(
    (answer) =>
      answer.correctIndex < answer.options.length &&
      (answer.selectedIndex === null ||
        answer.selectedIndex < answer.options.length),
    { message: "Answer index is out of range" }
  );

export const selectionSchema = z.object({
  selected: z.array(z.number().int().min(0).nullable()).max(50),
});

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;
export type PlayerQuestion = Pick<QuizAnswer, "question" | "options">;

export const GRACE_SECONDS = 5;

export const isAttemptId = (id: string) => /^c[a-z0-9]{20,32}$/.test(id);

const attemptSelect = {
  id: true,
  userId: true,
  category: true,
  difficulty: true,
  status: true,
  timeLimit: true,
  expiresAt: true,
  score: true,
  totalQuestions: true,
  timeTaken: true,
  answers: true,
  createdAt: true,
  completedAt: true,
} as const;

type AttemptRow = NonNullable<
  Awaited<ReturnType<typeof findAttemptRow>>
>;

const findAttemptRow = (id: string, userId: string) =>
  prisma.quizAttempt.findFirst({
    where: { id, userId },
    select: attemptSelect,
  });

const parseAnswers = (answers: unknown) => {
  const parsed = z.array(quizAnswerSchema).safeParse(answers);
  return parsed.success ? parsed.data : [];
};

export const hasExpired = (
  attempt: { status: string; expiresAt: Date | null },
  now = Date.now()
) =>
  attempt.status === "IN_PROGRESS" &&
  attempt.expiresAt !== null &&
  now > attempt.expiresAt.getTime() + GRACE_SECONDS * 1000;

async function finishExpiredAttempt(attempt: AttemptRow) {
  const answers = parseAnswers(attempt.answers);
  const expiresAt = attempt.expiresAt as Date;
  const result = scoreAttempt(
    answers,
    answers.map((answer) => answer.selectedIndex),
    attempt.timeLimit ?? 0,
    attempt.timeLimit
  );

  await prisma.$transaction(async (tx) => {
    const { count } = await tx.quizAttempt.updateMany({
      where: { id: attempt.id, status: "IN_PROGRESS" },
      data: {
        status: "EXPIRED",
        answers: result.answers,
        score: result.score,
        timeTaken: result.timeTaken,
        completedAt: expiresAt,
      },
    });
    if (count === 1) {
      await tx.user.update({
        where: { id: attempt.userId },
        data: { quizAttended: { increment: 1 } },
      });
    }
  });

  return findAttemptRow(attempt.id, attempt.userId);
}

export const getAttempt = cache(async (id: string, userId: string) => {
  if (!isAttemptId(id)) return null;

  let attempt = await findAttemptRow(id, userId);
  if (attempt && hasExpired(attempt)) {
    attempt = await finishExpiredAttempt(attempt);
  }
  if (!attempt) return null;

  return { ...attempt, answers: parseAnswers(attempt.answers) };
});

export type QuizAttemptData = NonNullable<Awaited<ReturnType<typeof getAttempt>>>;

export async function finishExpiredAttempts(userId: string) {
  const expired = await prisma.quizAttempt.findMany({
    where: {
      userId,
      status: "IN_PROGRESS",
      expiresAt: { lt: new Date(Date.now() - GRACE_SECONDS * 1000) },
    },
    select: attemptSelect,
  });
  for (const attempt of expired) {
    await finishExpiredAttempt(attempt);
  }
  return expired.length;
}

export async function getActiveAttempt(userId: string) {
  await finishExpiredAttempts(userId);
  const attempt = await prisma.quizAttempt.findFirst({
    where: { userId, status: "IN_PROGRESS" },
    orderBy: { createdAt: "desc" },
    select: { id: true, category: true, difficulty: true, expiresAt: true },
  });
  return attempt ? { ...attempt, secondsLeft: secondsLeft(attempt) } : null;
}

export const secondsElapsed = (attempt: Pick<QuizAttemptData, "createdAt">) =>
  Math.floor((Date.now() - attempt.createdAt.getTime()) / 1000);

export const secondsLeft = (attempt: { expiresAt: Date | null }) =>
  attempt.expiresAt === null
    ? null
    : Math.max(0, Math.ceil((attempt.expiresAt.getTime() - Date.now()) / 1000));
