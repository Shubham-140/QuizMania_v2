"use client";

import { ExitConfirmationOverlay } from "./ExitConfirmationOverlay";
import ProfileDropdown from "./ProfileDropwdown";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "./ThemeProvider";

const navItems = ["Home", "About", "Rules", "Feedback"] as const;

const Navbar = () => {
  const { lightMode, toggleMode } = useTheme();
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isQuizActive = /^\/quiz\/[^/]+\/[^/]+\/?$/.test(pathname);
  const authReady = status !== "loading";

  const getUserInitial = () => {
    if (!session?.user) return "U";
    return (
      session.user.name?.charAt(0).toUpperCase() ||
      session.user.username?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const navHref = (item: string) =>
    `/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`;

  return (
    <nav className="sticky top-0 z-[1000] flex h-[clamp(52px,5.5vw,64px)] items-center justify-between border-b border-slate-200 bg-white/95 px-[clamp(16px,5vw,40px)] font-sans shadow-lg shadow-black/5 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95 dark:shadow-black/30">
      <Link
        href="/"
        className="z-[1001] flex items-center gap-3 no-underline group"
        onClick={(e) => {
          if (isQuizActive) {
            e.preventDefault();
            setShowExitOverlay(true);
          }
        }}
      >
        <div className="flex h-[clamp(32px,4.8vw,40px)] w-[clamp(32px,4.8vw,40px)] items-center justify-center rounded-xl bg-emerald-500 text-[clamp(14px,2.4vw,18px)] font-extrabold text-white shadow-lg shadow-emerald-500/30 -rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 dark:shadow-emerald-500/20">
          QM
        </div>
        <h1 className="m-0 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-[clamp(18px,2.6vw,22px)] font-extrabold tracking-tight text-transparent">
          QuizMania
        </h1>
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) =>
          isQuizActive ? (
            <span
              key={item}
              className="rounded-lg bg-gray-100/50 px-4 py-2 text-[clamp(14px,1.8vw,16px)] font-semibold text-gray-500 dark:bg-gray-700/50 dark:text-gray-400"
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={navHref(item)}
              className="group relative px-4 py-2 no-underline"
            >
              <span className="text-[clamp(14px,1.8vw,16px)] font-semibold text-gray-700 transition-colors duration-300 group-hover:text-emerald-500 dark:text-gray-200">
                {item}
              </span>
              <span className="absolute bottom-1 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          )
        )}
      </div>

      <div className="z-[1001] flex items-center gap-3">
        <button
          onClick={toggleMode}
          className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-gray-100 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          <div className="relative h-5 w-5 transition-transform duration-500 group-hover:rotate-180">
            {/* Sun: only in light mode (no .dark on html) */}
            <svg
              className="h-5 w-5 text-amber-500 dark:hidden"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
            {/* Moon: only in dark mode */}
            <svg
              className="hidden h-5 w-5 text-indigo-400 dark:block"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
        </button>

        {/* Desktop auth — reserve space while session hydrates */}
        <div className="relative hidden h-12 min-w-[48px] items-center md:flex">
          {!authReady ? (
            <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-600 hover:shadow-emerald-500/35 dark:bg-emerald-600 dark:shadow-emerald-500/20 dark:hover:bg-emerald-700 dark:hover:shadow-emerald-500/30"
                title={`Go to ${
                  session.user.name || session.user.username || "User"
                }'s profile`}
              >
                {getUserInitial()}
              </button>
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          ) : (
            <Link href="/login" className="group relative no-underline">
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-[clamp(14px,1.8vw,16px)] font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-600 hover:shadow-emerald-500/35 dark:bg-emerald-600 dark:shadow-emerald-500/20 dark:hover:bg-emerald-700 dark:hover:shadow-emerald-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login
              </div>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-1 flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 transition-all duration-300 hover:bg-gray-200 md:hidden dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <div
            className={`h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-300 dark:bg-gray-100 ${
              mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <div
            className={`h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-300 dark:bg-gray-100 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-300 dark:bg-gray-100 ${
              mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-sm transition-opacity duration-300 md:hidden dark:bg-slate-900/95 ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          onClick={toggleMode}
          className="group flex items-center gap-3 rounded-xl bg-gray-100 px-6 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <div className="h-6 w-6 transition-transform duration-500 group-hover:rotate-180">
            <svg
              className="h-6 w-6 text-amber-500 dark:hidden"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              className="hidden h-6 w-6 text-indigo-400 dark:block"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
          <span className="text-lg font-semibold">
            {lightMode ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

        {navItems.map((item) =>
          isQuizActive ? (
            <span
              key={item}
              className="rounded-xl bg-gray-100/50 px-8 py-4 text-xl font-semibold text-gray-500 dark:bg-gray-700/50 dark:text-gray-400"
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={navHref(item)}
              className="group relative px-8 py-4 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-xl font-semibold text-gray-700 transition-colors duration-300 group-hover:text-emerald-500 dark:text-gray-200">
                {item}
              </span>
              <span className="absolute bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-emerald-500 transition-all duration-300 group-hover:w-4/5" />
            </Link>
          )
        )}

        {!authReady ? (
          <div className="h-14 w-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        ) : session?.user ? (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-600 dark:bg-emerald-600 dark:shadow-emerald-500/20 dark:hover:bg-emerald-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold">
              {getUserInitial()}
            </div>
            Profile
          </button>
        ) : (
          <Link
            href="/login"
            className="group relative no-underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-600 dark:bg-emerald-600 dark:shadow-emerald-500/20 dark:hover:bg-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Login
            </div>
          </Link>
        )}
      </div>

      {showExitOverlay && (
        <ExitConfirmationOverlay setShowExitOverlay={setShowExitOverlay} />
      )}
    </nav>
  );
};

export default Navbar;
