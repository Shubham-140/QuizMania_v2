"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitQuizModal } from "../../component/SubmitQuizModal";
import type { PlayerQuestion } from "@/lib/quizAttempts";

type Props = {
  attemptId: string;
  questions: PlayerQuestion[];
  timeLimit: number | null;
  initialTimeLeft: number | null;
};

const text = "text-gray-900 dark:text-gray-50";
const accentText = "text-emerald-500 dark:text-emerald-400";
const primaryBg = "bg-emerald-500 dark:bg-emerald-600";
const optionBase =
  "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-gray-200 dark:hover:shadow-gray-800 hover:border-emerald-500 relative overflow-hidden";
const optionSelected =
  "bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/20 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30";
const optionIdle =
  "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800";

const formatTime = (time: number | null) => {
  if (time === null) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export default function QuizPlayer({
  attemptId,
  questions,
  timeLimit,
  initialTimeLeft,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<(number | null)[]>(() =>
    new Array(questions.length).fill(null)
  );
  const [index, setIndex] = useState(0);
  const [submitOverlay, setSubmitOverlay] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (timeLimit === null) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLimit]);

  const submitQuiz = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError("");

    try {
      const response = await fetch(`/api/quiz-attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected }),
      });
      if (!response.ok && response.status !== 409) {
        throw new Error(`Submitting the quiz failed with ${response.status}`);
      }
      router.push(`/quiz/${attemptId}/score`);
    } catch (error) {
      console.error("Could not submit quiz", error);
      submittingRef.current = false;
      setSubmitOverlay(false);
      setSubmitError("Couldn't save your result. Please try again.");
    }
  };

  const submitQuizRef = useRef(submitQuiz);
  useEffect(() => {
    submitQuizRef.current = submitQuiz;
  });

  useEffect(() => {
    if (timeLeft === 0) {
      submitQuizRef.current();
    }
  }, [timeLeft]);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setSelected((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  };

  const isTimeCritical = timeLeft !== null && timeLeft <= 20;
  const isLastQuestion = index === questions.length - 1;

  return (
    <div className="quiz-bg min-h-[calc(100vh-56px)] p-4 flex justify-center items-center">
      <div className="w-full max-w-4xl h-[calc(100vh-56px)] flex flex-col justify-between gap-4">
        <div className="quiz-card relative p-6 md:p-8 h-full flex flex-col backdrop-blur-md overflow-hidden">
          <div className="accent-bar" />

          <div className="flex justify-between items-center mb-6">
            <div
              className={`text-sm font-semibold tracking-wider ${accentText}`}
            >
              QUESTION {index + 1} OF {questions.length}
            </div>

            {timeLimit !== null && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-md ${
                  isTimeCritical
                    ? "bg-red-500 dark:bg-red-600 animate-pulse border-2 border-white/30 shadow-red-500/30"
                    : `${primaryBg} shadow-emerald-500/30`
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    isTimeCritical ? "scale-110" : "scale-100"
                  } transition-transform`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span
                  className={
                    isTimeCritical ? "font-bold scale-105" : "font-semibold"
                  }
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto scrollbar-hide flex-1">
              <h2
                className={`text-xl md:text-2xl font-bold mb-6 leading-snug ${text}`}
              >
                {questions[index]?.question}
              </h2>

              <div className="grid gap-3 mb-6">
                {questions[index]?.options.map((option, ind) => {
                  const isSelected = selected[index] === ind;
                  const optionLetter = String.fromCharCode(65 + ind);

                  return (
                    <div
                      key={option}
                      className={`${optionBase} ${
                        isSelected ? optionSelected : optionIdle
                      }`}
                      onClick={() => handleSelect(index, ind)}
                    >
                      <div
                        className={`flex items-center gap-3 font-medium ${
                          isSelected ? accentText : text
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            isSelected ? "bg-emerald-500 text-white" : `border ${text}`
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <span className="flex-1">{option}</span>
                        {isSelected && (
                          <svg
                            className="w-5 h-5 ml-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {submitError && (
              <div
                role="alert"
                className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-300"
              >
                <span>{submitError}</span>
                <button
                  type="button"
                  onClick={submitQuiz}
                  className="font-semibold underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="flex justify-between gap-4 pt-4">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold cursor-pointer border-emerald-500 hover:bg-emerald-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${accentText}`}
                onClick={() => index > 0 && setIndex(index - 1)}
                disabled={index === 0}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white cursor-pointer hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg ${primaryBg} ${
                  isLastQuestion
                    ? "shadow-emerald-500/30 hover:shadow-emerald-500/40"
                    : ""
                }`}
                onClick={() => {
                  if (isLastQuestion) {
                    setSubmitOverlay(true);
                  } else {
                    setIndex(index + 1);
                  }
                }}
              >
                {isLastQuestion ? "Submit Quiz" : "Next"}
                {!isLastQuestion && (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {submitOverlay && (
        <SubmitQuizModal
          setSubmitOverlay={setSubmitOverlay}
          onSubmit={submitQuiz}
        />
      )}
    </div>
  );
}
