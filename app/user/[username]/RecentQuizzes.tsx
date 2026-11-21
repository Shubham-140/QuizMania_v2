import { getRecentAttempts } from "@/lib/users";
import { LoadingStatus, Skeleton } from "../../component/Skeleton";

const mutedText = "text-gray-500 dark:text-gray-400";
const accentText = "text-emerald-600 dark:text-emerald-400";

const formatCategory = (category: string) =>
  category
    .split("_")
    .map((word) =>
      word === "and" ? "&" : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
};

export default async function RecentQuizzes({
  username,
}: {
  username: string;
}) {
  const attempts = await getRecentAttempts(username);

  if (attempts.length === 0) {
    return <p className={mutedText}>No quizzes attempted yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {attempts.map((result) => {
        const percent = Math.round((result.score / result.totalQuestions) * 100);
        return (
          <li
            key={result.id}
            className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-700"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatCategory(result.category)}
              </p>
              <p className={`text-sm capitalize ${mutedText}`}>
                {result.difficulty} · {formatDuration(result.timeTaken)} ·{" "}
                {result.completedAt?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${accentText}`}>
                {result.score}/{result.totalQuestions}
              </p>
              <p className={`text-xs ${mutedText}`}>{percent}%</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function RecentQuizzesSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingStatus label="Loading recent quizzes" />
      {[0, 1, 2].map((row) => (
        <Skeleton key={row} className="h-[62px] w-full" />
      ))}
    </div>
  );
}
