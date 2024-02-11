import { z } from 'zod'
import { textLengths } from '../../constants/validation'
import { slugSchema } from '../../constants/schemas'

const nameSchema = z
  .string()
  .min(1, 'Collection name is required')
  .max(
    textLengths.normal,
    `Collection name can be at most ${textLengths.normal} characters`,
  )

const collectionSlugSchema = slugSchema.min(1, 'Collection slug is required')

export const editCollectionSchema = z.object({
  id: z.string().min(1),
  name: nameSchema,
  slug: collectionSlugSchema,
  description: z.string(),
})
export const newCollectionSchema = z.object({
  name: nameSchema,
  description: z.string(),
})
export const verifyCollectionSlugSchema = z.object({
  slug: collectionSlugSchema,
})
