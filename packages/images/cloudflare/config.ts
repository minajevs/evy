import { env } from '../env.mjs'

export const cloudflareApiUrl = `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/images`
