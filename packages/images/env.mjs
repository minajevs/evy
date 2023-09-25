import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    CLOUDFLARE_API_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH: z.string().min(1),
  },
  runtimeEnv: {
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID:
      process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID,
    NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH:
      process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
