import { prisma } from '@evy/db'
import {
  directUploadUrlSchema,
  createBasicImageSchema,
  updateImageSchema,
} from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'
import { getDirectUploadUrl } from '@evy/images'
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
    .mutation(async ({ ctx, input: { imageId, name, description } }) => {
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
})
