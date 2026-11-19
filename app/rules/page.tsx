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
          <FeatureTile icon={step(1)} title="10 Questions Per Quiz">
            Each quiz consists of{" "}
            <span className="font-semibold">10 questions</span> from your
            selected category.
          </FeatureTile>
          <FeatureTile icon={step(2)} title="15 Second Timer">
            You have <span className="font-semibold">15 seconds</span> to
            answer each question.
          </FeatureTile>
          <FeatureTile icon={step(3)} title="Scoring System">
            Correct answers earn{" "}
            <span className="font-semibold">10 points</span> each, decreasing
            by 1 per second after 5 seconds.
          </FeatureTile>
          <FeatureTile icon={step(4)} title="No Penalties">
            There&apos;s <span className="font-semibold">no penalty</span> for
            wrong answers - only points for correct ones!
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
