"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeContextValue = {
  lightMode: boolean;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "quizmania-theme";

function applyTheme(light: boolean) {
  document.documentElement.classList.toggle("dark", !light);
  localStorage.setItem(STORAGE_KEY, light ? "light" : "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default matches prior Redux initialState (dark)
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const light = stored === "light";
    setLightMode(light);
    document.documentElement.classList.toggle("dark", !light);
  }, []);

  const toggleMode = useCallback(() => {
    setLightMode((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
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
