import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { AdapterUser } from "@auth/core/adapters";

export const { handlers, auth } = NextAuth({
  pages: {},
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: `${process.env.AUTH_GITHUB_ID}`,
      clientSecret: `${process.env.AUTH_GITHUB_SECRET}`,
    }),
  ],
  callbacks: {
    // fix: build type error
    session({ session, user }: any) {
      console.log(user);
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
