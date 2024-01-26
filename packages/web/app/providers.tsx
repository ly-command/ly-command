// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "./common/ThemeSwitcher";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <ThemeSwitcher />
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
