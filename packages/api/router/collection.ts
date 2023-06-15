import { newCollectionSchema } from '../schemas'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc/trpc'

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCollectionSchema)
    .mutation(({ ctx, input: { name, description } }) => {
      return ctx.prisma.collection.create({
        data: {
          name,
          description,
          userId: ctx.session.user.id,
          createdAt: new Date(),
        },
      })
    }),
})
