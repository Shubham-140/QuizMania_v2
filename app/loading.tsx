export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  );
}
