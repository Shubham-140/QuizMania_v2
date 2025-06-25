"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const pathname = usePathname();
  const isQuizActive = /^\/quiz\/[^\/]+\/[^\/]+\/?$/.test(pathname);

  return (
    <footer
      className={`border-t mt-auto font-sans transition-colors duration-300 ${
        lightMode
          ? "bg-white/95 backdrop-blur-sm border-gray-200"
          : "bg-gray-900/95 backdrop-blur-sm border-gray-600"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Logo Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 group">
            <div
              className={`w-10 h-10 rounded-lg flex justify-center items-center text-xl font-extrabold text-white shadow-lg -rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 ${
                lightMode
                  ? "bg-emerald-500 shadow-emerald-500/30"
                  : "bg-emerald-500 shadow-emerald-500/20"
              }`}
            >
              QM
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
              QuizMania
            </span>
          </div>
          <p
            className={`leading-relaxed ${
              lightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Test your knowledge across various categories and climb the
            leaderboard!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className={`text-lg font-semibold mb-6 ${
              lightMode ? "text-emerald-600" : "text-emerald-400"
            }`}
          >
            Quick Links
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {[
              { name: "Go to Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Rules", path: "/rules" },
              { name: "Give us Feedback", path: "/feedback" },
            ].map((item) => (
              <li key={item.name}>
                {isQuizActive ? (
                  <span
                    className={`py-1.5 block ${
                      lightMode
                        ? "text-gray-500 bg-gray-100/50"
                        : "text-gray-400 bg-gray-700/50"
                    } rounded-lg px-3`}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className={`py-1.5 block no-underline ${
                      lightMode ? "text-gray-700" : "text-gray-200"
                    } hover:text-emerald-500 transition-colors duration-300 px-3`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3
            className={`text-lg font-semibold mb-6 ${
              lightMode ? "text-emerald-600" : "text-emerald-400"
            }`}
          >
            Contact
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                className={lightMode ? "text-emerald-500" : "text-emerald-400"}
              >
                ✉️
              </span>
              <span className={lightMode ? "text-gray-700" : "text-gray-200"}>
                contact@quizmania.com
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={lightMode ? "text-emerald-500" : "text-emerald-400"}
              >
                🌐
              </span>
              <span className={lightMode ? "text-gray-700" : "text-gray-200"}>
                quizmania.vercel.app
              </span>
            </div>
          </div>
        </div>

        {/* Developer Hub */}
        <div>
          <h3
            className={`text-lg font-semibold mb-6 ${
              lightMode ? "text-emerald-600" : "text-emerald-400"
            }`}
          >
            Developer Hub
          </h3>
          <div className="flex gap-4 flex-wrap">
            {/* GitHub Link */}
            {isQuizActive ? (
              <div
                className={`rounded-lg px-4 py-2 flex items-center gap-2 ${
                  lightMode
                    ? "bg-gray-100/50 text-gray-500"
                    : "bg-gray-700/50 text-gray-400"
                }`}
              >
                <span
                  className={
                    lightMode ? "text-emerald-500" : "text-emerald-400"
                  }
                >
                  💻
                </span>
                <span className="text-sm">GitHub</span>
              </div>
            ) : (
              <Link
                href="https://github.com/Shubham-140"
                className={`rounded-lg px-4 py-2 flex items-center gap-2 no-underline transition-colors duration-300 ${
                  lightMode
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
                target="_blank"
              >
                <span
                  className={
                    lightMode ? "text-emerald-500" : "text-emerald-400"
                  }
                >
                  💻
                </span>
                <span className="text-sm">GitHub</span>
              </Link>
            )}

            {/* LeetCode Link */}
            {isQuizActive ? (
              <div
                className={`rounded-lg px-4 py-2 flex items-center gap-2 ${
                  lightMode
                    ? "bg-gray-100/50 text-gray-500"
                    : "bg-gray-700/50 text-gray-400"
                }`}
              >
                <span
                  className={
                    lightMode ? "text-emerald-500" : "text-emerald-400"
                  }
                >
                  🧠
                </span>
                <span className="text-sm">LeetCode</span>
              </div>
            ) : (
              <Link
                href="https://leetcode.com/u/Shubham-140/"
                className={`rounded-lg px-4 py-2 flex items-center gap-2 no-underline transition-colors duration-300 ${
                  lightMode
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
                target="_blank"
              >
                <span
                  className={
                    lightMode ? "text-emerald-500" : "text-emerald-400"
                  }
                >
                  🧠
                </span>
                <span className="text-sm">LeetCode</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className={`border-t py-5 text-center text-sm ${
          lightMode
            ? "border-gray-200 text-gray-500"
            : "border-gray-600 text-gray-400"
        }`}
      >
        © {new Date().getFullYear()} QuizMania. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
