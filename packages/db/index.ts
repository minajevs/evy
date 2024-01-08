import { PrismaClient as PrismaClientWithoutExtension } from '@prisma/client'
import { markdownToSafeHTML } from './src/markdown'

export * from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: typeof extendedPrisma
  prismaWithoutClientExtensions: PrismaClientWithoutExtension
}

const logQueries = false

const customPrisma = new PrismaClientWithoutExtension({
  log:
    process.env.NODE_ENV === 'development'
      ? [{ emit: 'event', level: 'query' }, 'error', 'warn']
      : ['error'],
})

customPrisma.$on('query', (e) => {
  if (!logQueries) return
  console.log(`[${e.duration}ms] ${e.query}`)
})

const prismaWithoutClientExtensions =
  globalForPrisma.prismaWithoutClientExtensions ?? customPrisma

const extendedPrisma = prismaWithoutClientExtensions
  .$extends({
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
  .$extends({
    result: {
      item: {
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

export const prisma = globalForPrisma.prisma ?? extendedPrisma

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaWithoutClientExtensions = prismaWithoutClientExtensions
}

type CustomPrisma = typeof prisma
export type PrismaClient = CustomPrisma
export default prisma
