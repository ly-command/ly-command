import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const commands = await prisma.command.findMany({
    where: {
      commandName: {
        contains: search,
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return Response.json(commands);
};

export const POST = async (req: Request) => {
  const { commandName, packageJSON, zipUrl, version } = await req.json();
  const result = await prisma.command.create({
    data: { version, commandName, packageJSON, zipUrl },
  });
  return Response.json(result);
};
