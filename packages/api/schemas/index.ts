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
  description: z.string().max(10),
})
