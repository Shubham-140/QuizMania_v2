import { Suspense } from "react";
import HomePage from "@/app/component/HomePage";
import ContinueQuizBanner from "@/app/component/ContinueQuizBanner";

export default function Home() {
  return (
    <HomePage
      continueBanner={
        <Suspense fallback={null}>
          <ContinueQuizBanner />
        </Suspense>
      }
    />
  );
}
