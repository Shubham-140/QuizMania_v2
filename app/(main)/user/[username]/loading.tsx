import { LoadingStatus, Skeleton } from "@/app/component/Skeleton";
import { RecentQuizzesSkeleton } from "./RecentQuizzes";

const panel = "p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50";

export default function ProfileLoading() {
  return (
    <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-start">
      <LoadingStatus label="Loading profile" />
      <div className="card w-full max-w-4xl rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
          <div className="flex-1 w-full">
            <Skeleton className="h-9 w-56 mb-2" />
            <Skeleton className="h-5 w-32 mb-6" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((card) => (
            <div key={card} className={panel}>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 ${panel}`}>
          <Skeleton className="h-6 w-36 mb-4" />
          <RecentQuizzesSkeleton />
        </div>
      </div>
    </div>
  );
}
