"use client";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const router = useRouter();

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center items-center font-sans ${
        lightMode
          ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
          : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm border relative overflow-hidden text-center ${
          lightMode
            ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
            : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
        }`}
      >
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex justify-center items-center mx-auto mb-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2
            className={`text-2xl md:text-4xl font-bold mb-4 ${
              lightMode ? "text-gray-900" : "text-white"
            }`}
          >
            Quiz Not Found!
          </h2>
          <p
            className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
              lightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Looks like this page took a wrong turn in the quiz maze. Don&apos;t
            worry though - there are plenty more quizzes waiting for you back at
            home!
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Suggestion 1 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Go Home
            </h3>
            <p
              className={`text-sm ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Start fresh with our quiz selection
            </p>
          </div>

          {/* Suggestion 2 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Browse Quizzes
            </h3>
            <p
              className={`text-sm ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Explore our quiz categories
            </p>
          </div>

          {/* Suggestion 3 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Random Quiz
            </h3>
            <p
              className={`text-sm ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Try a surprise challenge
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className={`px-6 md:px-8 py-3 md:py-4 rounded-full border-none bg-emerald-500 text-white font-semibold text-base md:text-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              lightMode
                ? "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                : "shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            }`}
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
