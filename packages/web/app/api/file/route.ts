import OSS from "ali-oss";
import { NextResponse } from "next/server";
// 初始化OSS客户端。请将以下参数替换为您自己的配置信息。
const client = new OSS({
  region: "oss-cn-beijing", // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
  bucket: "ly-command", // 示例：'my-bucket-name'，填写存储空间名称。
});

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "__" + file.name.replaceAll(" ", "_");
  const result = await client.put(filename, buffer, {
    headers: {
      "x-oss-forbid-overwrite": true,
    },
  });
  return Response.json(result);
};
