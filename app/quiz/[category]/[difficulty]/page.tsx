"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { SubmitQuizModal } from "../../../component/SubmitQuizModal";
import PageLoader from "../../../component/PageLoader";
import {
  setScore,
  setTimeTaken,
} from "../../../features/performance/performanceSliceInfo";
import { useParams, useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  [key: string]: string | string[];
}

const text = "text-gray-900 dark:text-gray-50";
const accentText = "text-emerald-500 dark:text-emerald-400";
const primaryBg = "bg-emerald-500 dark:bg-emerald-600";
const optionBase =
  "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-gray-200 dark:hover:shadow-gray-800 hover:border-emerald-500 relative overflow-hidden";
const optionSelected =
  "bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/20 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30";
const optionIdle =
  "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800";

const QuestionDisplay = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { category, difficulty } = useParams<{
    category: string;
    difficulty: string;
  }>();

  const [settings, setSettings] = useState<{
    numberOfQuestions: number;
    totalTime: number;
  } | null>(null);
  const numberOfQuestions = settings?.numberOfQuestions ?? 10;
  const totalTime = settings?.totalTime ?? 120;

  const [index, setIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctIndices, setCorrectedIndices] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<(number | null)[]>([]);
  const [submitOverlay, setSubmitOverlay] = useState(false);
  const [localTotalTime, setLocalTotalTime] = useState<number | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    const questions = localStorage.getItem("numberOfQuestions");
    const time = localStorage.getItem("totalTime");
    setSettings({
      numberOfQuestions: questions ? JSON.parse(questions) : 10,
      totalTime: time ? JSON.parse(time) : 120,
    });
  }, []);

  useEffect(() => {
    if (settings) {
      setLocalTotalTime(settings.totalTime);
    }
  }, [settings]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (localTotalTime === 0) {
      submitQuiz();
    }
  }, [localTotalTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTotalTime((prev) =>
        prev !== null && prev > 0 ? prev - 1 : prev
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (settings) {
      fetchQuizData();
    }
  }, [category, difficulty, settings]);

  useEffect(() => {
    if (hydrated && quizData.length > 0) {
      prepareQuizOptions();
    }
  }, [hydrated, quizData]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?categories=${category}&limit=${numberOfQuestions}&difficulty=${difficulty}`
      );
      const data = await response.json();
      setQuizData(data);
    } finally {
      setHydrated(true);
    }
  };

  const prepareQuizOptions = () => {
    const allCorrectOptions: number[] = [];
    const allOptions = quizData.map((elem) => {
      const opts = [elem.correctAnswer, ...elem.incorrectAnswers];
      const shuffled = [...opts].sort(() => Math.random() - 0.5);
      allCorrectOptions.push(shuffled.indexOf(elem.correctAnswer));
      return shuffled;
    });
    setCorrectedIndices(allCorrectOptions);
    setOptions(allOptions);
    setSelectedIndex(new Array(numberOfQuestions).fill(null));
  };

  const submitQuiz = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    let score = 0;
    for (let i = 0; i < quizData.length; i++) {
      if (selectedIndex[i] === correctIndices[i]) {
        score++;
      }
    }
    const timeTaken = totalTime - (localTotalTime ?? 0);

    localStorage.setItem(
      "quiz_results",
      JSON.stringify({ quizData, correctIndices, selectedIndex, options })
    );
    dispatch(setTimeTaken(timeTaken));
    dispatch(setScore(score));

    try {
      await fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          difficulty,
          score,
          totalQuestions: quizData.length,
          timeTaken,
        }),
      });
    } catch (error) {
      console.error("Could not save quiz result", error);
    }

    router.push("/score");
  };

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedIndex((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  };

  const formatTime = (time: number | null) => {
    if (time === null) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const isTimeCritical = localTotalTime !== null && localTotalTime <= 20;

  if (!hydrated) {
    return <PageLoader message="Loading quiz questions..." />;
  }

  if (quizData.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 p-6 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700">
        <p className="text-center text-gray-700 dark:text-gray-200">
          No questions found. Try another category.
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-bg min-h-[calc(100vh-56px)] p-4 flex justify-center items-center">
      <div className="w-full max-w-4xl h-[calc(100vh-56px)] flex flex-col justify-between gap-4">
        <div className="quiz-card relative p-6 md:p-8 h-full flex flex-col backdrop-blur-md overflow-hidden">
          <div className="accent-bar" />

          <div className="flex justify-between items-center mb-6">
            <div
              className={`text-sm font-semibold tracking-wider ${accentText}`}
            >
              QUESTION {index + 1} OF {numberOfQuestions}
            </div>

            {totalTime !== 999999 && (
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
                  {formatTime(localTotalTime)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto scrollbar-hide flex-1">
              <h2
                className={`text-xl md:text-2xl font-bold mb-6 leading-snug ${text}`}
              >
                {hydrated && quizData[index]?.question}
              </h2>

              <div className="grid gap-3 mb-6">
                {options[index]?.map((option, ind) => {
                  const isSelected = selectedIndex[index] === ind;
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
                  index === numberOfQuestions - 1
                    ? "shadow-emerald-500/30 hover:shadow-emerald-500/40"
                    : ""
                }`}
                onClick={() => {
                  if (index === numberOfQuestions - 1) {
                    setSubmitOverlay(true);
                  } else {
                    setIndex(index + 1);
                  }
                }}
              >
                {index === numberOfQuestions - 1 ? "Submit Quiz" : "Next"}
                {index !== numberOfQuestions - 1 && (
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
};

export default QuestionDisplay;
