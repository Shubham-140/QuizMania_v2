import type { QuizAnswer } from "@/lib/quizAttempts";

export function scoreAttempt(
  answers: QuizAnswer[],
  selected: (number | null)[],
  elapsedSeconds: number,
  timeLimit: number | null
) {
  const scoredAnswers = answers.map((answer, i) => {
    const pick = selected[i] ?? null;
    return {
      ...answer,
      selectedIndex:
        pick !== null && pick < answer.options.length ? pick : null,
    };
  });

  return {
    answers: scoredAnswers,
    score: scoredAnswers.filter(
      (answer) => answer.selectedIndex === answer.correctIndex
    ).length,
    timeTaken:
      timeLimit === null ? elapsedSeconds : Math.min(elapsedSeconds, timeLimit),
  };
}
