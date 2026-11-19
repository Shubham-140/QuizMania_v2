"use client";
import { useState } from "react";

const inputClass =
  "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-3 border-slate-200 bg-slate-50 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-500/30";

const feedbackTypes = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug Report" },
  { value: "question", label: "Question" },
  { value: "compliment", label: "Compliment" },
  { value: "other", label: "Other" },
];

const FORMSPREE_URL = "https://formspree.io/f/xnnvoqrg";

export default function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Formspree responded with ${response.status}`);
      }
      form.reset();
      setIsSubmitted(true);
    } catch (err) {
      console.error("Feedback submit error:", err);
      setError("Couldn't send your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-center">
        <div className="card w-full max-w-2xl rounded-xl md:rounded-2xl p-8 md:p-12 backdrop-blur-sm text-center">
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
            <h2 className="text-gradient text-2xl font-bold mb-2">
              Thank You!
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Your feedback has been submitted successfully. We appreciate your
              time!
            </p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold transition-all duration-300 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20"
          >
            Send Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="card w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm relative overflow-hidden">
        <div className="accent-bar"></div>

        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-gradient text-2xl md:text-3xl font-extrabold mb-2">
            Send Feedback
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Help us improve QuizMania
          </p>
        </div>

        <form
          action={FORMSPREE_URL}
          method="POST"
          className="grid gap-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="name" className="field-label">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              className={`text-base ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="email" className="field-label">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className={`text-base ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="feedback_type" className="field-label">
              Feedback Type
            </label>

            <div className="relative">
              <select
                id="feedback_type"
                name="feedback_type"
                className={`text-sm pr-10 appearance-none cursor-pointer hover:border-emerald-500 ${inputClass}`}
              >
                <option value="">Select feedback type</option>
                {feedbackTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400">
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

          <div>
            <label htmlFor="message" className="field-label">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="What would you like to tell us?"
              className={`text-base resize-y min-h-[120px] ${inputClass}`}
              required
            ></textarea>
          </div>

          <input type="hidden" name="_subject" value="New QuizMania Feedback" />

          {error && (
            <p role="alert" className="text-sm text-center text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-3 md:py-4 rounded-xl bg-emerald-500 text-white font-semibold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 dark:shadow-emerald-500/20 dark:hover:shadow-emerald-500/30"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <p className="text-center text-sm mt-8 text-gray-600 dark:text-gray-400">
          We appreciate your time helping us improve!
        </p>
      </div>
    </div>
  );
}
