"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type ThemeContextValue = {
  lightMode: boolean;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "quizmania-theme";

function applyTheme(light: boolean) {
  document.documentElement.classList.toggle("dark", !light);
  document.documentElement.style.colorScheme = light ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, light ? "light" : "dark");
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", onStoreChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStoreChange);
  };
}

/** Reads theme already applied by the blocking layout script (before React paints). */
function getSnapshot() {
  return !document.documentElement.classList.contains("dark");
}

/** Matches SSR default (dark). */
function getServerSnapshot() {
  return false;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const lightMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggleMode = useCallback(() => {
    applyTheme(!getSnapshot());
  }, []);

  const value = useMemo(
    () => ({ lightMode, toggleMode }),
    [lightMode, toggleMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
