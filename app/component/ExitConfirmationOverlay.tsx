"use client";
import { useRouter } from "next/navigation";

interface Props {
  setShowExitOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

const buttonBase =
  "flex-1 min-w-[120px] px-[clamp(20px,5vw,24px)] py-[clamp(12px,3vw,16px)] rounded-[clamp(8px,2vw,12px)] font-semibold text-[clamp(0.875rem,3vw,1rem)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer";

export const ExitConfirmationOverlay = ({ setShowExitOverlay }: Props) => {
  const router = useRouter();

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[9999] p-[clamp(16px,5vw,32px)] bg-black/50"
      onClick={() => setShowExitOverlay(false)}
    >
      <div
        className="relative w-full max-w-[500px] rounded-[clamp(16px,3vw,24px)] p-[clamp(20px,5vw,32px)] text-center overflow-hidden animate-fade-in-up border bg-white border-gray-200 shadow-xl shadow-black/10 dark:bg-gray-800 dark:border-gray-600 dark:shadow-black/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-[clamp(16px,4vw,24px)] w-[clamp(60px,15vw,80px)] h-[clamp(60px,15vw,80px)] rounded-full flex items-center justify-center border-2 animate-ring-pulse bg-red-50 border-red-500 dark:bg-red-900/50 dark:border-red-600">
          <svg
            className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] stroke-[#ef4444] dark:stroke-[#dc2626]"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        <h2 className="text-[clamp(1.25rem,5vw,1.75rem)] font-extrabold mb-[clamp(8px,2vw,12px)] leading-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Are you sure you want to leave?
        </h2>

        <p className="mb-[clamp(20px,5vw,28px)] text-[clamp(0.875rem,3vw,1rem)] leading-relaxed text-gray-600 dark:text-gray-300">
          Your current quiz progress will be lost if you exit now.
        </p>

        <div className="flex gap-[clamp(12px,3vw,16px)] justify-center flex-wrap">
          <button
            className={`${buttonBase} border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30`}
            onClick={() => setShowExitOverlay(false)}
          >
            Cancel
          </button>

          <button
            className={`${buttonBase} text-white bg-red-500 shadow-lg shadow-red-500/30 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/40 dark:bg-red-600 dark:shadow-red-500/20 dark:hover:bg-red-700 dark:hover:shadow-red-500/30`}
            onClick={() => {
              router.push("/");
              setShowExitOverlay(false);
            }}
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
