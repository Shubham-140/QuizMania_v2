import { Suspense } from "react";
import HomePage from "./component/HomePage";
import ContinueQuizBanner from "./component/ContinueQuizBanner";

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
