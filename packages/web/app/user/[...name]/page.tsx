import CommandList from "@/components/commands/commandList";
import { withBaseUrl } from "@/utils";
import { Avatar, Tooltip, User } from "@nextui-org/react";

import { User as IUser } from "@prisma/client";
import Link from "next/link";

export const generateMetadata = async ({ params }: { params: any }) => {
  const userName = params.name.join("/");
  return {
    title: `${userName}的个人中心`,
  };
};

export interface CommandData {
  _sum?: { downloadCount: number };
  _max?: { createdAt: string };
  authorId: string;
  commandName: string;
}

interface UserData extends IUser {
  commands: CommandData[];
}

const NotFound = () => (
  <div className="mt-10 flex flex-col text-center text-2xl">
    <div className="text-red-500">User not found</div>
    <Link className="mt-2 text-primary" href={"/"}>
      首页
    </Link>
  </div>
);

export default async function UserPage({
  params,
}: {
  params: { name: string[] };
}) {
  const userName = params.name.join("/");
  const { data } = (await fetch(withBaseUrl(`/api/user/${userName}`), {
    cache: "no-cache",
  }).then((res) => res.json())) as { data: UserData };
  if (!data) {
    return <NotFound />;
  }

  return (
    <div className="container m-auto my-5 md:flex">
      <div className="w-full md:w-64">
        <Avatar
          className="mx-auto  h-32 w-32 text-large"
          src={data.image ?? undefined}
          alt={data.name ?? ""}
        ></Avatar>
        <Tooltip
          color="primary"
          size="lg"
          content={data.name}
          placement="bottom"
        >
          <h1 className="my-2 line-clamp-1 text-center text-xl font-bold">
            {data.name}
          </h1>
        </Tooltip>
      </div>
      <div className="flex-1">
        <CommandList commands={data.commands} userId={data.id} />
      </div>
    </div>
  );
}
