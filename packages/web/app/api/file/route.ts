import { NextResponse } from "next/server";

import oss from "@/lib/oss";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "__" + file.name.replaceAll(" ", "_");
  const result = await oss.put(filename, buffer, {
    headers: {
      "x-oss-forbid-overwrite": true,
    },
  });
  return Response.json({ success: true, data: result });
};
