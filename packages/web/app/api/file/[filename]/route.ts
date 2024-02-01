import { NextRequest } from "next/server";

import oss from "@/lib/oss";

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
    return new Response(result.content, {
      headers: {
        "content-type": headers["content-type"],
      },
    });
  } catch (e) {
    return new Response("not found", { status: 404 });
  }
};
