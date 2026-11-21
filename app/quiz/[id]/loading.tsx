import { LoadingStatus, Skeleton } from "../../component/Skeleton";

export default function QuizLoading() {
  return (
    <div className="quiz-bg min-h-[calc(100vh-56px)] p-4 flex justify-center items-center">
      <LoadingStatus label="Loading quiz" />
      <div className="w-full max-w-4xl h-[calc(100vh-56px)] flex flex-col justify-between gap-4">
        <div className="quiz-card relative p-6 md:p-8 h-full flex flex-col overflow-hidden">
          <div className="accent-bar" />

          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          <Skeleton className="h-7 w-3/4 mb-6" />

          <div className="grid gap-3 mb-6">
            {[0, 1, 2, 3].map((option) => (
              <Skeleton key={option} className="h-[60px] w-full rounded-xl" />
            ))}
          </div>

          <div className="mt-auto flex justify-between gap-4 pt-4">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
