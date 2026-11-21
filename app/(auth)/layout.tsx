import Link from "next/link";

export default function AuthGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="page-bg relative min-h-screen">
      <header className="px-4 pt-4 md:absolute md:top-6 md:left-6 md:z-10 md:p-0">
        <Link
          href="/"
          aria-label="QuizMania home"
          className="group inline-flex items-center gap-2 rounded-xl p-1"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/30 -rotate-6 transition-transform duration-300 group-hover:rotate-0 dark:shadow-emerald-500/20">
            QM
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
            QuizMania
          </span>
        </Link>
      </header>
      {children}
    </div>
  );
}
