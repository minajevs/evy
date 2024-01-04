import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

const logQueries = false

const logPrisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? [{ emit: 'event', level: 'query' }, 'error', 'warn']
      : ['error'],
})

logPrisma.$on('query', (e) => {
  if (!logQueries) return
  console.log(`[${e.duration}ms] ${e.query}`)
})

export const prisma = globalForPrisma.prisma || logPrisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
