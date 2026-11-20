import Link from "next/link";
import FeatureTile from "../component/FeatureTile";

const step = (number: number) => (
  <span className="text-white font-bold text-xl">{number}</span>
);

export default function Rules() {
  return (
    <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="card w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm relative overflow-hidden">
        <div className="accent-bar"></div>

        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-gradient text-2xl md:text-4xl font-extrabold mb-2">
            Quiz Rules
          </h1>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
            How to play and score points
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12">
          <FeatureTile icon={step(1)} title="Choose Your Length">
            Each quiz has{" "}
            <span className="font-semibold">5 to 20 questions</span> from your
            selected category. You can change this in Settings.
          </FeatureTile>
          <FeatureTile icon={step(2)} title="One Timer">
            You get <span className="font-semibold">one timer</span> for the
            whole quiz, from 1 to 5 minutes or no limit. When it runs out, your
            answers are submitted.
          </FeatureTile>
          <FeatureTile icon={step(3)} title="Scoring System">
            Each correct answer is worth{" "}
            <span className="font-semibold">1 point</span>. You can review
            every question once the quiz is done.
          </FeatureTile>
          <FeatureTile icon={step(4)} title="No Penalties">
            There&apos;s <span className="font-semibold">no penalty</span> for
            wrong or skipped answers, so it&apos;s always worth a guess.
          </FeatureTile>
        </div>

        <div className="text-center">
          <Link href="/" className="btn-pill">
            Got It - Let&apos;s Play!
          </Link>
        </div>
      </div>
    </div>
  );
}
