import { DirectUploadUrl } from './directUpload'
import { validateFiles } from '../validateFiles'

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
