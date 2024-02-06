"use client";
import { Link, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAsyncEffect } from "ahooks";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import confetti from "canvas-confetti";
function isValidUrl(url: string | null): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

const getCookies = () => {
  return fetch("/api/cookie").then((res) => res.text());
};
export default function Page({ searchParams }: any) {
  const { data, status } = useSession();
  const callback = searchParams["callback"] ?? "";
  console.log(callback);
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("github", { callbackUrl: window.location.href });
    }
  }, [status]);
  useAsyncEffect(async () => {
    if (status !== "authenticated") return;
    const user = data?.user;
    if (!user) return;
    if (isValidUrl(callback) && user) {
      try {
        const res = await fetch(callback + `?user=${data.user.name ?? ""}`, {
          method: "POST",
          headers: {
            auth: await getCookies(),
          },
        }).then((res) => res.text());
        if (res === "ok") {
          setIsLogin(true);
          confetti();
        } else {
          setIsError(true);
        }
      } catch (err) {
        setIsError(true);
      }
    }
  }, [data?.user, status, callback]);
  if (isError || isLogin)
    return (
      <div className="flex flex-col items-center">
        <h1
          className={
            "mb-10 mt-10 text-3xl " + (isLogin ? "text-success" : "text-danger")
          }
        >
          {isLogin ? "终端登录成功" : "终端登录失败"}
        </h1>
        <Link
          href={"/"}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            router.replace("/");
          }}
        >
          回到主页
        </Link>
      </div>
    );

  return <Spinner label="登陆中，请稍后..." labelColor="primary" />;
}
