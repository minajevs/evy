import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc/trpc'
import { editUserSchema, verifyUsernameSchema } from './schemas'
import { checkUsernameAvailable } from '../../lib/checkUsernameAvailable'
import { checkUsernameBlocked } from '../../lib/checkUsernameBlocked'
import { urlSafeRegex } from '../../constants/validation'

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
  verifyUsernameAvailable: publicProcedure
    .input(verifyUsernameSchema)
    .query(async ({ input: { username } }) => {
      const available = await checkUsernameAvailable(username)
      const blocked = checkUsernameBlocked(username)
      return available && !blocked
    }),
})
