"use client";
import { Snippet } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="flex justify-center">
      <Snippet className="my-10 bg-transparent text-3xl" variant="bordered">
        npm install -g ly-command
      </Snippet>
    </div>
  );
}
