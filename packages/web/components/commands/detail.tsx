import { Command } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { useMemo } from "react";
import { formatDownloadNum } from "@/utils/number";

import MarkdownComponent from "@/common/Markdown";
dayjs.extend(relativeTime);
export default function CommandDetail(props: {
  pkg: Record<string, any>;
  command: Command;
}) {
  const { command } = props;
  const { commandName, version, createdAt, downloadCount, readmeContent } =
    command;
  const desc = useMemo(() => {
    return `版本 ${version} • 发布于 ${dayjs(createdAt).locale("zh-cn").fromNow()} • 下载量 ${formatDownloadNum(downloadCount)}`;
  }, [version, createdAt, downloadCount]);
  return (
    <div className="mt-10 ">
      <h1 className="text-xl font-bold">{commandName}</h1>
      <div className="my-2 flex items-center justify-between text-sm">
        {desc}
      </div>
      <MarkdownComponent className="mr-5 mt-5" content={readmeContent} />
    </div>
  );
}
