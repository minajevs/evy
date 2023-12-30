import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../../trpc/trpc'
import { prisma } from '@evy/db'
import blocklist from './username-blocklist'
import { editUserSchema, verifyUsernameSchema } from './schemas'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

const checkUsernameAvailable = async (username: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
  })
  return existingUser === null
}

const checkUsernameBlocked = (username: string) => {
  return blocklist.includes(username)
}

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ ctx, input: { name, username } }) => {
      if (!urlSafeRegex.test(username)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username is in incorrect format',
        })
      }

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (user === null) throw new TRPCError({ code: 'BAD_REQUEST' })

      if (user.username !== username) {
        if (!(await checkUsernameAvailable(username))) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username is unavailable',
          })
        }

        if (checkUsernameBlocked(username)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username is unavailable',
          })
        }
      }

      return ctx.prisma.user.update({
        data: {
          name,
          username,
        },
        where: {
          id: ctx.session.user.id,
        },
      })
    }),
  verifyUsernameAvailable: protectedProcedure
    .input(verifyUsernameSchema)
    .query(async ({ ctx, input: { username } }) => {
      const available = await checkUsernameAvailable(username)
      const blocked = checkUsernameBlocked(username)
      return available && !blocked
    }),
})
