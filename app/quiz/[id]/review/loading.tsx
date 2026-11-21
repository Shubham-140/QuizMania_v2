import { LoadingStatus, Skeleton } from "../../../component/Skeleton";

export default function ReviewLoading() {
  return (
    <div className="quiz-bg min-h-screen p-4">
      <LoadingStatus label="Loading quiz review" />
      <div className="max-w-4xl mx-auto">
        <div className="quiz-card p-6 mb-6">
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="space-y-6">
          {[0, 1].map((question) => (
            <div key={question} className="quiz-card p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <div className="grid gap-3">
                {[0, 1, 2, 3].map((option) => (
                  <Skeleton key={option} className="h-[60px] w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
