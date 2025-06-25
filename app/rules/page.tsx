"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";

const RulesComponent = () => {
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
        className={`w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm border relative overflow-hidden ${
          lightMode
            ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
            : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
        }`}
      >
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Quiz Rules
          </h1>
          <p
            className={`text-sm md:text-lg ${
              lightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            How to play and score points
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12">
          {/* Rule 1 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              10 Questions Per Quiz
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Each quiz consists of{" "}
              <span className="font-semibold">10 questions</span> from your
              selected category.
            </p>
          </div>

          {/* Rule 2 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              15 Second Timer
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              You have <span className="font-semibold">15 seconds</span> to
              answer each question.
            </p>
          </div>

          {/* Rule 3 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Scoring System
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Correct answers earn{" "}
              <span className="font-semibold">10 points</span> each, decreasing
              by 1 per second after 5 seconds.
            </p>
          </div>

          {/* Rule 4 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              No Penalties
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              There&apos;s <span className="font-semibold">no penalty</span> for
              wrong answers - only points for correct ones!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            className={`px-6 md:px-8 py-3 md:py-4 rounded-full border-none bg-emerald-500 text-white font-semibold text-base md:text-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              lightMode
                ? "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                : "shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            }`}
            onClick={() => router.push("/")}
          >
            Got It - Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesComponent;
