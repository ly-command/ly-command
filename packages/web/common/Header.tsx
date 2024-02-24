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
  const session = useSession();
  const userName = session.data?.user?.name;

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <header className="w-full shadow">
      <div className="container mx-auto flex h-14 items-center justify-between">
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
              <DropdownItem key={"user"} href={`/user/${userName}`}>
                个人中心
              </DropdownItem>
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
      </div>
    </header>
  );
};

export default Header;
