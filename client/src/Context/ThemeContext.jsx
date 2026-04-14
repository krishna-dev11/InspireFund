import React, { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("app_theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
