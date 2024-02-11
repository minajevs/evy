import { z } from 'zod'
import { textLengths } from '../../constants/validation'
import { slugSchema } from '../../constants/schemas'

const nameSchema = z
  .string()
  .min(1, 'Item name is required')
  .max(
    textLengths.normal,
    `Item name can be at most ${textLengths.normal} characters`,
  )

const tagSchema = z
  .string()
  .min(1, `Tag name is required`)
  .max(textLengths.short, `Tag can be at most ${textLengths.short} characters`)

export const newItemSchema = z.object({
  collectionId: z.string().min(1),
  name: nameSchema,
  description: z.string(),
})
export const editItemSchema = z.object({
  id: z.string().min(1),
  name: nameSchema,
  slug: slugSchema.min(1, 'Item slug is required'),
  description: z.string(),
  defaultImageId: z.string().nullable(),
})
export const verifyItemSlugSchema = z.object({
  collectionId: z.string().min(1),
  slug: slugSchema.min(1, 'Item slug is required'),
})
export const updateTagsSchema = z.object({
  itemId: z.string().min(1),
  tags: z.array(
    z.object({
      id: z.string().min(1),
      text: tagSchema,
    }),
  ),
})
