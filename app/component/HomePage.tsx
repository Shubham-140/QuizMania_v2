"use client";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CountdownOverlay } from "./CountdownOverlay";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const lightMode: boolean = useSelector(
    (state: RootState) => state.mode.lightMode
  );
  const [difficulty, setDifficulty] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [selectCategoryWarning, setSelectCategoryWarning] = useState(false);
  const [selectDifficultyWarning, setSelectDifficultyWarning] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        className={`flex justify-center items-center min-h-screen p-4 font-sans transition-all duration-300 ${
          lightMode
            ? "bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200"
            : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
        }`}
      >
        <div
          className={`w-full max-w-2xl min-w-[280px] mx-auto rounded-2xl shadow-xl p-6 md:p-12 text-center transition-all duration-300 backdrop-blur-sm ${
            lightMode
              ? "bg-white/95 border border-gray-200 shadow-black/5"
              : "bg-gray-800/95 border border-gray-600 shadow-black/30"
          }`}
        >
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

          {/* Logo and Title */}
          <div className="relative mb-8 md:mb-12">
            <div
              className={`w-16 h-16 md:w-24 md:h-24 mx-auto rounded-xl flex justify-center items-center text-3xl md:text-4xl font-extrabold text-white -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-105 ${
                lightMode
                  ? "bg-emerald-500 shadow-emerald-500/30"
                  : "bg-emerald-500 shadow-emerald-500/20"
              }`}
            >
              QM
            </div>
            <h1
              className={`mt-4 md:mt-6 text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent leading-tight tracking-tight`}
            >
              QuizMania
            </h1>
            <p
              className={`mt-2 md:mt-3 text-sm md:text-base ${
                lightMode ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Test your knowledge across various categories
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-8 md:mb-10 text-left">
            <h2
              className={`mb-4 text-xs md:text-sm font-semibold uppercase tracking-wider ${
                lightMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Select Category
            </h2>
            <select
              className={`w-full p-4 rounded-xl cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:12px_auto] transition-all duration-300 ${
                lightMode
                  ? "bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                  : "bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900"
              } ${
                selectCategoryWarning
                  ? `border-${lightMode ? "red-500" : "red-600"} animate-shake`
                  : ""
              }`}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">Select a category</option>
              <option value="general_knowledge">General Knowledge</option>
              <option value="film">Movies & Film</option>
              <option value="music">Music</option>
              <option value="science">Science</option>
              <option value="arts_and_literature">Arts & Literature</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
              <option value="society_and_culture">Society & Culture</option>
              <option value="food_and_drink">Food & Drink</option>
              <option value="sports">Sports</option>
            </select>

            {selectCategoryWarning && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center gap-3 animate-shake ${
                  lightMode
                    ? "bg-red-50 border-l-4 border-red-500"
                    : "bg-red-900 border-l-4 border-red-600"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={lightMode ? "#ef4444" : "#fca5a5"}
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span
                  className={`text-sm font-semibold ${
                    lightMode ? "text-red-500" : "text-red-300"
                  }`}
                >
                  Please select a category to continue
                </span>
              </div>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8 md:mb-10 text-left">
            <h2
              className={`mb-4 text-xs md:text-sm font-semibold uppercase tracking-wider ${
                lightMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Select Difficulty
            </h2>
            <div className="flex justify-center gap-4 md:gap-5 mb-6 flex-wrap">
              <button
                className={`px-6 md:px-8 py-3 md:py-4 rounded-full cursor-pointer text-white font-semibold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 ${
                  difficulty === "easy" ? "bg-emerald-600" : "bg-emerald-500"
                } ${
                  lightMode
                    ? "shadow-emerald-500/30 hover:shadow-emerald-600/40"
                    : "shadow-emerald-500/20 hover:shadow-emerald-600/30"
                } shadow-lg hover:shadow-xl`}
                onClick={() => setDifficulty("easy")}
              >
                Easy {difficulty === "easy" && "✓"}
              </button>
              <button
                className={`px-6 md:px-8 py-3 md:py-4 rounded-full cursor-pointer text-white font-semibold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 ${
                  difficulty === "medium" ? "bg-amber-600" : "bg-amber-500"
                } ${
                  lightMode
                    ? "shadow-amber-500/30 hover:shadow-amber-600/40"
                    : "shadow-amber-500/20 hover:shadow-amber-600/30"
                } shadow-lg hover:shadow-xl`}
                onClick={() => setDifficulty("medium")}
              >
                Medium {difficulty === "medium" && "✓"}
              </button>
              <button
                className={`px-6 md:px-8 py-3 md:py-4 rounded-full cursor-pointer text-white font-semibold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 ${
                  difficulty === "hard" ? "bg-red-600" : "bg-red-500"
                } ${
                  lightMode
                    ? "shadow-red-500/30 hover:shadow-red-600/40"
                    : "shadow-red-500/20 hover:shadow-red-600/30"
                } shadow-lg hover:shadow-xl`}
                onClick={() => setDifficulty("hard")}
              >
                Hard {difficulty === "hard" && "✓"}
              </button>
            </div>

            {selectDifficultyWarning && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center gap-3 animate-shake ${
                  lightMode
                    ? "bg-red-50 border-l-4 border-red-500"
                    : "bg-red-900 border-l-4 border-red-600"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={lightMode ? "#ef4444" : "#fca5a5"}
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span
                  className={`text-sm font-semibold ${
                    lightMode ? "text-red-500" : "text-red-300"
                  }`}
                >
                  Please select a difficulty level to continue
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 md:gap-5 mt-8 md:mt-10">
            <button
              className={`w-full py-4 md:py-5 cursor-pointer rounded-xl text-white font-semibold text-lg md:text-xl transition-all duration-300 hover:-translate-y-1 ${
                lightMode
                  ? "bg-emerald-500 shadow-emerald-500/30 hover:shadow-emerald-600/40"
                  : "bg-emerald-500 shadow-emerald-500/20 hover:shadow-emerald-600/30"
              } shadow-lg hover:shadow-xl`}
              onClick={() => {
                if (category === "") {
                  setSelectCategoryWarning(true);
                  setTimeout(() => {
                    setSelectCategoryWarning(false);
                  }, 1000);
                  return;
                } else if (difficulty === "") {
                  setSelectDifficultyWarning(true);
                  setTimeout(() => {
                    setSelectDifficultyWarning(false);
                  }, 1000);
                  return;
                }
                setShowCountdown(true);
              }}
            >
              Start Quiz
            </button>
            <div className="flex gap-4 md:gap-5 w-full">
              <button
                className={`flex-1 py-3 cursor-pointer md:py-4 rounded-xl border-2 font-semibold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 ${
                  lightMode
                    ? "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                    : "border-emerald-500 text-emerald-400 hover:bg-emerald-900"
                }`}
                onClick={() => router.push("/rules")}
              >
                Rules
              </button>
              <button
                className={`flex-1 cursor-pointer py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 hover:-translate-y-1 ${
                  lightMode
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-700"
                }`}
                onClick={() => router.push("/settings")}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      {showCountdown && (
        <CountdownOverlay category={category} difficulty={difficulty} />
      )}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-4px);
          }
          40%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default HomePage;
