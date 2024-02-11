import type { DirectUploadUrl } from './directUpload'
import { validateFiles } from '../validateFiles'
import axios from 'axios'

export type UploadProgressEvent = {
  loaded: number
  total?: number
}
type UploadImageRequest = {
  file: File
  directUpload: DirectUploadUrl
  onProgress: (progress: number) => void
}
export const uploadImage = async ({
  file,
  directUpload,
  onProgress,
}: UploadImageRequest) => {
  const validationResult = validateFiles([file])
  if (validationResult !== true) {
    // TODO: Show error to user?
    console.error(validationResult)
    return
  }
  // TODO: Include extension validation to `validate files`
  // Technically input has `accept: 'image/*'` property, meaning that only valid extensions can be upload
  // But still validating it might be a good thing
  const fileExtension = file.name.split('.')[1]!

  const data = new FormData()
  data.append('file', file, `${directUpload.id}.${fileExtension}`) // rename file to file id

  // Axios supports upload progress, BUT is kinda unstable and upload slowly
  // I guess for <10mb files we don't need progress at all
  const result = await axios
    .post(directUpload.uploadURL, data, {
      onUploadProgress: (progress) => {
        onProgress(progress.progress ?? 0)
        console.log(progress)
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .catch((err) => console.log(err))
  // const result = await fetch(directUpload.uploadURL, {
  //   method: 'POST',
  //   body: data,
  // })
  return result
}
