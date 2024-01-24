import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    FEATURE_GOOGLE_AUTH_ENABLED: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true'),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_HOST: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    FEATURE_GOOGLE_AUTH_ENABLED: process.env.FEATURE_GOOGLE_AUTH_ENABLED,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
