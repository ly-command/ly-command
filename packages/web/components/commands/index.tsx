import { withBaseUrl } from "@/utils";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  User,
  Snippet,
} from "@nextui-org/react";
import { CopyIcon } from "@nextui-org/shared-icons";
import { User as Author } from "@prisma/client";
import { MdDownload, MdOutlineUpdate } from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { formatDownloadNum } from "@/utils/number";
import Link from "next/link";

dayjs.extend(relativeTime);

interface CommandItem {
  _sum: { downloadCount: number };
  _max: { createdAt: string };
  commandName: string;
  authorId?: string;
  author?: Author;
  latestVersion: string;
  desc: string;
}

const Commands = async () => {
  const { data } = (await fetch(withBaseUrl("/api/command"), {
    cache: "no-cache",
  }).then((res) => res.json())) as { data: CommandItem[] };

  return (
    <div className=" grid w-full grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((command) => (
        <Link
          className="mx-2  cursor-pointer md:mx-0"
          href={`/command/${command.commandName}`}
        >
          <Card key={command.commandName} className="mx-2  h-full ">
            <CardHeader className="text-lg font-bold">
              {command.commandName}
            </CardHeader>
            <CardBody className="text-sm text-zinc-400">
              <div className="line-clamp-3">{command.desc}</div>
            </CardBody>
            <CardFooter className="flex justify-between">
              <User
                name={command.author?.name}
                avatarProps={{
                  src: command.author?.image ?? undefined,
                  size: "sm",
                }}
              />
              <div className="flex items-center text-small text-zinc-400">
                <MdDownload />
                <span>{formatDownloadNum(command._sum.downloadCount)}</span>
                <MdOutlineUpdate className="ml-2" />
                <span>
                  {dayjs(command._max.createdAt).locale("zh-cn").fromNow()}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Commands;
