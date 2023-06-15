import { newItemSchema } from '../schemas'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc/trpc'

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newItemSchema)
    .mutation(({ ctx, input: { name, description, collectionId } }) => {
      return ctx.prisma.item.create({
        data: {
          name,
          description,
          collectionId,
          createdAt: new Date(),
        },
      })
    }),
})
