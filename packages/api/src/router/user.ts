import { editUserSchema, verifyUsernameSchema } from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(editUserSchema)
    .mutation(({ ctx, input: { name, username } }) => {
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
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      })
      return existingUser === null
    }),
})
