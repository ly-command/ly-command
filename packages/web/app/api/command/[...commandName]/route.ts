import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
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

export const DELETE = async (
  req: Request,
  { params }: { params: { commandName: string[] } },
) => {
  const session = await auth();
  const currentUserId = session?.user.id;
  if (!currentUserId) {
    return Response.json(
      { success: false, message: "You must be signed in to delete a command" },
      { status: 401 },
    );
  }
  const commandName = params.commandName.join("/");
  const command = await prisma.command.findFirst({
    where: {
      commandName,
      authorId: currentUserId,
    },
  });
  if (!command) {
    return Response.json(
      { success: false, message: "Command not found" },
      { status: 404 },
    );
  }
  await prisma.command.deleteMany({
    where: {
      commandName,
      authorId: currentUserId,
    },
  });
  return Response.json({ success: true });
};
