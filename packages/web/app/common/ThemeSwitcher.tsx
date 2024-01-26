"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const change = () => {
      const themeMode = dark.matches ? "dark" : "light";
      console.log("🎨应用主题:", themeMode);
      setTheme(themeMode);
    };
    change();
    dark.addEventListener("change", change);
    return () => {
      dark.removeEventListener("change", change);
    };
  }, [setTheme]);
  return null;
};
