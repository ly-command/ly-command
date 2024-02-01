import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = () => {
  return new NextResponse(cookies().toString());
};
