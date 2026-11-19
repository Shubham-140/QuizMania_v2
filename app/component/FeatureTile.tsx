import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export default function FeatureTile({ icon, title, children }: Props) {
  return (
    <div className="tile">
      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="leading-relaxed text-gray-600 dark:text-gray-400">
        {children}
      </p>
    </div>
  );
}
