import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, type UseDisclosureReturn, Box, AbsoluteCenter, CircularProgress, useColorModeValue } from "@chakra-ui/react"
import { ImageUpload } from "./ImageUpload"
import { api } from "~/utils/api"
import { useCallback, useState } from "react"
import { type Item, type ItemImage } from "@evy/db"
import { uploadImage, validateFiles, getThumbhash } from "@evy/images"
import { useRouter } from "next/router"
import { ImageUploadUpdateModal } from "./ImageUploadUpdateModal"

type LocalImage = ItemImage & { defaultItem: Item | null }

type Props = {
  itemId: string
  disclosure: UseDisclosureReturn
  onUploaded: (newImage: LocalImage) => void
  onUpdated: (image: LocalImage) => void
}
export const UploadDialog = ({ itemId, disclosure, onUploaded, onUpdated }: Props) => {
  const router = useRouter()
  const { isOpen, onClose } = disclosure
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setProgress] = useState<number | null>(null)
  const [uploadedImage, setUploadedImage] = useState<LocalImage | null>(null)

  const { mutateAsync: directUploadMutateAsync } = api.image.getDirectUploadUrl.useMutation()
  const imageCreateMutation = api.image.createBasicImage.useMutation()

  const handleClose = useCallback(() => {
    onClose()
    setUploading(false)
    setUploadedImage(null)
  }, [onClose, setUploading, setUploadedImage])

  const onSave = useCallback(async (image: LocalImage) => {
    onUpdated(image)
    handleClose()
    await router.replace(router.asPath)
    setUploading(false)
    setUploadedImage(null)
  }, [handleClose, router, onUpdated])

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    const validationResult = validateFiles(files)
    if (validationResult !== true) {
      // TODO: Show error to user?
      console.error(validationResult)
      return
    }

    setUploading(true)
    setProgress(null)

    const directUpload = await directUploadMutateAsync({ itemId })
    const thumbhash = await getThumbhash(files[0]!)

    await uploadImage({ file: files[0]!, directUpload: directUpload.result, onProgress: setProgress })

    const createdImage = await imageCreateMutation.mutateAsync({ itemId, externalImageId: directUpload.result.id, thumbhash })


    setUploading(false)
    onUploaded(createdImage)
    setUploadedImage(createdImage)
  }, [directUploadMutateAsync, imageCreateMutation, itemId, onUploaded])

  const uploadProgressColor = useColorModeValue('secondary.500', 'secondary.200')

  const body = uploadedImage === null
    ? <>
      <ModalBody>
        <Box>
          <ImageUpload height="30vh" onDrop={handleFiles} />
          {
            uploading
              ? <AbsoluteCenter axis='both'>
                <CircularProgress
                  color={uploadProgressColor}
                  size='5rem'
                  isIndeterminate={uploadProgress === null}
                  value={(uploadProgress ?? 0) * 100}
                />
              </AbsoluteCenter>
              : null
          }
        </Box>
      </ModalBody>

      <ModalFooter>
      </ModalFooter>
    </>
    : <ImageUploadUpdateModal image={uploadedImage} onSave={onSave} />

  return <Modal size='2xl' isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={!uploading}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Upload Image</ModalHeader>
      <ModalCloseButton />
      {body}
    </ModalContent>
  </Modal>
}