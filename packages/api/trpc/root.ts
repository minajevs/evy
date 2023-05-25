import { authRouter } from '../router/auth'
import { collectionRouter } from '../router/collection'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
