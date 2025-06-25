import { useDispatch, useSelector } from "react-redux";
import {
  setScore,
  setTimeTaken,
} from "../features/performance/performanceSliceInfo";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";

interface PropTypes {
  selectedIndex: number[];
  correctIndices: number[];
  localTotalTime: number;
  setSubmitOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubmitQuizModal = ({
  setSubmitOverlay,
  selectedIndex,
  correctIndices,
  localTotalTime,
}: PropTypes) => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const totalTime = useSelector(
    (state: RootState) => state.userChoices.totalTime
  );
  const numberOfQuestions = useSelector(
    (state: RootState) => state.userChoices.numberOfQuestions
  );
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div
      className={`fixed inset-0 z-[1000] flex justify-center items-center p-4 font-inter backdrop-blur-md
      ${lightMode ? "bg-black/50" : "bg-black/70"}`}
    >
      <div
        className={`relative w-full max-w-[500px] rounded-2xl p-8 text-center overflow-hidden
        ${
          lightMode
            ? "bg-white/96 border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            : "bg-slate-900/96 border border-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10" />

        {/* Warning Icon */}
        <div
          className={`w-20 h-20 rounded-full flex justify-center items-center mx-auto mb-6 border-2
          ${
            lightMode
              ? "bg-red-50 border-red-200"
              : "bg-red-900/30 border-red-500"
          }`}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke={lightMode ? "#ef4444" : "#fca5a5"}
            strokeWidth="2"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h2
          className={`text-[clamp(1.5rem,5vw,1.75rem)] font-bold mb-4 leading-tight
          ${lightMode ? "text-slate-900" : "text-slate-50"}`}
        >
          Submit Your Quiz?
        </h2>

        {/* Message */}
        <p
          className={`text-[clamp(1rem,3vw,1.125rem)] mb-8 leading-relaxed
          ${lightMode ? "text-slate-600" : "text-slate-400"}`}
        >
          Are you sure you want to submit your answers? You won&apos;t be able
          to make changes after submission.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            className={`px-6 py-3 rounded-xl border font-semibold text-base min-w-[120px] transition-all duration-200
              ${
                lightMode
                  ? "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100 hover:-translate-y-0.5"
                  : "bg-slate-800 border-slate-700 text-slate-50 hover:bg-slate-700 hover:-translate-y-0.5"
              }`}
            onClick={() => setSubmitOverlay(false)}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold text-base min-w-[120px] text-white transition-all duration-200
              bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5
              ${
                lightMode
                  ? "shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)]"
                  : "shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)]"
              }`}
            onClick={async () => {
              let localScore = 0;
              for (let i = 0; i < numberOfQuestions; i++) {
                if (selectedIndex[i] === correctIndices[i]) {
                  localScore++;
                }
              }
              dispatch(setScore(localScore));
              dispatch(setTimeTaken(totalTime - localTotalTime));
              await fetch("/api/user/quizAttended", {
                method: "PATCH",
              });
              router.push("/score");
            }}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
