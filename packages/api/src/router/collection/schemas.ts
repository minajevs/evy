import { z } from 'zod'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

export const editCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Collection name is required'),
  slug: z
    .string()
    .min(1, 'Collection slug is required')
    .regex(
      urlSafeRegex,
      'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
  description: z.string(),
})
export const newCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  description: z.string(),
})
export const verifyCollectionSlugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Collection slug is required')
    .regex(
      urlSafeRegex,
      'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
})
