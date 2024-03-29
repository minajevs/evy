import { authRouter } from '../router/auth'
import { collectionRouter } from '../router/collection'
import { itemRouter } from '../router/item'
import { imageRouter } from '../router/image'
import { userRouter } from '../router/user'
import { createTRPCRouter } from './trpc'
import { feedbackRouter } from '../router/feedback'

export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  item: itemRouter,
  auth: authRouter,
  image: imageRouter,
  user: userRouter,
  feedback: feedbackRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
