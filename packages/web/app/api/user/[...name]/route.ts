import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
export const GET = async (
  req: NextRequest,
  { params }: { params: { name: string[] } },
) => {
  const userName = params.name.join("/");

  const user = await prisma.user.findFirst({ where: { name: userName } });

  if (!user) {
    return Response.json({ success: false, message: "User not found" });
  }

  const commands = await prisma.command.groupBy({
    by: ["authorId", "commandName"],
    where: {
      authorId: user.id,
    },
    _sum: {
      downloadCount: true,
    },
    _max: {
      createdAt: true,
    },
  });
  return Response.json({
    success: true,
    data: Object.assign({}, user, { commands }),
  });
};
