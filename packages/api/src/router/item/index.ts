import { TRPCError } from '@trpc/server'
import { editItemSchema, newItemSchema, verifyItemSlugSchema } from './schemas'
import { createTRPCRouter, protectedProcedure } from '../../trpc/trpc'
import { slugify } from '@evy/auth/src/slugify'
import { customAlphabet } from 'nanoid'
import { prisma } from '@evy/db'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

const slugId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5)

const checkSlugAvailable = async (
  userId: string,
  collectionId: string,
  slug: string,
) => {
  const existingItem = await prisma.item.findFirst({
    where: {
      collectionId,
      collection: {
        userId,
      },
      slug,
    },
  })
  return existingItem === null
}

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
    .mutation(async ({ ctx, input: { id, name, description, slug } }) => {
      if (!urlSafeRegex.test(slug)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Slug is in incorrect format',
        })
      }

      const item = await ctx.prisma.item.findFirst({
        where: {
          id,
          collection: {
            userId: ctx.session.user.id,
          },
        },
      })

      if (item === null) throw new TRPCError({ code: 'BAD_REQUEST' })

      if (item.slug !== slug) {
        const slugAvailable = await checkSlugAvailable(
          ctx.session.user.id,
          item.collectionId,
          slug,
        )
        if (!slugAvailable) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Slug is unavailable',
          })
        }
      }

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
      return await checkSlugAvailable(ctx.session.user.id, collectionId, slug)
    }),
})
