import { z } from 'zod'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

export const newItemSchema = z.object({
  collectionId: z.string().min(1),
  name: z.string().min(1, 'Item name is required'),
  description: z.string(),
})
export const editItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Item name is required'),
  slug: z
    .string()
    .min(1, 'Item slug is required')
    .regex(
      /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*$/,
      'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
  description: z.string(),
  defaultImageId: z.string().optional(),
})
export const verifyItemSlugSchema = z.object({
  collectionId: z.string().min(1),
  slug: z
    .string()
    .min(1, 'Item slug is required')
    .regex(
      urlSafeRegex,
      'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
})
export const updateTagsSchema = z.object({
  itemId: z.string().min(1),
  tags: z.array(
    z.object({
      id: z.string().min(1),
      text: z.string().min(1),
    }),
  ),
})
