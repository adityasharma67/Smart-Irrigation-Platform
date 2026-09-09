"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthProvider } from "./AuthProvider";
import { FarmProvider } from "./FarmProvider";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "smart-farming-hub:theme";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preferred = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(stored === "dark" || stored === "light" ? stored : preferred);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [isReady, theme]);

  const value = useMemo(() => ({
    theme,
    isReady,
    setTheme,
    toggleTheme: () => setTheme((value) => (value === "dark" ? "light" : "dark")),
  }), [isReady, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function AppProviders({ children }) {
  return <ThemeProvider><AuthProvider><FarmProvider>{children}</FarmProvider></AuthProvider></ThemeProvider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within AppProviders.");
  return context;
}

export { useAuth } from "./AuthProvider";
export { useFarm } from "./FarmProvider";
