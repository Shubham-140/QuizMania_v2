"use client";
import { useEffect, useRef, useState } from "react";

export const CountdownOverlay = ({ onFinish }: { onFinish: () => void }) => {
  const [count, setCount] = useState(3);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
    onFinishRef.current();
  }, [count]);

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col justify-center items-center p-5 text-center backdrop-blur-sm bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(0,0,0,0.9)]">
      <div className="text-[clamp(1.5rem,6vw,2.5rem)] font-semibold mb-[clamp(0.5rem,3vw,1.5rem)] text-[#333333] [text-shadow:0_2px_4px_rgba(0,0,0,0.1)] dark:text-[#f5f5f5] dark:[text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
        Quiz starts in...
      </div>

      <div className="w-full box-border px-5 my-2 text-center text-[clamp(5rem,20vw,10rem)] font-extrabold leading-none animate-count-pulse bg-[linear-gradient(135deg,#10b981,#3b82f6)] bg-clip-text [-webkit-text-fill-color:transparent] [text-shadow:0_4px_12px_rgba(16,185,129,0.3)] dark:bg-[linear-gradient(135deg,#10b981,#60a5fa)] dark:[text-shadow:0_4px_12px_rgba(16,185,129,0.2)]">
        {count > 0 ? count : "GO!"}
      </div>

      {count > 0 && (
        <div className="w-[clamp(180px,50vw,300px)] h-1.5 rounded-[3px] overflow-hidden mt-[clamp(1rem,4vw,2rem)] bg-[#e5e7eb] dark:bg-[#4b5563]">
          <div
            className="h-full rounded-[3px] transition-[width] duration-500 ease-[ease] bg-[linear-gradient(90deg,#10b981,#3b82f6)] dark:bg-[linear-gradient(90deg,#10b981,#60a5fa)]"
            style={{ width: `${(4 - count) * 33.33}%` }}
          />
        </div>
      )}
    </div>
  );
};
