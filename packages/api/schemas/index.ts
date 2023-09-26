import z from 'zod'

export const editCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Collection name is required'),
  description: z.string(),
})
export const newCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  description: z.string(),
})

export const newItemSchema = z.object({
  collectionId: z.string().min(1),
  name: z.string().min(1, 'Item name is required'),
  description: z.string(),
})
export const editItemSchema = z.object({
  itemId: z.string().min(1),
  name: z.string().min(1, 'Item name is required'),
  description: z.string(),
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
  imageId: z.string().min(1),
  name: z.string(),
  description: z.string(),
})
