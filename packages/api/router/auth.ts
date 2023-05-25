import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc/trpc'

export const authRouter = createTRPCRouter({
  getAuth: publicProcedure.query(({ ctx }) => {
    return ctx.auth
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @evy/auth package
    return 'you can see this secret message!'
  }),
})
