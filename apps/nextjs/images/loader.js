import { env } from '~/env.mjs'

const normalizeSrc = (/** @type {string} */ src) => {
  return src.startsWith('/') ? src.slice(1) : src
}

export default function cloudflareLoader(
  /** @type {{src: string, width: number, quality?: number}} */ {
    src,
    width,
    quality,
  },
) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')

  if (env.NEXT_PUBLIC_HOST !== 'evy.app') {
    return `https://evy.app/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
  }

  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
}
