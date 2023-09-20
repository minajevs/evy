import { editItemSchema, newItemSchema } from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'

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
  update: protectedProcedure
    .input(editItemSchema)
    .mutation(({ ctx, input: { itemId, name, description } }) => {
      return ctx.prisma.item.update({
        data: {
          name,
          description,
        },
        where: {
          id: itemId,
        },
      })
    }),
})
