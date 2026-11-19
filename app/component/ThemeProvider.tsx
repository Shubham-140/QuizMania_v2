"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { THEME_COOKIE_MAX_AGE, THEME_KEY } from "@/lib/theme";

type ThemeContextValue = {
  lightMode: boolean;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(light: boolean) {
  const theme = light ? "light" : "dark";
  document.documentElement.classList.toggle("dark", !light);
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.cookie = `${THEME_KEY}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
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

function getSnapshot() {
  return !document.documentElement.classList.contains("dark");
}

export function ThemeProvider({
  children,
  initialLight,
}: {
  children: React.ReactNode;
  initialLight: boolean;
}) {
  const lightMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialLight
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
