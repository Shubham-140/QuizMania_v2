import Link from "next/link";
import type { ReactNode } from "react";

type Card = {
  title: string;
  text: string;
  iconClassName: string;
  icon: ReactNode;
};

type Props = {
  badgeClassName: string;
  badgeIcon: ReactNode;
  heading: string;
  headingClassName: string;
  title: string;
  message: string;
  cards: Card[];
  actionLabel: string;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "white",
  strokeWidth: "2",
};

export default function StatusPage({
  badgeClassName,
  badgeIcon,
  heading,
  headingClassName,
  title,
  message,
  cards,
  actionLabel,
}: Props) {
  return (
    <div className="page-bg min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="card w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm relative overflow-hidden text-center">
        <div className="accent-bar"></div>

        <div className="mb-8">
          <div
            className={`w-24 h-24 rounded-full flex justify-center items-center mx-auto mb-6 ${badgeClassName}`}
          >
            <svg width="48" height="48" {...iconProps}>
              {badgeIcon}
            </svg>
          </div>

          <h1
            className={`font-extrabold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${headingClassName}`}
          >
            {heading}
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => (
            <div key={card.title} className="tile">
              <div
                className={`w-12 h-12 rounded-xl flex justify-center items-center mb-4 mx-auto ${card.iconClassName}`}
              >
                <svg width="24" height="24" {...iconProps}>
                  {card.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="btn-pill"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
