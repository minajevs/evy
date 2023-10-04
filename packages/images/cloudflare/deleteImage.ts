import { env } from '../env.mjs'
import { cloudflareApiUrl } from './config'

export type DeleteResult = {
  success: boolean
  errors: { code: number; message: string }[]
}

type DeleteRequest = {
  externalImageId: string
}

const endpoint = '/v1/'

// This function is server-only
export const deleteImage = async ({ externalImageId }: DeleteRequest) => {
  const response = await fetch(cloudflareApiUrl + endpoint + externalImageId, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    },
  })

  const result = (await response.json()) as DeleteResult

  return result
}
