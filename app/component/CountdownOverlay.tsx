import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";

interface QuizType {
  category: string;
  difficulty: string;
}

export const CountdownOverlay = ({ category, difficulty }: QuizType) => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const router = useRouter();

  const theme = {
    light: {
      primary: "#10b981",
      primaryDark: "#059669",
      secondary: "#3b82f6",
      text: "#333333",
      background: "#ffffff",
    },
    dark: {
      primary: "#10b981",
      primaryDark: "#059669",
      secondary: "#60a5fa",
      text: "#f5f5f5",
      background: "#1a1a1a",
    },
  };

  const colors = lightMode ? theme.light : theme.dark;
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(`/quiz/${category}/${difficulty}`);
    }
  }, [count, category, difficulty, router]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: lightMode
          ? "rgba(255,255,255,0.9)"
          : "rgba(0,0,0,0.9)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* "Quiz starts in" message */}
      <div
        style={{
          fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
          fontWeight: 600,
          color: colors.text,
          marginBottom: "clamp(0.5rem, 3vw, 1.5rem)",
          textShadow: `0 2px 4px ${
            lightMode ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)"
          }`,
        }}
      >
        Quiz starts in...
      </div>

      {/* Countdown number - Fixed visibility */}
      <div
        style={{
          fontSize: "clamp(5rem, 20vw, 10rem)", // Reduced maximum size
          fontWeight: 800,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          margin: "0.5rem 0",
          animation: "pulse 1s infinite alternate",
          textShadow: `0 4px 12px ${
            lightMode ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.2)"
          }`,
          padding: "0 20px", // Added padding
          boxSizing: "border-box",
          width: "100%", // Ensure full width
          textAlign: "center",
        }}
      >
        {count > 0 ? count : "GO!"}
      </div>

      {/* Progress indicator */}
      {count > 0 && (
        <div
          style={{
            width: "clamp(180px, 50vw, 300px)", // Smaller width
            height: "6px",
            backgroundColor: lightMode ? "#e5e7eb" : "#4b5563",
            borderRadius: "3px",
            overflow: "hidden",
            marginTop: "clamp(1rem, 4vw, 2rem)",
          }}
        >
          <div
            style={{
              width: `${(4 - count) * 33.33}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: "3px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};
