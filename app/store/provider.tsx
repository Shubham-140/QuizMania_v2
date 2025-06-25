"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import { useRef } from "react";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<ReturnType<typeof store>>(null);

  if (!storeRef.current) {
    storeRef.current = store();
  }

  return <Provider store={store()}>{children}</Provider>;
}
