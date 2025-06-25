"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";

const Feedback = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div
        className={`min-h-screen p-4 md:p-8 flex justify-center items-center font-sans ${
          lightMode
            ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
            : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
        }`}
      >
        <div
          className={`w-full max-w-2xl rounded-xl md:rounded-2xl p-8 md:p-12 backdrop-blur-sm border text-center ${
            lightMode
              ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
              : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
          }`}
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Thank You!
            </h2>
            <p
              className={`text-base ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Your feedback has been submitted successfully. We appreciate your
              time!
            </p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className={`px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold transition-all duration-300 hover:bg-emerald-600 ${
              lightMode
                ? "shadow-lg shadow-emerald-500/30"
                : "shadow-lg shadow-emerald-500/20"
            }`}
          >
            Send Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center items-center font-sans ${
        lightMode
          ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
          : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm border relative overflow-hidden ${
          lightMode
            ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
            : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
        }`}
      >
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Send Feedback
          </h1>
          <p
            className={`text-sm md:text-base ${
              lightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Help us improve QuizMania
          </p>
        </div>

        {/* Form */}
        <form
          action="https://formspree.io/f/xnnvoqrg"
          method="POST"
          className="grid gap-6"
          onSubmit={handleSubmit}
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className={`block font-semibold mb-2 text-sm ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                lightMode
                  ? "border-slate-200 bg-slate-50 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-slate-600 bg-slate-800 text-white focus:border-emerald-500 focus:ring-emerald-500/30"
              }`}
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`block font-semibold mb-2 text-sm ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                lightMode
                  ? "border-slate-200 bg-slate-50 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-slate-600 bg-slate-800 text-white focus:border-emerald-500 focus:ring-emerald-500/30"
              }`}
            />
          </div>

          {/* Feedback Type */}
          <div>
            <label
              className={`block font-semibold mb-2 text-sm ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Feedback Type
            </label>

            <div className="relative">
              <select
                name="feedback_type"
                className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-3 ${
                  lightMode
                    ? "border-slate-200 bg-slate-50 text-gray-900 hover:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    : "border-slate-600 bg-slate-800 text-white hover:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/30"
                }`}
              >
                <option value="">Select feedback type</option>
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug Report</option>
                <option value="question">Question</option>
                <option value="compliment">Compliment</option>
                <option value="other">Other</option>
              </select>

              {/* Custom dropdown arrow */}
              <div
                className={`absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none ${
                  lightMode ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className={`block font-semibold mb-2 text-sm ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="What would you like to tell us?"
              className={`w-full px-4 py-3 rounded-xl border text-base transition-all duration-200 resize-y min-h-[120px] focus:outline-none focus:ring-3 ${
                lightMode
                  ? "border-slate-200 bg-slate-50 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-slate-600 bg-slate-800 text-white focus:border-emerald-500 focus:ring-emerald-500/30"
              }`}
              required
            ></textarea>
          </div>

          {/* Hidden fields for Formspree */}
          <input type="hidden" name="_subject" value="New QuizMania Feedback" />
          <input type="hidden" name="_next" value="/" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-3 md:py-4 rounded-xl border-none bg-emerald-500 text-white font-semibold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
              lightMode
                ? "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                : "shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {/* Thank You Note */}
        <p
          className={`text-center text-sm mt-8 ${
            lightMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          We appreciate your time helping us improve!
        </p>
      </div>
    </div>
  );
};

export default Feedback;
