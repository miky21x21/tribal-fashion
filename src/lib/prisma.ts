import { PrismaClient } from '../../backend/node_modules/@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/database"
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma