"use client";
import PageLoader from "../component/PageLoader";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import Link from "next/link";

const box =
  "text-center border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
const mutedText = "opacity-80 text-slate-900 dark:text-slate-50";
const actionClass =
  "rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.5rem,2vw,0.75rem)] font-semibold text-[clamp(0.875rem,2vw,1rem)] transition-all duration-200";

export default function Score() {
  const score = useSelector((state: RootState) => state.performance.score);
  const timeTaken = useSelector(
    (state: RootState) => state.performance.timeTaken
  );

  const [numberOfQuestions, setNumberOfQuestions] = useState<number | null>(
    null
  );
  const [showCalculating, setShowCalculating] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const getStoredValue = (key: string, defaultValue: number): number => {
      try {
        if (typeof window !== "undefined") {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : defaultValue;
        }
        return defaultValue;
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return defaultValue;
      }
    };

    const questions = getStoredValue("numberOfQuestions", 10);
    setNumberOfQuestions(questions);

    const timer = setTimeout(() => setShowCalculating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || numberOfQuestions === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const stats = [
    { label: "Correct", value: score, color: "text-emerald-500" },
    {
      label: "Incorrect",
      value: numberOfQuestions - score,
      color: "text-red-500",
    },
    { label: "Time Taken", value: `${timeTaken}s`, color: "text-emerald-500" },
  ];

  return (
    <div className="page-bg-soft min-h-screen p-4 flex justify-center items-center">
      {showCalculating && (
        <div className="fixed inset-0 z-[2000]">
          <PageLoader message="Calculating your score..." />
        </div>
      )}

      <div className="card-soft w-full max-w-[min(800px,95vw)] rounded-[clamp(1rem,3vw,1.5rem)] p-[clamp(1rem,3vw,2rem)] relative overflow-hidden">
        <div className="accent-bar" />

        <div className="text-center mb-[clamp(1rem,3vw,2rem)]">
          <h1 className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold mb-[clamp(0.25rem,1vw,0.5rem)] text-emerald-500">
            Quiz Completed!
          </h1>
          <p className={`text-[clamp(0.875rem,2vw,1rem)] ${mutedText}`}>
            Here&apos;s how you performed
          </p>
        </div>

        <div
          className={`${box} rounded-[clamp(0.75rem,2vw,1rem)] p-[clamp(1rem,2vw,1.5rem)] mb-[clamp(1rem,3vw,2rem)]`}
        >
          <div className="text-[clamp(1.5rem,8vw,3.5rem)] font-extrabold mb-[clamp(0.25rem,1vw,0.5rem)] bg-gradient-to-br from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            {score}/{numberOfQuestions}
          </div>
          <div className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-slate-900 dark:text-slate-50">
            Your Score
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
          {stats.map(({ label, value, color }) => (
            <div
              key={label}
              className={`${box} rounded-[clamp(0.5rem,2vw,0.75rem)] p-[clamp(0.75rem,2vw,1rem)]`}
            >
              <div
                className={`text-[clamp(1.25rem,3vw,1.5rem)] font-bold mb-[clamp(0.125rem,0.5vw,0.25rem)] ${color}`}
              >
                {value}
              </div>
              <div className={`text-[clamp(0.75rem,2vw,0.875rem)] ${mutedText}`}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)]">
          <Link
            href="/quiz/results"
            className={`${actionClass} text-center border border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30`}
          >
            Review Answers
          </Link>

          <Link
            href="/"
            className={`${actionClass} flex justify-center items-center text-white bg-emerald-500 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)]`}
          >
            Go to HomePage
          </Link>
        </div>
      </div>
    </div>
  );
}
