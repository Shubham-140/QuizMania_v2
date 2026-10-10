type PageLoaderProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function PageLoader({
  message = "Loading...",
  fullScreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-6 font-sans ${
        fullScreen ? "min-h-[70vh]" : "py-16"
      } bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-900/50" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500" />
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
}
