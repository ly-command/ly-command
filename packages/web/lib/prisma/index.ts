import { PrismaClient } from "@prisma/client";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

prisma.$use(
  createSoftDeleteMiddleware({
    models: {
      Command: {
        field: "deletedAt",
        createValue(deleted) {
          if (deleted) return new Date();
          return null;
        },
      },
    },
  }),
);

export type * from "@prisma/client";

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
