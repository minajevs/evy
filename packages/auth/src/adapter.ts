import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type PrismaClient } from '@prisma/client'
import { type Adapter, type AdapterUser } from 'next-auth/adapters'
import { prisma } from '@evy/db'

export const getAdapter = () =>
  ({
    ...PrismaAdapter(prisma as unknown as PrismaClient),
    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (session === null) return null
      return {
        user: session.user as AdapterUser, // TODO: revisit this cast
        session,
      }
    },
  }) satisfies Adapter
