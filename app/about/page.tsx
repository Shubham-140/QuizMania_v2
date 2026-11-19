import Link from "next/link";
import type { ReactNode } from "react";
import FeatureTile from "../component/FeatureTile";

const icon = (children: ReactNode) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    {children}
  </svg>
);

const features = [
  {
    title: "Diverse Categories",
    text: "From science to pop culture, we've got quizzes on every topic you can imagine.",
    icon: icon(
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </>
    ),
  },
  {
    title: "Time Challenges",
    text: "Test your speed and knowledge with our timed quiz modes.",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </>
    ),
  },
  {
    title: "Answer Review",
    text: "Review all answers at the end to learn from your mistakes.",
    icon: icon(<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>),
  },
  {
    title: "Customizable Settings",
    text: "Adjust quiz length, difficulty, and time limits to your preference.",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </>
    ),
  },
  {
    title: "Secure Authentication",
    text: "Sign in seamlessly with GitHub or email/password. Your data stays protected with industry-standard security.",
    icon: icon(
      <>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </>
    ),
  },
  {
    title: "Dark/Light Mode",
    text: "Choose your preferred theme for comfortable quizzing anytime.",
    icon: icon(
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    ),
  },
];

export default function About() {
  return (
    <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="card w-full max-w-6xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm relative overflow-hidden">
        <div className="accent-bar"></div>

        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-gradient text-2xl md:text-4xl font-extrabold mb-2">
            About QuizMania
          </h1>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
            Test your knowledge and climb the leaderboards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-10">
          {features.map(({ title, text, icon }) => (
            <FeatureTile key={title} icon={icon} title={title}>
              {text}
            </FeatureTile>
          ))}
        </div>

        <div className="text-center">
          <Link href="/" className="btn-pill">
            Start Quizzing Now
          </Link>
        </div>
      </div>
    </div>
  );
}
