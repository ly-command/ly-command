import { auth } from "@/auth";
import prisma, { User } from "@/lib/prisma";
import semver from "semver";
import { NextRequest } from "next/server";
import { createCommandParams } from "@/lib/zod";
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";

  const commands = await prisma.command.groupBy({
    by: ["commandName", "authorId"],
    where: {
      commandName: {
        contains: search,
      },
    },
    _sum: {
      downloadCount: true,
    },
    _max: {
      createdAt: true,
    },
    orderBy: {
      _sum: {
        downloadCount: "desc",
      },
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const result = await Promise.all(
    commands.map((command) =>
      prisma.command
        .findFirst({
          where: {
            commandName: command.commandName,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: { author: true },
        })
        .then((res) => {
          let desc = "";
          try {
            const pkg = JSON.parse(res?.packageJSON?.toString() || "{}");
            desc = pkg.description;
          } catch (e) {
            return;
          }
          return Object.assign({}, command, {
            author: res?.author,
            latestVersion: res?.version,
            desc,
          });
        }),
    ),
  );

  return Response.json({ success: false, data: result });
};

export const POST = async (req: Request) => {
  const session = await auth();

  if (!session) {
    return Response.json(
      {
        success: false,
        message: "You must be signed in to publish a command",
      },
      { status: 401 },
    );
  }

  const result = createCommandParams.safeParse(await req.json());

  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: result.error,
      },
      { status: 400 },
    );
  }

  const { commandName, packageJSON, version, sourceId, readmeContent } =
    result.data;

  if (semver.valid(version) === null) {
    return Response.json(
      { success: false, message: "Invalid version" },
      { status: 400 },
    );
  }
  const command = await prisma.command.findFirst({
    where: {
      commandName,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });
  // 作者必须是当前用户
  if (command && command.author?.id !== session.user.id) {
    // 请检查库已经存在
    return Response.json(
      { success: false, message: `Command "${commandName}" already exists` },
      { status: 400 },
    );
  }

  // 版本必须大于之前的版本
  if (command && semver.lte(version, command.version)) {
    return Response.json(
      {
        success: false,
        message: `Version must be greater than previous. previous: ${command.version}, current: ${version}`,
      },
      { status: 400 },
    );
  }

  const newCommand = await prisma.command.create({
    data: {
      version,
      commandName,
      packageJSON,
      sourceId,
      authorId: session.user.id,
      readmeContent,
    },
  });
  return Response.json({
    success: true,
    data: newCommand,
  });
};
