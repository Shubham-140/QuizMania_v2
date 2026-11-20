import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/authOptions";
import { getAttempt, secondsLeft } from "@/lib/quizAttempts";
import QuizPlayer from "./QuizPlayer";

export const metadata: Metadata = {
  title: "Quiz | QuizMania",
};

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();

  const attempt = await getAttempt(id, session.user.id);
  if (!attempt) notFound();
  if (attempt.status !== "IN_PROGRESS") redirect(`/quiz/${attempt.id}/score`);

  return (
    <QuizPlayer
      attemptId={attempt.id}
      questions={attempt.answers.map(({ question, options }) => ({
        question,
        options,
      }))}
      initialSelected={attempt.answers.map((answer) => answer.selectedIndex)}
      secondsLeft={secondsLeft(attempt)}
    />
  );
}
