import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { categories, difficulties } from "@/lib/quizOptions";
import type { QuizAnswer } from "@/lib/quizAttempts";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const categoryValues = categories.map((category) => category.value) as [
  string,
  ...string[],
];

const startQuizSchema = z.object({
  category: z.enum(categoryValues),
  difficulty: z.enum(difficulties),
  numberOfQuestions: z.number().int().min(1).max(20),
  timeLimit: z.number().int().min(10).max(3600).nullable(),
});

const triviaSchema = z.array(
  z.object({
    question: z.string().min(1),
    correctAnswer: z.string().min(1),
    incorrectAnswers: z.array(z.string().min(1)).min(1),
  })
);

const shuffle = <T,>(items: T[]) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

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

  const parsed = startQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { category, difficulty, numberOfQuestions, timeLimit } = parsed.data;

  let answers: QuizAnswer[];
  try {
    const response = await fetch(
      `https://the-trivia-api.com/api/questions?categories=${category}&limit=${numberOfQuestions}&difficulty=${difficulty}`,
      { cache: "no-store" }
    );
    const trivia = triviaSchema.parse(await response.json());
    answers = trivia.map((item) => {
      const options = shuffle([item.correctAnswer, ...item.incorrectAnswers]);
      return {
        question: item.question,
        options,
        correctIndex: options.indexOf(item.correctAnswer),
        selectedIndex: null,
      };
    });
  } catch (error) {
    console.error("Trivia fetch error:", error);
    return NextResponse.json(
      { error: "Couldn't load questions. Please try again." },
      { status: 502 }
    );
  }

  if (answers.length === 0) {
    return NextResponse.json(
      { error: "No questions found. Try another category." },
      { status: 404 }
    );
  }

  try {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        category,
        difficulty,
        timeLimit,
        expiresAt:
          timeLimit === null ? null : new Date(Date.now() + timeLimit * 1000),
        totalQuestions: answers.length,
        answers,
      },
      select: { id: true },
    });
    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Create quiz attempt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
