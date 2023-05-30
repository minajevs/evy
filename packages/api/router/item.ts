import { newCollectionSchema, newItemSchema } from '../schemas'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc/trpc'

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newItemSchema.extend())
    .mutation(({ ctx, input: { name, description } }) => {
      return ctx.prisma.item.create({
        data: {
          name,
          description,
          userId: ctx.auth.userId,
          createdAt: new Date(),
        },
      })
    }),
})
