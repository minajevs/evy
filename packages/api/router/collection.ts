import { slugify } from '@evy/auth/src/slugify'
import {
  editCollectionSchema,
  newCollectionSchema,
  verifyCollectionSlugSchema,
} from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'

import { customAlphabet } from 'nanoid'

const slugId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5)

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCollectionSchema)
    .mutation(async ({ ctx, input: { name, description } }) => {
      const slug = slugify(name)

      const slugExists = await ctx.prisma.collection.findFirst({
        where: {
          userId: ctx.session.user.id,
          slug,
        },
      })
      return ctx.prisma.collection.create({
        data: {
          name,
          description,
          // if slug exists - append random id in the end. Does not guarantee to be collision-free though
          slug: slugExists === null ? slug : `${slug}-${slugId()}`,
          userId: ctx.session.user.id,
          createdAt: new Date(),
        },
      })
    }),
  update: protectedProcedure
    .input(editCollectionSchema)
    .mutation(({ ctx, input: { id, name, description, slug } }) => {
      return ctx.prisma.collection.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          slug,
        },
      })
    }),
  verifyCollectionSlug: protectedProcedure
    .input(verifyCollectionSlugSchema)
    .query(async ({ ctx, input: { slug } }) => {
      const existing = await ctx.prisma.collection.findFirst({
        where: {
          userId: ctx.session.user.id,
          slug,
        },
      })
      return existing === null
    }),
})
