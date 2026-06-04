import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("[db] DATABASE_URL is not set")
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === Symbol.toStringTag) return "PrismaClient"
        throw new Error("DATABASE_URL is not set")
      },
    })
  }

  try {
    const adapter = new PrismaPg({ connectionString })
    return new PrismaClient({ adapter })
  } catch (e) {
    console.error("[db] Failed to create PrismaClient:", e)
    throw e
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
