import { z } from 'zod'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

const MAX_FILE_SIZE = 1000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
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
  logoUpload: z.boolean().optional(),
  logo: z
    .custom<File[]>()
    .optional()
    .refine(
      (files) =>
        files === undefined ||
        files.length === 0 ||
        files[0]!.size <= MAX_FILE_SIZE,
      `Max file size is 10MB.`,
    )
    .refine(
      (files) =>
        files === undefined ||
        files.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files[0]!.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
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
export const createBasicImageSchema = z.object({
  externalImageId: z.string().min(1),
  thumbhash: z.string().min(1),
  collectionId: z.string().min(1),
})

export const removeImageSchema = z.object({
  imageId: z.string().min(1),
})
