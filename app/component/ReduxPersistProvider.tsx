"use client";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";

export function ReduxPersistProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}