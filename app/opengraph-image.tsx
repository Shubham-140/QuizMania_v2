import { ImageResponse } from "next/og";

export const alt = "QuizMania: timed quizzes across ten categories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 32,
            background: "white",
            color: "#10b981",
            fontSize: 68,
          }}
        >
          QM
        </div>
        <div style={{ marginTop: 40, fontSize: 96 }}>
          QuizMania
        </div>
        <div style={{ marginTop: 12, fontSize: 38, opacity: 0.9 }}>
          Timed quizzes across ten categories
        </div>
      </div>
    ),
    size
  );
}
