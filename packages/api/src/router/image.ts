import { prisma } from '@evy/db'
import {
  directUploadUrlSchema,
  createBasicImageSchema,
  updateImageSchema,
  deleteImageSchema,
} from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'
import { getDirectUploadUrl, deleteImage } from '@evy/images'
import { TRPCError } from '@trpc/server'

export const imageRouter = createTRPCRouter({
  getDirectUploadUrl: protectedProcedure
    .input(directUploadUrlSchema)
    .mutation(async ({ ctx, input: { itemId } }) => {
      const { session } = ctx
      return await getDirectUploadUrl({ itemId, userId: session.user.id })
    }),
  createBasicImage: protectedProcedure
    .input(createBasicImageSchema)
    .mutation(
      async ({ ctx, input: { itemId, externalImageId, thumbhash } }) => {
        const item = ctx.prisma.item.findFirst({
          where: {
            id: itemId,
            collection: {
              userId: ctx.session.user.id,
            },
          },
        })

        if (item === null) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        return ctx.prisma.itemImage.create({
          data: {
            itemId,
            externalImageId,
            thumbhash,
            createdAt: new Date(),
          },
        })
      },
    ),
  updateImage: protectedProcedure
    .input(updateImageSchema)
    .mutation(async ({ ctx, input: { id: imageId, name, description } }) => {
      return ctx.prisma.itemImage.update({
        where: {
          id: imageId,
          item: {
            collection: {
              userId: ctx.session.user.id,
            },
          },
        },
        data: {
          name,
          description,
        },
      })
    }),
  deleteImage: protectedProcedure
    .input(deleteImageSchema)
    .mutation(async ({ ctx, input: { id: imageId } }) => {
      try {
        return ctx.prisma.$transaction(
          async (tx) => {
            const image = await tx.itemImage.findFirst({
              where: {
                id: imageId,
                AND: {
                  item: {
                    collection: {
                      userId: ctx.session.user.id,
                    },
                  },
                },
              },
            })

            if (image === null) return true

            await tx.itemImage.delete({
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
})
