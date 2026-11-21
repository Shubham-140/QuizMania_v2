import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getActiveAttempt } from "@/lib/quizAttempts";
import { categories } from "@/lib/quizOptions";

const formatTimeLeft = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default async function ContinueQuizBanner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const attempt = await getActiveAttempt(session.user.id);
  if (!attempt) return null;

  const label =
    categories.find((category) => category.value === attempt.category)
      ?.label ?? attempt.category;

  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left sm:flex-row dark:border-emerald-700/50 dark:bg-emerald-900/30">
      <p className="text-sm text-emerald-800 dark:text-emerald-200">
        You have an unfinished <span className="font-semibold">{label}</span>{" "}
        quiz
        {attempt.secondsLeft !== null &&
          ` with ${formatTimeLeft(attempt.secondsLeft)} left`}
        .
      </p>
      <Link
        href={`/quiz/${attempt.id}`}
        className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        Continue quiz
      </Link>
    </div>
  );
}
