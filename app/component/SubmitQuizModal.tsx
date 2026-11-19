"use client";
import { useState } from "react";

interface PropTypes {
  setSubmitOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => Promise<void>;
}

const buttonBase =
  "px-6 py-3 cursor-pointer rounded-xl font-semibold text-base min-w-[120px] transition-all duration-200 hover:-translate-y-0.5";

export const SubmitQuizModal = ({ setSubmitOverlay, onSubmit }: PropTypes) => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 backdrop-blur-md bg-black/50 dark:bg-black/70">
      <div className="relative w-full max-w-[500px] rounded-2xl p-8 text-center overflow-hidden border bg-white/96 border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:bg-slate-900/96 dark:border-slate-700 dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <div className="accent-bar" />

        <div className="w-20 h-20 rounded-full flex justify-center items-center mx-auto mb-6 border-2 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-500">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            className="stroke-[#ef4444] dark:stroke-[#fca5a5]"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-[clamp(1.5rem,5vw,1.75rem)] font-bold mb-4 leading-tight text-slate-900 dark:text-slate-50">
          Submit Your Quiz?
        </h2>

        <p className="text-[clamp(1rem,3vw,1.125rem)] mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
          Are you sure you want to submit your answers? You won&apos;t be able
          to make changes after submission.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            className={`${buttonBase} border bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-slate-700`}
            onClick={() => setSubmitOverlay(false)}
          >
            Cancel
          </button>
          <button
            className={`${buttonBase} text-white bg-emerald-500 hover:bg-emerald-600 disabled:cursor-wait disabled:opacity-60 shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)]`}
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              await onSubmit();
            }}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};
