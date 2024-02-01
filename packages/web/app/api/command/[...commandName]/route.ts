import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const GET = async (
  req: NextRequest,
  { params }: { params: { commandName: string[] } },
) => {
  const commandName = params.commandName.join("/");

  const commands = await prisma.command.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      commandName: {
        equals: commandName,
      },
    },
  });
  return Response.json({ success: true, data: commands });
};
