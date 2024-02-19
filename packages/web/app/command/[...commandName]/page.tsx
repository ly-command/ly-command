import CommandDetail from "@/components/commands/detail";
import VersionList from "@/components/commands/versionList";
import { withBaseUrl } from "@/utils";
import { Button, Snippet } from "@nextui-org/react";

import { Command } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

const getCommandName = (params: { commandName: string[] }) => {
  return decodeURIComponent(params.commandName.join("/"));
};
const getVersion = (searchParams: { version: string }) => {
  return searchParams.version;
};

// or Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  return {
    title: getCommandName(params),
  };
}

const NotFound = (props: { text?: ReactNode }) => {
  const { text = "404 Not Found" } = props;
  return <div className="mt-20 text-center text-2xl font-bold">{text}</div>;
};

export default async function Page(res: { params: any; searchParams: any }) {
  const commandName = getCommandName(res.params);
  const version = getVersion(res.searchParams);
  const { data } = (await fetch(withBaseUrl(`/api/command/${commandName}`), {
    cache: "no-cache",
  }).then((res) => res.json())) as { data: Command[] };
  const displayCommand = version
    ? data.find((v) => v.version === version)
    : data[0];
  const packageJSON = displayCommand?.packageJSON?.toString();
  const pkg = JSON.parse(packageJSON || "{}");
  if (data.length === 0) return <NotFound />;
  if (!displayCommand)
    return (
      <NotFound
        text={
          <div>
            <div>
              【{commandName}】没找到指定版本-{version}
            </div>
            <Link href={`/command/${commandName}`}>
              <Button className="mt-10" color="primary">
                返回最新版本
              </Button>
            </Link>
          </div>
        }
      />
    );
  return (
    <div className="container m-auto md:flex">
      <div className="flex-1">
        <CommandDetail pkg={pkg} command={displayCommand} />
      </div>
      <div className="w-full md:w-96">
        <Snippet
          className="mb-5 mt-10 w-full overflow-auto"
          variant="bordered"
        >{`ly install ${commandName}`}</Snippet>
        <VersionList data={data} />
      </div>
    </div>
  );
}
