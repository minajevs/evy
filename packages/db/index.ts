import { PrismaClient } from '@prisma/client'
import { markdownToSafeHTML } from './src/markdown'

export * from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: typeof extendedPrisma }

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

const extendedPrisma = logPrisma.$extends({
  result: {
    collection: {
      htmlDescription: {
        needs: { description: true },
        compute(data) {
          return data.description !== null
            ? markdownToSafeHTML(data.description)
            : null
        },
      },
    },
  },
})

export const prisma = globalForPrisma.prisma || extendedPrisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
