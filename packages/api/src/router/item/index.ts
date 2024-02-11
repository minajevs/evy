import { TRPCError } from '@trpc/server'
import {
  editItemSchema,
  newItemSchema,
  updateTagsSchema,
  verifyItemSlugSchema,
} from './schemas'
import { createTRPCRouter, protectedProcedure } from '../../trpc/trpc'
import { slugify } from '@evy/auth/src/slugify'
import { customAlphabet } from 'nanoid'
import { prisma } from '@evy/db'
import { urlSafeRegex } from '@evy/auth/src/signUpSchema'

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
          userId: ctx.session.user.id,
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
    .mutation(
      async ({
        ctx,
        input: { id, name, description, slug, defaultImageId },
      }) => {
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
            defaultImageId,
          },
          where: {
            id,
            collection: {
              userId: ctx.session.user.id,
            },
          },
        })
      },
    ),
  updateTags: protectedProcedure
    .input(updateTagsSchema)
    .mutation(async ({ ctx, input: { itemId, tags } }) => {
      const item = await ctx.prisma.item.findFirst({
        where: {
          id: itemId,
          collection: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          tags: {
            include: {
              tag: {
                include: {
                  itemTags: true,
                },
              },
            },
          },
        },
      })

      if (item === null) throw new TRPCError({ code: 'BAD_REQUEST' })

      // Get all common tag ids
      const existingTagIds = item.tags.map((x) => x.tag.id)
      // Get tags which should be deleted from an item
      const deletedTagIds = existingTagIds.filter(
        (existingId) => !tags.some((tag) => tag.id === existingId),
      )
      // Get itemTag ids to delete
      const deletedItemTagIds = item.tags
        .filter((itemTag) =>
          deletedTagIds.some((deletedTagId) => itemTag.tagId === deletedTagId),
        )
        .map((x) => x.id)
      // If tag, for which we delete itemTag has no more itemtags left, delete tag as well
      const deletedTagsIdsToDelete = item.tags
        .map((x) => x.tag)
        .filter((tag) =>
          deletedTagIds.some((deletedId) => deletedId === tag.id),
        )
        .filter((tag) => tag.itemTags.length === 1)
        .map((x) => x.id)

      // Get tags to create for an item
      const createTags = tags.filter(
        (tag) => !existingTagIds.some((existingId) => tag.id === existingId),
      )

      await ctx.prisma.$transaction([
        prisma.itemTag.deleteMany({
          where: {
            itemId,
            id: { in: deletedItemTagIds },
          },
        }),
        prisma.tag.deleteMany({
          where: {
            id: { in: deletedTagsIdsToDelete },
          },
        }),
        ...createTags.map((createTag) =>
          prisma.itemTag.create({
            data: {
              item: {
                connect: { id: itemId },
              },
              tag: {
                connectOrCreate: {
                  where: {
                    text: createTag.text,
                  },
                  create: {
                    collectionId: item.collectionId,
                    text: createTag.text,
                    createdAt: new Date(),
                  },
                },
              },
              createdAt: new Date(),
            },
          }),
        ),
      ])

      return ctx.prisma.itemTag.findMany({
        where: {
          itemId,
        },
        include: {
          tag: true,
        },
      })
    }),
  verifyItemSlug: protectedProcedure
    .input(verifyItemSlugSchema)
    .query(async ({ ctx, input: { collectionId, slug } }) => {
      return await checkSlugAvailable(ctx.session.user.id, collectionId, slug)
    }),
})
