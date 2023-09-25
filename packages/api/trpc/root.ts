import { authRouter } from '../router/auth'
import { collectionRouter } from '../router/collection'
import { itemRouter } from '../router/item'
import { imageRouter } from '../router/image'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  item: itemRouter,
  auth: authRouter,
  image: imageRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
