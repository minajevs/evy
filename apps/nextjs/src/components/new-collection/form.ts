import { useForm } from '../forms'
import { z } from 'zod'

export const newCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type NewCollectionType = z.infer<typeof newCollectionSchema>

export const useNewCollectionForm = () =>
  useForm({ schema: newCollectionSchema })

export default useNewCollectionForm
