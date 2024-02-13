import { createTRPCRouter, protectedProcedure } from '../../trpc/trpc'
import { createFeedbackSchema } from './schemas'

export const feedbackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createFeedbackSchema)
    .mutation(async ({ ctx, input: { needsResponse, text } }) => {
      return ctx.prisma.feedback.create({
        data: {
          text,
          needsResponse,
          responded: false,
          authorId: ctx.session.user.id,
          createdAt: new Date(),
        },
      })
    }),
})
