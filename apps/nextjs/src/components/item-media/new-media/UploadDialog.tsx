import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, type UseDisclosureReturn, Spinner, Stack } from "@chakra-ui/react"
import { ImageUpload } from "./ImageUpload"
import { api } from "~/utils/api"
import { useCallback, useState } from "react"
import { type ItemImage } from "@evy/db"
import { uploadImage, validateFiles, getThumbhash } from "@evy/images"
import { useRouter } from "next/router"
import { ImageUploadUpdateModal } from "./ImageUploadUpdateModal"

type Props = {
  itemId: string
  disclosure: UseDisclosureReturn
  onUploaded: (newImage: ItemImage) => void
  onUpdated: (image: ItemImage) => void
}
export const UploadDialog = ({ itemId, disclosure, onUploaded, onUpdated }: Props) => {
  const router = useRouter()
  const { isOpen, onClose } = disclosure
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadedImage, setUploadedImage] = useState<ItemImage | null>(null)

  const { mutateAsync: directUploadMutateAsync } = api.image.getDirectUploadUrl.useMutation()
  const imageCreateMutation = api.image.createBasicImage.useMutation()

  const handleClose = useCallback(() => {
    onClose()
    setUploading(false)
    setUploadedImage(null)
  }, [onClose, setUploading, setUploadedImage])

  const onSave = useCallback(async (image: ItemImage) => {
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

    const directUpload = await directUploadMutateAsync({ itemId })
    await uploadImage({ file: files[0]!, directUpload: directUpload.result })
    const thumbhash = await getThumbhash(files[0]!)

    const createdImage = await imageCreateMutation.mutateAsync({ itemId, externalImageId: directUpload.result.id, thumbhash })

    setUploading(false)
    onUploaded(createdImage)
    setUploadedImage(createdImage)
  }, [directUploadMutateAsync, imageCreateMutation, itemId, onUploaded])

  const body = uploading
    ? <>
      <ModalBody>
        <Stack height='150' width='full' alignItems='center'><Spinner size='lg' /></Stack>
      </ModalBody>

      <ModalFooter>
      </ModalFooter>
    </>
    : uploadedImage === null
      ? <>
        <ModalBody>
          <ImageUpload height="30vh" onDrop={handleFiles} />
        </ModalBody>

        <ModalFooter>
        </ModalFooter>
      </>
      : <ImageUploadUpdateModal image={uploadedImage} onSave={onSave} />

  return <Modal size='2xl' isOpen={isOpen} onClose={handleClose} >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Upload Image</ModalHeader>
      <ModalCloseButton />
      {body}
    </ModalContent>
  </Modal>
}