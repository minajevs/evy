import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash'

export const getThumbhash = async (file: File) => {
  const url = URL.createObjectURL(file)
  const maxSize = 100

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = url
  }).then((img) => {
    URL.revokeObjectURL(url)

    const [width, height] = [img.width, img.height]
    const scale = Math.min(maxSize / width, maxSize / height)
    const resizedWidth = Math.floor(width * scale)
    const resizedHeight = Math.floor(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = resizedWidth
    canvas.height = resizedHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const rgba = new Uint8Array(imageData.data.buffer)
    const hash = rgbaToThumbHash(resizedWidth, resizedHeight, rgba)
    return Buffer.from(hash).toString('base64')
  })
}

const emptyPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const getDataFromThumbhash = (thumbhash: string) => {
  if (thumbhash === 'error') return emptyPixel
  const buffer = new Uint8Array(Buffer.from(thumbhash, 'base64'))
  const dataUrl = thumbHashToDataURL(buffer)
  return dataUrl
}
