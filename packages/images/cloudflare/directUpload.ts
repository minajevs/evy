import { env } from '../env.mjs'
import { cloudflareApiUrl } from './config'

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

const endpoint = '/v2/direct_upload'

// Read more on cloudlfare direct upload: https://developers.cloudflare.com/images/cloudflare-images/upload-images/direct-creator-upload/
// To get batch upload urls - https://developers.cloudflare.com/images/upload-images/images-batch/
// This function is server-only
export const getDirectUploadUrl = async ({
  userId,
  itemId,
}: DirectUploadUrlRequest) => {
  const data = new FormData()
  // makes images private
  data.append('requireSignedURLs', 'true')
  data.append('metadata', JSON.stringify({ userId, itemId }))

  const response = await fetch(cloudflareApiUrl + endpoint, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    },
  })

  const result = (await response.json()) as DirectUploadUrlResult

  return result
}
