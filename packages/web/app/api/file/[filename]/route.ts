import { NextRequest } from "next/server";

import oss from "@/lib/oss";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { filename: string } },
) => {
  const { filename } = params;
  try {
    const result = await oss.get(filename);
    if (result.res.status !== 200) {
      return new Response("not found", { status: 404 });
    }
    const headers = result.res.headers as Record<string, string>;

    // 记录下载量
    Promise.resolve().then(async () => {
      try {
        const command = await prisma.command.findFirst({
          where: {
            sourceId: { equals: filename },
          },
        });
        if (!command) return;
        await prisma.command.update({
          where: { id: command.id },
          data: {
            downloadCount: command.downloadCount + 1,
          },
        });
      } catch (e) {
        console.log(e);
      }
    });

    return new Response(result.content, {
      headers: {
        "content-type": headers["content-type"],
      },
    });
  } catch (e) {
    return new Response("not found", { status: 404 });
  }
};
