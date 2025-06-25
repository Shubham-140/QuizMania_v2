"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubmitQuizModal } from "../../../component/SubmitQuizModal";
import {
  setScore,
  setTimeTaken,
} from "../../../features/performance/performanceSliceInfo";
import { RootState } from "@/app/store/store";
import { useParams, useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  [key: string]: string | string[];
}

const QuestionDisplay = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { category, difficulty } = useParams<{
    category: string;
    difficulty: string;
  }>();

  // Redux state
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const numberOfQuestions = useSelector(
    (state: RootState) => state.userChoices.numberOfQuestions
  );
  const totalTime = useSelector(
    (state: RootState) => state.userChoices.totalTime
  );

  // Local state
  const [index, setIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctIndices, setCorrectedIndices] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<(number | null)[]>([]);
  const [submitOverlay, setSubmitOverlay] = useState(false);
  const [localTotalTime, setLocalTotalTime] = useState<number | null>(null);

  // Theme configuration
  const theme = {
    light: {
      text: "text-gray-900",
      border: "border-gray-200",
      primaryText: "text-emerald-500",
      secondary: "bg-gray-50",
      cardBg: "bg-white/96",
      shadow: "shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
      optionHover: "hover:bg-emerald-50",
      danger: "bg-red-500",
      primary: "bg-emerald-500",
      primaryLight: "bg-emerald-100",
      primaryDark: "bg-emerald-600",
    },
    dark: {
      text: "text-gray-50",
      border: "border-gray-700",
      primary: "bg-emerald-600",
      primaryLight: "bg-emerald-900/30",
      primaryDark: "bg-emerald-700",
      primaryText: "text-emerald-400",
      secondary: "bg-gray-800",
      cardBg: "bg-gray-900/96",
      shadow: "shadow-[0_20px_40px_rgba(0,0,0,0.3)]",
      optionHover: "hover:bg-emerald-900/30",
      danger: "bg-red-600",
    },
  };

  const colors = lightMode ? theme.light : theme.dark;

  // Effects
  useEffect(() => {
    if (totalTime !== null) {
      setLocalTotalTime(totalTime);
    }
  }, [totalTime]);

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
      calculateScore();
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
    fetchQuizData();
  }, [category, difficulty, numberOfQuestions]);

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

  const calculateScore = () => {
    let localScore = 0;
    for (let i = 0; i < numberOfQuestions; i++) {
      if (selectedIndex[i] === correctIndices[i]) {
        localScore++;
      }
    }
    const quizDatas = {
      quizData,
      correctIndices,
      selectedIndex,
      options,
    };

    console.log(quizDatas);
    localStorage.setItem("quiz_results", JSON.stringify(quizDatas));

    dispatch(setTimeTaken(totalTime));
    dispatch(setScore(localScore));
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

  return (
    <div
      className={`min-h-[calc(100vh-56px)] p-4 flex justify-center items-center font-inter 
      ${
        lightMode
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100"
          : "bg-gradient-to-br from-gray-900 to-emerald-900/20"
      }`}
    >
      {/* Main Quiz Card */}
      <div className="w-full max-w-4xl h-[calc(100vh-56px)] flex flex-col justify-between gap-4">
        <div
          className={`relative rounded-2xl p-6 md:p-8 h-full flex flex-col 
          ${colors.cardBg} ${colors.shadow} border ${colors.border} backdrop-blur-md overflow-hidden`}
        >
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10" />

          {/* Header with question counter and timer */}
          <div className="flex justify-between items-center mb-6">
            <div
              className={`text-sm font-semibold tracking-wider ${colors.primaryText}`}
            >
              QUESTION {index + 1} OF {numberOfQuestions}
            </div>

            {totalTime !== 999999 && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white 
                ${isTimeCritical ? colors.danger : colors.primary} 
                ${
                  isTimeCritical ? "animate-pulse border-2 border-white/30" : ""
                }
                transition-all duration-300 shadow-md ${
                  isTimeCritical ? "shadow-red-500/30" : "shadow-emerald-500/30"
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

          {/* Question and Options */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto scrollbar-hide flex-1">
              <h2
                className={`text-xl md:text-2xl font-bold mb-6 leading-snug ${colors.text}`}
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? `${
                                lightMode
                                  ? "bg-emerald-50"
                                  : "bg-emerald-900/20"
                              } border-emerald-500`
                            : `${colors.secondary} ${colors.border}`
                        }
                        ${isSelected ? "shadow-md shadow-emerald-500/20" : ""}
                        hover:-translate-y-0.5 hover:shadow-md ${
                          lightMode
                            ? "hover:shadow-gray-200"
                            : "hover:shadow-gray-800"
                        }
                        hover:border-emerald-500 ${
                          isSelected
                            ? `${
                                lightMode
                                  ? "hover:bg-emerald-100"
                                  : "hover:bg-emerald-900/30"
                              }`
                            : `${
                                lightMode
                                  ? "hover:bg-gray-100"
                                  : "hover:bg-gray-800"
                              }`
                        }
                        relative overflow-hidden`}
                      onClick={() => handleSelect(index, ind)}
                    >
                      <div
                        className={`flex items-center gap-3 font-medium 
                        ${isSelected ? colors.primaryText : colors.text}`}
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                          ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : `border ${colors.text}`
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

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-4">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold 
                  ${
                    colors.primaryText
                  } border-emerald-500 hover:bg-emerald-50/50 transition-all
                  ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white 
                  ${
                    colors.primary
                  } hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg
                  ${
                    index === numberOfQuestions - 1
                      ? "shadow-emerald-500/30 hover:shadow-emerald-500/40"
                      : ""
                  }`}
                onClick={() => {
                  if (index === numberOfQuestions - 1) {
                    setSubmitOverlay(true);
                    const quizDatas = {
                      quizData,
                      correctIndices,
                      selectedIndex,
                      options,
                    };
                    localStorage.setItem(
                      "quiz_results",
                      JSON.stringify(quizDatas)
                    );
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

      {/* Submit Quiz Modal */}
      {submitOverlay && (
        <SubmitQuizModal
          setSubmitOverlay={setSubmitOverlay}
          correctIndices={correctIndices}
          selectedIndex={selectedIndex as number[]}
          localTotalTime={localTotalTime || 0}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
