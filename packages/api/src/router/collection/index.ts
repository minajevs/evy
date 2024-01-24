import { slugify } from '@evy/auth/src/slugify'
import { createTRPCRouter, protectedProcedure } from '../../trpc/trpc'

import { customAlphabet } from 'nanoid'
import {
  createBasicImageSchema,
  editCollectionSchema,
  newCollectionSchema,
  removeImageSchema,
  verifyCollectionSlugSchema,
} from './schemas'
import { TRPCError } from '@trpc/server'
import { prisma } from '@evy/db'
import { urlSafeRegex } from '../../utils/urlSafeRegex'
import { deleteImage } from '@evy/images'

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
    .mutation(
      async ({ ctx, input: { id, name, description, logoUpload, slug } }) => {
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
      },
    ),
  removeImage: protectedProcedure
    .input(removeImageSchema)
    .mutation(async ({ ctx, input: { imageId } }) => {
      try {
        return ctx.prisma.$transaction(
          async (tx) => {
            const image = await tx.collectionImage.findFirst({
              where: {
                id: imageId,
                AND: {
                  collection: {
                    userId: ctx.session.user.id,
                  },
                },
              },
            })

            if (image === null) return true

            await tx.collectionImage.delete({
              where: {
                id: imageId,
              },
            })

            const result = await deleteImage({
              externalImageId: image.externalImageId,
            })
            if (!result.success) {
              const firstError = result.errors[0]
              if (firstError?.code === 5404) {
                // 5404 = Image not found, meaning that we should delete image from DB and forget it
                return true
              }

              console.error(result)
              throw new Error(
                'Rollback transaction because image cannot be deleted',
              )
            }
          },
          {
            // default timeout is 5000ms
            // which is apparently slow for cloudflare images api to answer
            timeout: 10000,
          },
        )
      } catch (e) {
        return false
      }
    }),
  createBasicImage: protectedProcedure
    .input(createBasicImageSchema)
    .mutation(
      async ({ ctx, input: { collectionId, externalImageId, thumbhash } }) => {
        const item = ctx.prisma.collection.findFirst({
          where: {
            id: collectionId,
            userId: ctx.session.user.id,
          },
        })

        if (item === null) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        return ctx.prisma.collectionImage.create({
          data: {
            collectionId,
            externalImageId,
            thumbhash,
            createdAt: new Date(),
          },
        })
      },
    ),
  verifyCollectionSlug: protectedProcedure
    .input(verifyCollectionSlugSchema)
    .query(async ({ ctx, input: { slug } }) => {
      return await checkSlugAvailable(ctx.session.user.id, slug)
    }),
})
