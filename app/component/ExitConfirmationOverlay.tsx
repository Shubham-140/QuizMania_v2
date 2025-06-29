import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";

interface Props {
  setShowExitOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExitConfirmationOverlay = ({ setShowExitOverlay }: Props) => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const router = useRouter();

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] p-[clamp(16px,5vw,32px)] bg-black/50"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      onClick={() => setShowExitOverlay(false)}
    >
      <div
        className={`relative w-full max-w-[500px] rounded-[clamp(16px,3vw,24px)] p-[clamp(20px,5vw,32px)] text-center overflow-hidden animate-fadeInUp ${
          lightMode
            ? "bg-white border border-gray-200 shadow-xl shadow-black/10"
            : "bg-gray-800 border border-gray-600 shadow-xl shadow-black/30"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon with animated pulse effect */}
        <div
          className={`mx-auto mb-[clamp(16px,4vw,24px)] w-[clamp(60px,15vw,80px)] h-[clamp(60px,15vw,80px)] rounded-full flex items-center justify-center border-2 ${
            lightMode
              ? "bg-red-50 border-red-500"
              : "bg-red-900/50 border-red-600"
          } animate-pulse`}
        >
          <svg
            className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke={lightMode ? "#ef4444" : "#dc2626"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        {/* Title with gradient text */}
        <h2
          className={`text-[clamp(1.25rem,5vw,1.75rem)] font-extrabold mb-[clamp(8px,2vw,12px)] leading-tight bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent`}
        >
          Are you sure you want to leave?
        </h2>

        {/* Description */}
        <p
          className={`mb-[clamp(20px,5vw,28px)] text-[clamp(0.875rem,3vw,1rem)] leading-relaxed ${
            lightMode ? "text-gray-600" : "text-gray-300"
          }`}
        >
          Your current quiz progress will be lost if you exit now.
        </p>

        {/* Buttons container */}
        <div className="flex gap-[clamp(12px,3vw,16px)] justify-center flex-wrap">
          {/* Cancel button */}
          <button
            className={`flex-1 min-w-[120px] px-[clamp(20px,5vw,24px)] py-[clamp(12px,3vw,16px)] rounded-[clamp(8px,2vw,12px)] border-2 font-semibold text-[clamp(0.875rem,3vw,1rem)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              lightMode
                ? "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                : "border-emerald-500 text-emerald-500 hover:bg-emerald-900/30"
            }`}
            onClick={() => setShowExitOverlay(false)}
          >
            Cancel
          </button>

          {/* Exit button */}
          <button
            className={`flex-1 min-w-[120px] px-[clamp(20px,5vw,24px)] py-[clamp(12px,3vw,16px)] rounded-[clamp(8px,2vw,12px)] font-semibold text-[clamp(0.875rem,3vw,1rem)] text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
              lightMode
                ? "bg-red-500 shadow-lg shadow-red-500/30 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/40"
                : "bg-red-600 shadow-lg shadow-red-500/20 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/30"
            }`}
            onClick={() => {
              router.push("/");
              setShowExitOverlay(false);
            }}
          >
            Exit Quiz
          </button>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out;
          }
          .animate-pulse {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
            }
            70% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
