import { type AppRouter } from './trpc/root'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

export { appRouter, type AppRouter } from './trpc/root'
export { createTRPCContext } from './trpc/trpc'

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
