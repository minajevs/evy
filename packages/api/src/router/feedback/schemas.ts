import { z } from 'zod'

export const createFeedbackSchema = z.object({
  text: z.string().min(1),
  needsResponse: z.boolean(),
})
