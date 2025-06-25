"use client";
import { RootState } from "@/app/store/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface QuizQuestion {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  [key: string]: string | string[];
}

const QuizAnswers: React.FC = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedData = localStorage.getItem("quiz_results");
        if (storedData) {
          const data = JSON.parse(storedData);

          // Set each piece of data to its respective state
          setQuizData(data.quizData || []);
          setOptions(data.options || []);
          setCorrectIndices(data.correctIndices || []);
          setSelectedIndex(data.selectedIndex || []);
        }
      } catch (error) {
        console.error("Error loading quiz data from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const theme = {
    light: {
      text: "text-gray-900",
      border: "border-gray-200",
      primaryText: "text-emerald-500",
      secondary: "bg-gray-50",
      cardBg: "bg-white/96",
      shadow: "shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
      correct: "bg-green-50 border-green-500",
      incorrect: "bg-red-50 border-red-500",
      unselected: "bg-gray-50 border-gray-200",
    },
    dark: {
      text: "text-gray-50",
      border: "border-gray-700",
      primaryText: "text-emerald-400",
      secondary: "bg-gray-800",
      cardBg: "bg-gray-900/96",
      shadow: "shadow-[0_20px_40px_rgba(0,0,0,0.3)]",
      correct: "bg-green-900/30 border-green-500",
      incorrect: "bg-red-900/30 border-red-500",
      unselected: "bg-gray-800 border-gray-700",
    },
  };

  const colors = lightMode ? theme.light : theme.dark;

  const getOptionStyle = (questionIndex: number, optionIndex: number) => {
    const isCorrect = correctIndices[questionIndex] === optionIndex;
    const isSelected = selectedIndex[questionIndex] === optionIndex;
    const wasAnswered = selectedIndex[questionIndex] !== null;

    if (isCorrect) {
      return `${colors.correct} text-green-700`;
    }
    if (isSelected && !isCorrect) {
      return `${colors.incorrect} text-red-700`;
    }
    if (!wasAnswered) {
      return `${colors.unselected} ${colors.text} opacity-60`;
    }
    return `${colors.secondary} ${colors.text} opacity-40`;
  };

  const getOptionIcon = (questionIndex: number, optionIndex: number) => {
    const isCorrect = correctIndices[questionIndex] === optionIndex;
    const isSelected = selectedIndex[questionIndex] === optionIndex;

    if (isCorrect) {
      return (
        <svg
          className="w-5 h-5 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M20 6L9 17l-5-5" strokeWidth="2" />
        </svg>
      );
    }
    if (isSelected && !isCorrect) {
      return (
        <svg
          className="w-5 h-5 text-red-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
        </svg>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen p-4 flex items-center justify-center ${
          lightMode
            ? "bg-gradient-to-br from-emerald-50 to-emerald-100"
            : "bg-gradient-to-br from-gray-900 to-emerald-900/20"
        }`}
      >
        <div
          className={`${colors.cardBg} rounded-2xl p-8 ${colors.shadow} border ${colors.border}`}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className={`${colors.text} text-lg`}>Loading quiz results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div
        className={`min-h-screen p-4 flex items-center justify-center ${
          lightMode
            ? "bg-gradient-to-br from-emerald-50 to-emerald-100"
            : "bg-gradient-to-br from-gray-900 to-emerald-900/20"
        }`}
      >
        <div
          className={`${colors.cardBg} rounded-2xl p-8 ${colors.shadow} border ${colors.border}`}
        >
          <div className="text-center">
            <p className={`${colors.text} text-lg`}>No quiz data found</p>
            <p className={`${colors.text} text-sm opacity-70 mt-2`}>
              Please complete a quiz first
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 ${
        lightMode
          ? "bg-gradient-to-br from-emerald-50 to-emerald-100"
          : "bg-gradient-to-br from-gray-900 to-emerald-900/20"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`${colors.cardBg} rounded-2xl p-6 mb-6 ${colors.shadow} border ${colors.border}`}
        >
          <h1 className={`text-2xl font-bold ${colors.text}`}>Quiz Review</h1>
        </div>

        <div className="space-y-6">
          {quizData.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className={`${colors.cardBg} rounded-2xl p-6 ${colors.shadow} border ${colors.border}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2
                  className={`text-lg font-semibold ${colors.text} flex-1 pr-4`}
                >
                  {questionIndex + 1}. {question.question}
                </h2>
                <div
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedIndex[questionIndex] ===
                    correctIndices[questionIndex]
                      ? "bg-green-100 text-green-800"
                      : selectedIndex[questionIndex] === null
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedIndex[questionIndex] ===
                  correctIndices[questionIndex]
                    ? "Correct"
                    : selectedIndex[questionIndex] === null
                    ? "Not Answered"
                    : "Incorrect"}
                </div>
              </div>

              <div className="grid gap-3">
                {options[questionIndex]?.map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode(65 + optionIndex);
                  return (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${getOptionStyle(
                        questionIndex,
                        optionIndex
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border font-medium text-sm">
                          {optionLetter}
                        </div>
                        <span className="flex-1">{option}</span>
                        {getOptionIcon(questionIndex, optionIndex)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizAnswers;
