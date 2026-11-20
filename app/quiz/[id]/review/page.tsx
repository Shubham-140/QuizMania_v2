import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/authOptions";
import { getAttempt, type QuizAnswer } from "@/lib/quizAttempts";

export const metadata: Metadata = {
  title: "Quiz Review | QuizMania",
};

const text = "text-gray-900 dark:text-gray-50";

const optionStyles = {
  correct: "bg-green-50 border-green-500 dark:bg-green-900/30 text-green-700",
  incorrect: "bg-red-50 border-red-500 dark:bg-red-900/30 text-red-700",
  unanswered: `bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${text} opacity-60`,
  other: `bg-gray-50 dark:bg-gray-800 ${text} opacity-40`,
};

const statusBadges = {
  correct: { label: "Correct", className: "bg-green-100 text-green-800" },
  unanswered: { label: "Not Answered", className: "bg-gray-100 text-gray-800" },
  incorrect: { label: "Incorrect", className: "bg-red-100 text-red-800" },
};

const getOptionStyle = (answer: QuizAnswer, optionIndex: number) => {
  if (answer.correctIndex === optionIndex) return optionStyles.correct;
  if (answer.selectedIndex === optionIndex) return optionStyles.incorrect;
  if (answer.selectedIndex === null) return optionStyles.unanswered;
  return optionStyles.other;
};

const getStatus = (answer: QuizAnswer) => {
  if (answer.selectedIndex === answer.correctIndex) return statusBadges.correct;
  if (answer.selectedIndex === null) return statusBadges.unanswered;
  return statusBadges.incorrect;
};

function OptionIcon({
  answer,
  optionIndex,
}: {
  answer: QuizAnswer;
  optionIndex: number;
}) {
  if (answer.correctIndex === optionIndex) {
    return (
      <svg
        className="w-5 h-5 text-green-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M20 6L9 17l-5-5" strokeWidth="2" />
      </svg>
    );
  }
  if (answer.selectedIndex === optionIndex) {
    return (
      <svg
        className="w-5 h-5 text-red-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
      </svg>
    );
  }
  return null;
}

export default async function QuizReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();

  const result = await getAttempt(id, session.user.id);
  if (!result) notFound();
  if (result.status === "IN_PROGRESS") redirect(`/quiz/${result.id}`);

  if (result.answers.length === 0) {
    return (
      <div className="quiz-bg min-h-screen p-4 flex items-center justify-center">
        <div className="quiz-card p-8">
          <div className="text-center">
            <p className={`${text} text-lg`}>No answers saved for this quiz</p>
            <p className={`${text} text-sm opacity-70 mt-2`}>
              Answer review is available for quizzes taken from now on
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="quiz-card p-6 mb-6">
          <h1 className={`text-2xl font-bold ${text}`}>Quiz Review</h1>
        </div>

        <div className="space-y-6">
          {result.answers.map((answer, questionIndex) => {
            const status = getStatus(answer);
            return (
              <div key={questionIndex} className="quiz-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-lg font-semibold ${text} flex-1 pr-4`}>
                    {questionIndex + 1}. {answer.question}
                  </h2>
                  <div
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
                  >
                    {status.label}
                  </div>
                </div>

                <div className="grid gap-3">
                  {answer.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${getOptionStyle(
                        answer,
                        optionIndex
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border font-medium text-sm">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span className="flex-1">{option}</span>
                        <OptionIcon answer={answer} optionIndex={optionIndex} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
