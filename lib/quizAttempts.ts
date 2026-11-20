import { cache } from "react";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;
export type PlayerQuestion = Pick<QuizAnswer, "question" | "options">;

export const isAttemptId = (id: string) => /^c[a-z0-9]{20,32}$/.test(id);

export const getAttempt = cache(async (id: string, userId: string) => {
  if (!isAttemptId(id)) return null;

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id, userId },
    select: {
      id: true,
      category: true,
      difficulty: true,
      timeLimit: true,
      score: true,
      totalQuestions: true,
      timeTaken: true,
      answers: true,
      createdAt: true,
      completedAt: true,
    },
  });
  if (!attempt) return null;

  const answers = z.array(quizAnswerSchema).safeParse(attempt.answers);
  return { ...attempt, answers: answers.success ? answers.data : [] };
});

export type QuizAttemptData = NonNullable<Awaited<ReturnType<typeof getAttempt>>>;

export const secondsElapsed = (attempt: Pick<QuizAttemptData, "createdAt">) =>
  Math.floor((Date.now() - attempt.createdAt.getTime()) / 1000);

export const secondsLeft = (
  attempt: Pick<QuizAttemptData, "createdAt" | "timeLimit">
) =>
  attempt.timeLimit === null
    ? null
    : Math.max(0, attempt.timeLimit - secondsElapsed(attempt));
