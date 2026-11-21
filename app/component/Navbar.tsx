"use client";

import { ExitConfirmationOverlay } from "./ExitConfirmationOverlay";
import ProfileDropdown from "./ProfileDropdown";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "./ThemeProvider";
import { isQuizInProgress } from "@/lib/quizRoutes";

const navItems = ["Home", "About", "Rules", "Feedback"] as const;

const ctaDesktop =
  "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-600 hover:shadow-emerald-500/35 dark:bg-emerald-600 dark:shadow-emerald-500/20 dark:hover:bg-emerald-700 dark:hover:shadow-emerald-500/30";
const menuBar =
  "h-0.5 w-5 rounded-full bg-gray-800 dark:bg-gray-100";

const drawerItem =
  "mx-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200";
const drawerItemIdle =
  "text-slate-700 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800";
const drawerItemActive =
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

const navIcons: Record<(typeof navItems)[number], string> = {
  Home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  About: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  Rules:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  Feedback:
    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
};

const accountIcons = {
  profile:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  settings:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  logout:
    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
};

function MenuIcon({ path }: { path: string }) {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

function MenuSection({ title }: { title: string }) {
  return (
    <div className="px-5 pt-4 pb-2">
      <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
        {title}
      </h3>
      <div className="h-px bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

function ThemeIcon({ size }: { size: string }) {
  return (
    <>
      <svg
        className={`${size} text-amber-500 dark:hidden`}
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
      <svg
        className={`hidden ${size} text-indigo-400 dark:block`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </>
  );
}

function UserIcon({ size }: { size: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

const Navbar = () => {
  const { lightMode, toggleMode } = useTheme();
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const closeProfileDropdown = useCallback(
    () => setShowProfileDropdown(false),
    []
  );
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isQuizActive = isQuizInProgress(pathname);
  const authReady = status !== "loading";

  const getUserInitial = () => {
    if (!session?.user) return "U";
    return (
      session.user.name?.charAt(0).toUpperCase() ||
      session.user.username?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navHref = (item: string) =>
    `/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`;

  return (
    <>
      <nav className="sticky top-0 z-[1000] h-[clamp(52px,5.5vw,64px)] border-b border-slate-200 bg-white/95 shadow-lg shadow-black/5 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95 dark:shadow-black/30">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 md:px-10">
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
              className="group relative hidden h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-gray-100 shadow-sm md:flex transition-all duration-300 hover:scale-105 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              <div className="relative h-5 w-5 transition-transform duration-500 group-hover:rotate-180">
                <ThemeIcon size="h-5 w-5" />
              </div>
            </button>

            <div className="relative hidden h-12 min-w-[48px] items-center md:flex">
              {!authReady ? (
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
              ) : session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-lg font-bold ${ctaDesktop}`}
                    aria-label="Account menu"
                    aria-haspopup="true"
                    aria-expanded={showProfileDropdown}
                    aria-controls="profile-menu"
                  >
                    {getUserInitial()}
                  </button>
                  {showProfileDropdown && (
                    <ProfileDropdown onClose={closeProfileDropdown} />
                  )}
                </div>
              ) : (
                <Link href="/login" className="group relative no-underline">
                  <div
                    className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[clamp(14px,1.8vw,16px)] font-semibold ${ctaDesktop}`}
                  >
                    <UserIcon size="h-4 w-4" />
                    Login
                  </div>
                </Link>
              )}
            </div>

            <button
              className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={menuBar} />
              <span className={menuBar} />
              <span className={menuBar} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 bottom-0 top-[clamp(52px,5.5vw,64px)] z-[999] md:hidden ${
          mobileMenuOpen ? "" : "pointer-events-none"
        }`}
        inert={!mobileMenuOpen}
      >
        <div
          aria-hidden
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          id="mobile-menu"
          aria-label="Site navigation"
          className={`absolute top-0 right-0 flex h-full w-[85%] max-w-[280px] flex-col overflow-y-auto overscroll-contain border-l border-slate-200 bg-slate-50 shadow-[-8px_0_24px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out dark:border-slate-700 dark:bg-slate-900 dark:shadow-[-8px_0_24px_rgba(0,0,0,0.3)] ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            type="button"
            role="switch"
            aria-checked={!lightMode}
            onClick={toggleMode}
            className="mx-3 mt-4 mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-transform duration-200 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              <ThemeIcon size="h-5 w-5" />
              Dark Mode
            </span>
            <span className="relative h-5 w-9 rounded-full bg-slate-300 transition-colors duration-300 dark:bg-emerald-500/40">
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 dark:bg-emerald-400 ${
                  lightMode ? "" : "translate-x-4"
                }`}
              />
            </span>
          </button>

          <MenuSection title="Navigation" />
          {navItems.map((item) =>
            isQuizActive ? (
              <span
                key={item}
                className={`${drawerItem} cursor-not-allowed text-slate-400 dark:text-slate-500`}
              >
                <MenuIcon path={navIcons[item]} />
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={navHref(item)}
                onClick={closeMobileMenu}
                aria-current={pathname === navHref(item) ? "page" : undefined}
                className={`${drawerItem} ${
                  pathname === navHref(item) ? drawerItemActive : drawerItemIdle
                }`}
              >
                <MenuIcon path={navIcons[item]} />
                {item}
              </Link>
            )
          )}

          {!authReady ? (
            <div className="mx-5 mt-6 h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ) : session?.user ? (
            <>
              <MenuSection title="Account" />
              {[
                { label: "My Profile", href: `/user/${session.user.username}`, icon: accountIcons.profile },
                { label: "Settings", href: "/settings", icon: accountIcons.settings },
              ].map(({ label, href, icon }) =>
                isQuizActive ? (
                  <span
                    key={label}
                    className={`${drawerItem} cursor-not-allowed text-slate-400 dark:text-slate-500`}
                  >
                    <MenuIcon path={icon} />
                    {label}
                  </span>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    onClick={closeMobileMenu}
                    aria-current={pathname === href ? "page" : undefined}
                    className={`${drawerItem} ${
                      pathname === href ? drawerItemActive : drawerItemIdle
                    }`}
                  >
                    <MenuIcon path={icon} />
                    {label}
                  </Link>
                )
              )}
              <button
                type="button"
                onClick={() => signOut()}
                className={`${drawerItem} text-left text-slate-700 hover:bg-red-50 hover:text-red-600 dark:text-slate-200 dark:hover:bg-red-500/10 dark:hover:text-red-400`}
              >
                <MenuIcon path={accountIcons.logout} />
                Logout
              </button>
            </>
          ) : (
            <div className="mt-auto p-4">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-colors duration-300 hover:bg-emerald-600 dark:bg-emerald-600 dark:shadow-emerald-500/20 dark:hover:bg-emerald-700"
              >
                <UserIcon size="h-4 w-4" />
                Login
              </Link>
            </div>
          )}
        </aside>
      </div>

      {showExitOverlay && (
        <ExitConfirmationOverlay setShowExitOverlay={setShowExitOverlay} />
      )}
    </>
  );
};

export default Navbar;
