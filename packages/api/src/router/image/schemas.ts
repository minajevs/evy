import { z } from 'zod'

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
export const setDefaultImageSchema = z.object({
  id: z.string().min(1),
})
