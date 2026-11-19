import type { ReactNode } from "react";
import GitHubSignInButton from "./GitHubSignInButton";

type Feature = {
  label: string;
  icon: ReactNode;
};

type Props = {
  heroTitle: string;
  heroText: string;
  features: Feature[];
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({
  heroTitle,
  heroText,
  features,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="page-bg min-h-screen flex">
      <div className="hidden md:flex md:w-2/5 items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-emerald-100 via-emerald-200 to-blue-200 dark:from-emerald-800 dark:via-emerald-700 dark:to-blue-700">
        <div className="absolute top-20 left-20 w-16 h-16 rounded-2xl rotate-45 animate-bounce delay-1000 bg-emerald-200/50 dark:bg-emerald-600/30"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 rounded-full animate-pulse delay-500 bg-blue-200/50 dark:bg-blue-600/30"></div>
        <div className="absolute top-1/3 right-10 w-8 h-8 rounded-lg rotate-12 animate-bounce delay-700 bg-emerald-300/50 dark:bg-emerald-500/30"></div>

        <div className="text-center p-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
            {heroTitle}
          </h1>
          <p className="text-lg mb-8 max-w-md mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
            {heroText}
          </p>

          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            {features.map(({ label, icon }) => (
              <div
                key={label}
                className="hover-lift p-4 rounded-2xl border bg-white/80 border-slate-200 hover:shadow-lg hover:shadow-black/5 dark:bg-slate-900/80 dark:border-slate-600 dark:hover:shadow-black/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    {icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-8">
        <div className="card w-full max-w-lg rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="accent-bar"></div>

          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-gradient text-2xl md:text-3xl font-extrabold mb-2">
              {title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          <div className="mb-6">
            <GitHubSignInButton />
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-sm bg-white/95 text-gray-500 dark:bg-slate-900/95 dark:text-gray-400">
                Or continue with credentials
              </span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
