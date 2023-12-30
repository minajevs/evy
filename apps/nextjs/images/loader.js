const normalizeSrc = (/** @type {string} */ src) => {
  return src.startsWith('/') ? src.slice(1) : src
}

export default function cloudflareLoader(
  /** @type {{src: string, width: string, quality: string}} */ {
    src,
    width,
    quality,
  },
) {
  console.log('sup img', src)
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
}
