"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";

const About = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const router = useRouter();

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center items-center font-sans ${
        lightMode
          ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
          : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      }`}
    >
      <div
        className={`w-full max-w-6xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm border relative overflow-hidden ${
          lightMode
            ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
            : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
        }`}
      >
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            About QuizMania
          </h1>
          <p
            className={`text-sm md:text-lg ${
              lightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Test your knowledge and climb the leaderboards
          </p>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-10">
          {/* Feature 1 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Diverse Categories
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              From science to pop culture, we&apos;ve got quizzes on every topic
              you can imagine.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Time Challenges
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Test your speed and knowledge with our timed quiz modes.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Answer Review
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Review all answers at the end to learn from your mistakes.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Customizable Settings
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Adjust quiz length, difficulty, and time limits to your
              preference.
            </p>
          </div>

          {/* Feature 5 */}
        <div
  className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
    lightMode
      ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
      : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
  }`}
>
  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
  </div>
  <h3
    className={`text-xl font-bold mb-3 ${
      lightMode ? "text-gray-900" : "text-white"
    }`}
  >
    Secure Authentication
  </h3>
  <p
    className={`leading-relaxed ${
      lightMode ? "text-gray-600" : "text-gray-400"
    }`}
  >
    Sign in seamlessly with GitHub or email/password. Your data stays protected with industry-standard security.
  </p>
</div>

          {/* Feature 6 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Dark/Light Mode
            </h3>
            <p
              className={`leading-relaxed ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Choose your preferred theme for comfortable quizzing anytime.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            className={`px-6 md:px-8 py-3 md:py-4 rounded-full border-none bg-emerald-500 text-white font-semibold text-base md:text-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              lightMode
                ? "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                : "shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            }`}
            onClick={() => router.push("/")}
          >
            Start Quizzing Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
