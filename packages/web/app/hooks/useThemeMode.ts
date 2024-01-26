import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export const useThemeMode = (defaultThemeMode: ThemeMode = "light") => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultThemeMode);

  const modeMe = (e: MediaQueryListEvent) => {
    setThemeMode(e.matches ? "dark" : "light");
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    setThemeMode(matchMedia.matches ? "dark" : "light");
    matchMedia.addEventListener("change", modeMe);

    return () => matchMedia.removeEventListener("change", modeMe);
  }, []);

  return themeMode;
};
