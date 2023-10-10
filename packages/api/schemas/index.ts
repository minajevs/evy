import z from 'zod'

export const editUserSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must contain at least 5 characters')
    .regex(
      /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*$/,
      'Username may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
  name: z.string(),
})

export const verifyUsernameSchema = z.object({
  username: z
    .string()
    .min(5)
    .regex(
      /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*$/,
      'Username may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
})

export const editCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Collection name is required'),
  slug: z
    .string()
    .min(1, 'Collection slug is required')
    .regex(
      /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*$/,
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
      /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*$/,
      'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
})

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
})
export const verifyItemSlugSchema = z.object({
  collectionId: z.string().min(1),
  slug: z
    .string()
    .min(1, 'Item slug is required')
    .regex(
      /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*$/,
      'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
})

export const directUploadUrlSchema = z.object({
  itemId: z.string().min(1),
})
export const createBasicImageSchema = z.object({
  externalImageId: z.string().min(1),
  thumbhash: z.string().min(1),
  itemId: z.string().min(1),
})
export const updateImageSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  description: z.string(),
})
export const deleteImageSchema = z.object({
  id: z.string().min(1),
})
