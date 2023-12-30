import { slugify } from '@evy/auth/src/slugify'
import { createTRPCRouter, protectedProcedure } from '../../trpc/trpc'

import { customAlphabet } from 'nanoid'
import {
  editCollectionSchema,
  newCollectionSchema,
  verifyCollectionSlugSchema,
} from './schemas'
import { TRPCError } from '@trpc/server'
import { prisma } from '@evy/db'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

const slugId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5)

const checkSlugAvailable = async (userId: string, slug: string) => {
  const existingCollection = await prisma.collection.findFirst({
    where: {
      userId,
      slug,
    },
  })
  return existingCollection === null
}

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newCollectionSchema)
    .mutation(async ({ ctx, input: { name, description } }) => {
      const slug = slugify(name)

      const slugAvailable = await checkSlugAvailable(ctx.session.user.id, slug)

      return ctx.prisma.collection.create({
        data: {
          name,
          description,
          // if slug exists - append random id in the end. Does not guarantee to be collision-free though
          slug: slugAvailable ? slug : `${slug}-${slugId()}`,
          userId: ctx.session.user.id,
          createdAt: new Date(),
        },
      })
    }),
  update: protectedProcedure
    .input(editCollectionSchema)
    .mutation(async ({ ctx, input: { id, name, description, slug } }) => {
      if (!urlSafeRegex.test(slug)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Slug is in incorrect format',
        })
      }

      const collection = await ctx.prisma.collection.findFirst({
        where: {
          id,
        },
      })

      if (collection === null) throw new TRPCError({ code: 'BAD_REQUEST' })

      if (collection.slug !== slug) {
        const slugAvailable = await checkSlugAvailable(
          ctx.session.user.id,
          slug,
        )
        if (!slugAvailable) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Slug is unavailable',
          })
        }
      }

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
      return await checkSlugAvailable(ctx.session.user.id, slug)
    }),
})
