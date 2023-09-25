import { prisma } from '@evy/db'
import { directUploadUrlSchema, imageUploadResultSchema } from '../schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'
import { getDirectUploadUrl } from '@evy/images'

export const imageRouter = createTRPCRouter({
  getDirectUploadUrl: protectedProcedure
    .input(directUploadUrlSchema)
    .mutation(async ({ ctx, input: { itemId } }) => {
      const { session } = ctx
      return await getDirectUploadUrl({ itemId, userId: session.user.id })
    }),
  saveUploadResult: protectedProcedure
    .input(imageUploadResultSchema)
    .mutation(
      async ({ ctx, input: { itemId, externalImageId, thumbhash } }) => {
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
})
