"use client";

import { Provider } from "react-redux";
import { store } from "./store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persist rehydrates in the background via persistStore(); no PersistGate
  // so navigation/first paint is not blocked on localStorage.
  return <Provider store={store}>{children}</Provider>;
}
