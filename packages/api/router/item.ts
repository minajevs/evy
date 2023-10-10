import { TRPCError } from '@trpc/server'
import { editItemSchema, newItemSchema, verifyItemSlugSchema } from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'
import { slugify } from '@evy/auth/src/slugify'
import { customAlphabet } from 'nanoid'

const slugId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5)

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

      const slug = slugify(name)

      const slugExists = await ctx.prisma.item.findFirst({
        where: {
          collectionId,
          slug,
        },
      })

      return ctx.prisma.item.create({
        data: {
          name,
          description,
          // if slug exists - append random id in the end. Does not guarantee to be collision-free though
          slug: slugExists === null ? slug : `${slug}-${slugId()}`,
          collectionId: collection.id,
          createdAt: new Date(),
        },
      })
    }),
  update: protectedProcedure
    .input(editItemSchema)
    .mutation(({ ctx, input: { id, name, description, slug } }) => {
      return ctx.prisma.item.update({
        data: {
          name,
          description,
          slug,
        },
        where: {
          id,
          collection: {
            userId: ctx.session.user.id,
          },
        },
      })
    }),
  verifyItemSlug: protectedProcedure
    .input(verifyItemSlugSchema)
    .query(async ({ ctx, input: { collectionId, slug } }) => {
      const existing = await ctx.prisma.item.findFirst({
        where: {
          collectionId: collectionId,
          slug,
          collection: {
            userId: ctx.session.user.id,
          },
        },
      })
      return existing === null
    }),
})
