import { PrismaClient as PrismaClientWithoutExtension } from '@prisma/client'
import { markdownToSafeHTML } from './src/markdown'

export * from '@prisma/client'

const logQueries = false

const prismaSingleton = () => {
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

  const extendedPrisma = customPrisma
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

  return extendedPrisma
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaSingleton>
}

export const prisma = globalThis.prisma ?? prismaSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

type CustomPrisma = typeof prisma
export type PrismaClient = CustomPrisma
