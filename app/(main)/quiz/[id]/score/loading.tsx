import { LoadingStatus, Skeleton } from "@/app/component/Skeleton";

export default function ScoreLoading() {
  return (
    <div className="page-bg-soft min-h-screen p-4 flex justify-center items-center">
      <LoadingStatus label="Loading your score" />
      <div className="card-soft w-full max-w-[min(800px,95vw)] rounded-[clamp(1rem,3vw,1.5rem)] p-[clamp(1rem,3vw,2rem)] relative overflow-hidden">
        <div className="accent-bar" />

        <div className="flex flex-col items-center gap-2 mb-[clamp(1rem,3vw,2rem)]">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-44" />
        </div>

        <Skeleton className="h-32 w-full mb-[clamp(1rem,3vw,2rem)] rounded-[clamp(0.75rem,2vw,1rem)]" />

        <div className="grid grid-cols-3 gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
          {[0, 1, 2].map((stat) => (
            <Skeleton key={stat} className="h-20 w-full" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)]">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
