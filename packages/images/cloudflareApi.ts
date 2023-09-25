import axios, { type AxiosProgressEvent } from 'axios'
import { env } from './env.mjs'

const cloudflareApiUrl = `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`

export type DirectUploadUrl = {
  id: string
  uploadURL: string
}

export type DirectUploadUrlResult = {
  result: DirectUploadUrl
  success: boolean
}

type DirectUploadUrlRequest = {
  userId: string
  itemId: string
}

// Read more on cloudlfare direct upload: https://developers.cloudflare.com/images/cloudflare-images/upload-images/direct-creator-upload/
// This function is server-only
export const getDirectUploadUrl = async ({
  userId,
  itemId,
}: DirectUploadUrlRequest) => {
  const data = new FormData()
  // makes images private
  data.append('requireSignedURLs', 'true')
  data.append('metadata', JSON.stringify({ userId, itemId }))

  const response = await fetch(cloudflareApiUrl, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    },
  })

  const result = (await response.json()) as DirectUploadUrlResult

  return result
}

export type UploadProgressEvent = {
  loaded: number
  total?: number
}
type UploadImageRequest = {
  file: File
  directUpload: DirectUploadUrl
}
export const uploadImage = async ({
  file,
  directUpload,
}: UploadImageRequest) => {
  const validationResult = validateFiles([file])
  if (validationResult !== true) {
    // TODO: Show error to user?
    console.error(validationResult)
    return
  }

  const data = new FormData()
  data.append('file', file, directUpload.id) // rename file to file id

  // Axios supports upload progress, BUT is kinda unstable and upload slowly
  // I guess for <10mb files we don't need progress at all
  // const result = await axios.post(directUpload.uploadURL, data, {
  //   onUploadProgress: onProgress,
  // })
  const result = await fetch(directUpload.uploadURL, {
    method: 'POST',
    body: data,
  })
  return result
}

export const validateFiles = (files: File[]) => {
  if (files.length < 1) {
    return 'Files is required'
  }
  for (const file of Array.from(files)) {
    const fsMb = file.size / (1024 * 1024)
    const MAX_FILE_SIZE = 10
    if (fsMb > MAX_FILE_SIZE) {
      return 'Max file size 10mb'
    }
  }
  return true
}
