import { env } from './env.mjs'

export type CloudflareImageVariant = 'public' | 'full'

export const imageSrc = (
  externalImageId: string,
  variant: CloudflareImageVariant = 'public',
) => {
  return `https://evy.app/cdn-cgi/imagedelivery/${env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${externalImageId}/${variant}`
  // return `https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${externalImageId}/${variant}`
}
