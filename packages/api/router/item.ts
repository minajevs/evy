import { TRPCError } from '@trpc/server'
import { editItemSchema, newItemSchema } from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newItemSchema)
    .mutation(async ({ ctx, input: { name, description, collectionId } }) => {
      const collection = await ctx.prisma.collection.findFirst({
        where: {
          id: collectionId,
        },
      })
      if (collection === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Collection with id not found',
        })

      return ctx.prisma.item.create({
        data: {
          name,
          description,
          collectionId: collection.id,
          createdAt: new Date(),
        },
      })
    }),
  update: protectedProcedure
    .input(editItemSchema)
    .mutation(({ ctx, input: { id, name, description } }) => {
      return ctx.prisma.item.update({
        data: {
          name,
          description,
        },
        where: {
          id,
          collection: {
            userId: ctx.session.user.id,
          },
        },
      })
    }),
})
