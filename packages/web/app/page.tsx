import Commands from "@/components/commands";
import { Snippet } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center">
      <Snippet
        className="mb-20 mt-10 bg-transparent text-lg dark:text-purple-600 md:text-3xl"
        variant="bordered"
      >
        npm install -g ly-command
      </Snippet>
      <Commands />
    </div>
  );
}
