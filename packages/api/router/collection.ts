import { newCollectionSchema, updateCollectionNameSchema } from '../schemas'
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
  updateName: protectedProcedure
    .input(updateCollectionNameSchema)
    .mutation(({ ctx, input: { id, name } }) => {
      return ctx.prisma.collection.update({
        where: {
          id,
        },
        data: {
          name,
        },
      })
    }),
})
