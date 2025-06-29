"use client";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../features/color/colorSlice";
import { ExitConfirmationOverlay } from "./ExitConfirmationOverlay";
import ProfileDropdown from "./ProfileDropwdown";
import { useState, useEffect } from "react";
import { RootState } from "../store/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const dispatch = useDispatch();
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const pathname = usePathname();
  const isQuizActive = /^\/quiz\/[^\/]+\/[^\/]+\/?$/.test(pathname);

  const getUserInitial = () => {
    if (!session?.user) return "U";
    return (
      session.user.name?.charAt(0).toUpperCase() ||
      session.user.username?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  return (
    <nav
      className={`sticky top-0 z-[1000] flex h-[clamp(52px,5.5vw,64px)] items-center justify-between px-[clamp(16px,5vw,40px)] font-sans transition-colors duration-300 ${
        lightMode
          ? "bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-lg shadow-black/5"
          : "bg-slate-900/95 backdrop-blur-sm border-b border-slate-600 shadow-lg shadow-black/30"
      }`}
    >
      {/* Left - Logo */}
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
        <div
          className={`flex h-[clamp(32px,4.8vw,40px)] w-[clamp(32px,4.8vw,40px)] items-center justify-center rounded-xl text-white font-extrabold text-[clamp(14px,2.4vw,18px)] shadow-lg -rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 ${
            lightMode
              ? "bg-emerald-500 shadow-emerald-500/30"
              : "bg-emerald-500 shadow-emerald-500/20"
          }`}
        >
          QM
        </div>
        <h1
          className={`m-0 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text font-extrabold tracking-tight text-transparent text-[clamp(18px,2.6vw,22px)]`}
        >
          QuizMania
        </h1>
      </Link>

      {/* Center - Navigation Links (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center gap-8">
          {["Home", "About", "Rules", "Feedback"].map((item) =>
            isQuizActive ? (
              <span
                key={item}
                className={`py-2 px-4 rounded-lg font-semibold text-[clamp(14px,1.8vw,16px)] transition-colors duration-300 ${
                  lightMode
                    ? "text-gray-500 bg-gray-100/50"
                    : "text-gray-400 bg-gray-700/50"
                }`}
              >
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={`/${
                  item.toLowerCase() === "home" ? "" : item.toLowerCase()
                }`}
                className="group relative py-2 px-4 no-underline"
              >
                <span
                  className={`font-semibold text-[clamp(14px,1.8vw,16px)] transition-colors duration-300 ${
                    lightMode ? "text-gray-700" : "text-gray-200"
                  } group-hover:text-emerald-500`}
                >
                  {item}
                </span>
                <span
                  className={`absolute bottom-1 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full`}
                ></span>
              </Link>
            )
          )}
        </div>
      )}

      {/* Right - Theme Toggle and Login/Profile */}
      <div className="z-[1001] flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleMode())}
          className={`group cursor-pointer relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105 ${
            lightMode
              ? "bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm"
              : "bg-gray-800 hover:bg-gray-700 border border-gray-700 shadow-sm"
          }`}
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5 transition-transform duration-500 group-hover:rotate-180">
            {lightMode ? (
              <svg
                className="w-5 h-5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </div>
        </button>

        {/* Login/Profile Button (Desktop only) */}
        {!isMobile && (
          <>
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`group cursor-pointer relative flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 ${
                    lightMode
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:shadow-emerald-500/35"
                      : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-emerald-500/30"
                  } hover:-translate-y-0.5`}
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
                <div
                  className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 font-semibold text-[clamp(14px,1.8vw,16px)] transition-all duration-300 ${
                    lightMode
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:shadow-emerald-500/35"
                      : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-emerald-500/30"
                  } hover:-translate-y-0.5 hover:scale-105`}
                >
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
          </>
        )}

        {/* Hamburger Menu (Mobile only) */}
        {isMobile && (
          <button
            className={`ml-1 flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-300 ${
              lightMode
                ? "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <div
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                lightMode ? "bg-gray-800" : "bg-gray-100"
              } ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <div
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                lightMode ? "bg-gray-800" : "bg-gray-100"
              } ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <div
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                lightMode ? "bg-gray-800" : "bg-gray-100"
              } ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
            lightMode
              ? "bg-white/95 backdrop-blur-sm"
              : "bg-slate-900/95 backdrop-blur-sm"
          } ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ transition: "opacity 300ms ease" }}
        >
          {/* Theme Toggle in Mobile Menu */}
          <button
            onClick={() => dispatch(toggleMode())}
            className={`group flex items-center gap-3 rounded-xl px-6 py-3 transition-all duration-300 ${
              lightMode
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200"
            }`}
          >
            <div className="w-6 h-6 transition-transform duration-500 group-hover:rotate-180">
              {lightMode ? (
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </div>
            <span className="text-lg font-semibold">
              {lightMode ? "Dark Mode" : "Light Mode"}
            </span>
          </button>

          {["Home", "About", "Rules", "Feedback"].map((item) =>
            isQuizActive ? (
              <span
                key={item}
                className={`text-xl font-semibold px-8 py-4 rounded-xl ${
                  lightMode
                    ? "text-gray-500 bg-gray-100/50"
                    : "text-gray-400 bg-gray-700/50"
                }`}
              >
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={`/${
                  item.toLowerCase() === "home" ? "" : item.toLowerCase()
                }`}
                className="group relative px-8 py-4 no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span
                  className={`text-xl font-semibold transition-colors duration-300 ${
                    lightMode ? "text-gray-700" : "text-gray-200"
                  } group-hover:text-emerald-500`}
                >
                  {item}
                </span>
                <span
                  className={`absolute bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-emerald-500 transition-all duration-300 group-hover:w-4/5`}
                ></span>
              </Link>
            )
          )}

          {/* Login/Profile Button in Mobile Menu */}
          {session?.user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
                lightMode
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
                  : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 font-bold">
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
              <div
                className={`flex items-center gap-3 rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
                  lightMode
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
                    : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                }`}
              >
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
      )}

      {showExitOverlay && (
        <ExitConfirmationOverlay setShowExitOverlay={setShowExitOverlay} />
      )}
    </nav>
  );
};

export default Navbar;