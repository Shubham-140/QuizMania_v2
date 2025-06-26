"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setNumberOfQues } from "../features/userChoices/userChoicesSlice";

const Score = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const score = useSelector((state: RootState) => state.performance.score);
  const numberOfQuestions = useSelector(
    (state: RootState) => state.userChoices.numberOfQuestions
  );
  const [showCalculating, setShowCalculating] = useState(true);
  const timeTaken = useSelector(
    (state: RootState) => state.performance.timeTaken
  );
  const router = useRouter();
  const [localStorageHydrate, setLocalStorageHydrate] = useState(false);

  useEffect(() => {
    const savedTime = localStorage.getItem("totalTime");
    if (savedTime) {
      setNumberOfQues(JSON.parse(savedTime));
    }
  }, []);

  useEffect(() => {
    if (localStorageHydrate === false) {
      return;
    }
    setLocalStorageHydrate(true);
    const timer = setTimeout(() => setShowCalculating(false), 2000);
    return () => clearTimeout(timer);
  }, [localStorageHydrate]);

  return (
    <div
      className={`min-h-screen p-4 flex justify-center items-center font-inter 
      ${
        lightMode
          ? "bg-[radial-gradient(circle_at_10%_20%,#f0fdf4_0%,#dcfce7_90%)]"
          : "bg-[radial-gradient(circle_at_10%_20%,#022c22_0%,#064e3b_90%)]"
      }`}
    >
      {/* Calculating Score Overlay */}
      {showCalculating && (
        <div
          className={`fixed inset-0 z-[2000] flex flex-col justify-center items-center backdrop-blur-lg
          ${lightMode ? "bg-white/90" : "bg-black/90"}`}
        >
          <div className="w-[clamp(60px,15vw,80px)] h-[clamp(60px,15vw,80px)] mb-[clamp(1rem,5vw,2rem)] relative">
            <div
              className={`absolute inset-0 rounded-full border-8 
              ${lightMode ? "border-gray-200" : "border-gray-600"}`}
            />
            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-emerald-500 animate-spin" />
          </div>

          <h2
            className={`text-[clamp(1.25rem,5vw,2rem)] font-bold mb-[clamp(0.5rem,3vw,1rem)] text-center px-4
            bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent`}
          >
            Calculating Your Score
          </h2>

          <p
            className={`text-center max-w-[min(300px,90vw)] px-4 text-[clamp(0.875rem,3vw,1rem)]
            ${lightMode ? "text-gray-600" : "text-gray-400"}`}
          >
            Preparing your detailed performance analysis...
          </p>
        </div>
      )}

      {/* Score Display Content */}
      <div
        className={`w-full max-w-[min(800px,95vw)] rounded-[clamp(1rem,3vw,1.5rem)] 
        p-[clamp(1rem,3vw,2rem)] relative overflow-hidden backdrop-blur-md
        ${
          lightMode
            ? "bg-white/96 border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            : "bg-slate-900/96 border border-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10" />

        {/* Header */}
        <div className="text-center mb-[clamp(1rem,3vw,2rem)]">
          <h1
            className={`text-[clamp(1.25rem,4vw,2rem)] font-extrabold mb-[clamp(0.25rem,1vw,0.5rem)] 
            text-emerald-500`}
          >
            Quiz Completed!
          </h1>
          <p
            className={`text-[clamp(0.875rem,2vw,1rem)] opacity-80 
            ${lightMode ? "text-slate-900" : "text-slate-50"}`}
          >
            Here&apos;s how you performed
          </p>
        </div>

        {/* Score Card */}
        <div
          className={`rounded-[clamp(0.75rem,2vw,1rem)] p-[clamp(1rem,2vw,1.5rem)] text-center 
          mb-[clamp(1rem,3vw,2rem)] border
          ${
            lightMode
              ? "bg-slate-50 border-slate-200"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          <div
            className="text-[clamp(1.5rem,8vw,3.5rem)] font-extrabold mb-[clamp(0.25rem,1vw,0.5rem)]
            bg-gradient-to-br from-emerald-500 to-blue-500 bg-clip-text text-transparent"
          >
            {score}/{numberOfQuestions}
          </div>
          <div
            className={`text-[clamp(0.875rem,2vw,1rem)] font-semibold 
            ${lightMode ? "text-slate-900" : "text-slate-50"}`}
          >
            Your Score
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
          {/* Correct Answers */}
          <div
            className={`rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.75rem,2vw,1rem)] text-center border
            ${
              lightMode
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <div className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold mb-[clamp(0.125rem,0.5vw,0.25rem)] text-emerald-500">
              {score}
            </div>
            <div
              className={`text-[clamp(0.75rem,2vw,0.875rem)] opacity-80 
              ${lightMode ? "text-slate-900" : "text-slate-50"}`}
            >
              Correct
            </div>
          </div>

          {/* Incorrect Answers */}
          <div
            className={`rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.75rem,2vw,1rem)] text-center border
            ${
              lightMode
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <div className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold mb-[clamp(0.125rem,0.5vw,0.25rem)] text-red-500">
              {numberOfQuestions - score}
            </div>
            <div
              className={`text-[clamp(0.75rem,2vw,0.875rem)] opacity-80 
              ${lightMode ? "text-slate-900" : "text-slate-50"}`}
            >
              Incorrect
            </div>
          </div>

          {/* Time Taken */}
          <div
            className={`rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.75rem,2vw,1rem)] text-center border
            ${
              lightMode
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <div className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold mb-[clamp(0.125rem,0.5vw,0.25rem)] text-emerald-500">
              {timeTaken}s
            </div>
            <div
              className={`text-[clamp(0.75rem,2vw,0.875rem)] opacity-80 
              ${lightMode ? "text-slate-900" : "text-slate-50"}`}
            >
              Time Taken
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)]">
          <button
            onClick={() => router.push("/quiz/results")}
            className={`rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.5rem,2vw,0.75rem)] font-semibold 
            text-[clamp(0.875rem,2vw,1rem)] transition-all duration-200 border border-emerald-500 
            ${
              lightMode
                ? "text-emerald-500 hover:bg-emerald-50"
                : "text-emerald-400 hover:bg-emerald-900/30"
            }`}
          >
            Review Answers
          </button>

          <Link
            href="/"
            className={`rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.5rem,2vw,0.75rem)] font-semibold 
            text-[clamp(0.875rem,2vw,1rem)] transition-all duration-200 text-white bg-emerald-500 
            flex justify-center items-center hover:-translate-y-0.5
            ${
              lightMode
                ? "shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)]"
                : "shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)]"
            }`}
          >
            Go to HomePage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Score;
