import { PrismaClient } from "../generated/prisma/index.js";
import { env } from "./env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (env.NODE_ENV === "production") globalForPrisma.prisma = prisma;

export { prisma };
