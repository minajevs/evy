import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type PrismaClient } from '@prisma/client'
import { type AdapterUser, type Adapter } from 'next-auth/adapters'
import { prisma } from '@evy/db'
import { slugify } from './slugify'
import { customAlphabet } from 'nanoid'

const slugId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5)

export const getAdapter = () =>
  ({
    ...PrismaAdapter(prisma as unknown as PrismaClient),
    async createUser(user) {
      const userExist = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      })

      if (userExist) {
        return userExist as unknown as AdapterUser
      }

      const username = slugify(user.name ?? user.email.split('@')[0]!)
      const fullUsername = `${username}-${slugId()}`

      return prisma.user.create({
        data: {
          email: user.email,
          name: user.name || user.email.split('@')[0],
          username: fullUsername,
          emailVerified: user.emailVerified,
          createdAt: new Date(),
        },
      }) as unknown as AdapterUser // TODO: revisit
    },
  }) satisfies Adapter
