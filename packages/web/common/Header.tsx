"use client";

import { RiSunFill, RiMoonFill } from "react-icons/ri";
import { useTheme } from "next-themes";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { HiCommandLine } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import UserButton from "./UserButton";
import useMounted from "@/hooks/useMounted";
const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { isMounted } = useMounted();
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <header className="container mx-auto flex h-12 items-center justify-between px-4">
      <div className="flex">
        <div className="flex items-center  font-medium tracking-widest">
          <Link className="flex items-center" href={"/"}>
            <HiCommandLine size={40} />
            <span className="font-mono text-2xl">ly</span>
          </Link>
        </div>
      </div>
      <div className="flex items-center ">
        <Button
          className="mr-2 text-medium"
          isIconOnly
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isMounted ? isDark ? <RiSunFill /> : <RiMoonFill /> : null}
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <UserButton />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              key={"logout"}
              className="text-danger"
              color="danger"
              onClick={() => signOut()}
            >
              退出登陆
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
