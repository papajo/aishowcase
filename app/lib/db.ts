import { PrismaClient } from "./generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    // Return a proxy that throws meaningful errors when queried
    // This allows build-time to succeed without a database
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === Symbol.toStringTag) return "PrismaClient"
        throw new Error(
          "DATABASE_URL is not set. Cannot query database during build."
        )
      },
    })
  }

  // Dynamic import to avoid build-time issues
  try {
    const { PrismaPg } = require("@prisma/adapter-pg")
    const adapter = new PrismaPg({ connectionString })
    return new PrismaClient({ adapter })
  } catch {
    // If adapter fails, return proxy that throws on query
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === Symbol.toStringTag) return "PrismaClient"
        throw new Error(
          "Failed to initialize database adapter. Check DATABASE_URL."
        )
      },
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
