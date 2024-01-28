"use client";

import { RiSunFill, RiMoonFill } from "react-icons/ri";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { HiCommandLine } from "react-icons/hi2";
import { useEffect, useState } from "react";
const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <header className="container mx-auto flex h-12 items-center justify-between px-4">
      <div className="flex">
        <div className="flex items-center  font-medium tracking-widest">
          <HiCommandLine size={40} />
          <span className="font-mono text-2xl">ly</span>
        </div>
      </div>
      <div className="">
        <Button
          className="text-medium"
          isIconOnly
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <RiSunFill /> : <RiMoonFill />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
