"use client";
import { useEffect, useState } from "react";
import PageLoader from "../../../component/PageLoader";

export default function CalculatingOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[2000]">
      <PageLoader message="Calculating your score..." />
    </div>
  );
}
