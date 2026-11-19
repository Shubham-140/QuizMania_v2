"use client";
import PageLoader from "../../component/PageLoader";
import { useState, useEffect } from "react";

interface QuizQuestion {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  [key: string]: string | string[];
}

const text = "text-gray-900 dark:text-gray-50";

const optionStyles = {
  correct: "bg-green-50 border-green-500 dark:bg-green-900/30 text-green-700",
  incorrect: "bg-red-50 border-red-500 dark:bg-red-900/30 text-red-700",
  unanswered: `bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${text} opacity-60`,
  other: `bg-gray-50 dark:bg-gray-800 ${text} opacity-40`,
};

const statusBadges = {
  correct: { label: "Correct", className: "bg-green-100 text-green-800" },
  unanswered: { label: "Not Answered", className: "bg-gray-100 text-gray-800" },
  incorrect: { label: "Incorrect", className: "bg-red-100 text-red-800" },
};

export default function QuizAnswers() {
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("quiz_results");
      if (storedData) {
        const data = JSON.parse(storedData);

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
  }, []);

  const getOptionStyle = (questionIndex: number, optionIndex: number) => {
    const isCorrect = correctIndices[questionIndex] === optionIndex;
    const isSelected = selectedIndex[questionIndex] === optionIndex;

    if (isCorrect) return optionStyles.correct;
    if (isSelected) return optionStyles.incorrect;
    if (selectedIndex[questionIndex] === null) return optionStyles.unanswered;
    return optionStyles.other;
  };

  const getOptionIcon = (questionIndex: number, optionIndex: number) => {
    if (correctIndices[questionIndex] === optionIndex) {
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
    if (selectedIndex[questionIndex] === optionIndex) {
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

  const getStatus = (questionIndex: number) => {
    if (selectedIndex[questionIndex] === correctIndices[questionIndex]) {
      return statusBadges.correct;
    }
    if (selectedIndex[questionIndex] === null) {
      return statusBadges.unanswered;
    }
    return statusBadges.incorrect;
  };

  if (isLoading) {
    return <PageLoader message="Loading quiz results..." />;
  }

  if (quizData.length === 0) {
    return (
      <div className="quiz-bg min-h-screen p-4 flex items-center justify-center">
        <div className="quiz-card p-8">
          <div className="text-center">
            <p className={`${text} text-lg`}>No quiz data found</p>
            <p className={`${text} text-sm opacity-70 mt-2`}>
              Please complete a quiz first
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="quiz-card p-6 mb-6">
          <h1 className={`text-2xl font-bold ${text}`}>Quiz Review</h1>
        </div>

        <div className="space-y-6">
          {quizData.map((question, questionIndex) => {
            const status = getStatus(questionIndex);
            return (
              <div key={questionIndex} className="quiz-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-lg font-semibold ${text} flex-1 pr-4`}>
                    {questionIndex + 1}. {question.question}
                  </h2>
                  <div
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
                  >
                    {status.label}
                  </div>
                </div>

                <div className="grid gap-3">
                  {options[questionIndex]?.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${getOptionStyle(
                        questionIndex,
                        optionIndex
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border font-medium text-sm">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {getOptionIcon(questionIndex, optionIndex)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
