"use client";
import { useState } from "react";
import { CountdownOverlay } from "./CountdownOverlay";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const categories = [
  { value: "general_knowledge", label: "General Knowledge" },
  { value: "film", label: "Movies & Film" },
  { value: "music", label: "Music" },
  { value: "science", label: "Science" },
  { value: "arts_and_literature", label: "Arts & Literature" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "society_and_culture", label: "Society & Culture" },
  { value: "food_and_drink", label: "Food & Drink" },
  { value: "sports", label: "Sports" },
];

const difficulties = [
  {
    value: "easy",
    label: "Easy",
    idle: "bg-emerald-500",
    active: "bg-emerald-600",
    shadow:
      "shadow-emerald-500/30 hover:shadow-emerald-600/40 dark:shadow-emerald-500/20 dark:hover:shadow-emerald-600/30",
  },
  {
    value: "medium",
    label: "Medium",
    idle: "bg-amber-500",
    active: "bg-amber-600",
    shadow:
      "shadow-amber-500/30 hover:shadow-amber-600/40 dark:shadow-amber-500/20 dark:hover:shadow-amber-600/30",
  },
  {
    value: "hard",
    label: "Hard",
    idle: "bg-red-500",
    active: "bg-red-600",
    shadow:
      "shadow-red-500/30 hover:shadow-red-600/40 dark:shadow-red-500/20 dark:hover:shadow-red-600/30",
  },
];

const sectionTitle =
  "mb-4 text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";

function Warning({ message }: { message: string }) {
  return (
    <div className="mt-4 p-4 rounded-lg flex items-center gap-3 animate-shake bg-red-50 border-l-4 border-red-500 dark:bg-red-900 dark:border-red-600">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        className="stroke-[#ef4444] dark:stroke-[#fca5a5]"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <span className="text-sm font-semibold text-red-500 dark:text-red-300">
        {message}
      </span>
    </div>
  );
}

const HomePage = () => {
  const { data: session, status } = useSession();
  const [difficulty, setDifficulty] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [selectCategoryWarning, setSelectCategoryWarning] = useState(false);
  const [selectDifficultyWarning, setSelectDifficultyWarning] = useState(false);
  const router = useRouter();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const showWarning = (setWarning: (value: boolean) => void) => {
    setWarning(true);
    setTimeout(() => setWarning(false), 1000);
  };

  const startQuiz = () => {
    if (category === "") {
      showWarning(setSelectCategoryWarning);
      return;
    }
    if (difficulty === "") {
      showWarning(setSelectDifficultyWarning);
      return;
    }
    setShowCountdown(true);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-4 transition-all duration-300 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700">
        <div className="w-full max-w-2xl min-w-[280px] mx-auto rounded-2xl shadow-xl p-6 md:p-12 text-center transition-all duration-300 backdrop-blur-sm bg-white/95 border border-gray-200 shadow-black/5 dark:bg-gray-800/95 dark:border-gray-600 dark:shadow-black/30">
          <div className="accent-bar"></div>

          <div className="relative mb-8 md:mb-12">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto rounded-xl flex justify-center items-center text-3xl md:text-4xl font-extrabold text-white bg-emerald-500 -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-105">
              QM
            </div>
            <h1 className="mt-4 md:mt-6 text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent leading-tight tracking-tight">
              QuizMania
            </h1>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
              Test your knowledge across various categories
            </p>
          </div>

          <div className="mb-8 md:mb-10 text-left">
            <h2 className={sectionTitle}>Select Category</h2>
            <select
              className={`w-full p-4 rounded-xl cursor-pointer appearance-none transition-all duration-300 border bg-gray-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 dark:bg-gray-700 dark:focus:ring-emerald-900 ${
                selectCategoryWarning
                  ? "border-red-500 dark:border-red-600 animate-shake"
                  : "border-gray-200 dark:border-gray-600"
              }`}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {selectCategoryWarning && (
              <Warning message="Please select a category to continue" />
            )}
          </div>

          <div className="mb-8 md:mb-10 text-left">
            <h2 className={sectionTitle}>Select Difficulty</h2>
            <div className="flex justify-center gap-4 md:gap-5 mb-6 flex-wrap">
              {difficulties.map(({ value, label, idle, active, shadow }) => (
                <button
                  key={value}
                  className={`hover-lift px-6 md:px-8 py-3 md:py-4 rounded-full cursor-pointer text-white font-semibold text-sm md:text-base shadow-lg hover:shadow-xl ${
                    difficulty === value ? active : idle
                  } ${shadow}`}
                  onClick={() => setDifficulty(value)}
                >
                  {label} {difficulty === value && "✓"}
                </button>
              ))}
            </div>

            {selectDifficultyWarning && (
              <Warning message="Please select a difficulty level to continue" />
            )}
          </div>

          <div className="flex flex-col gap-4 md:gap-5 mt-8 md:mt-10">
            <button
              className="hover-lift w-full py-4 md:py-5 cursor-pointer rounded-xl text-white font-semibold text-lg md:text-xl bg-emerald-500 shadow-lg hover:shadow-xl shadow-emerald-500/30 hover:shadow-emerald-600/40 dark:shadow-emerald-500/20 dark:hover:shadow-emerald-600/30"
              onClick={startQuiz}
            >
              Start Quiz
            </button>
            <div className="flex gap-4 md:gap-5 w-full">
              <button
                className="hover-lift flex-1 py-3 cursor-pointer md:py-4 rounded-xl border-2 font-semibold text-sm md:text-base border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900"
                onClick={() => router.push("/rules")}
              >
                Rules
              </button>
              {isAuthenticated && (
                <button
                  className="hover-lift flex-1 cursor-pointer py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showCountdown && (
        <CountdownOverlay category={category} difficulty={difficulty} />
      )}
    </>
  );
};

export default HomePage;
