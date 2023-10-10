import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, type UseDisclosureReturn, Spinner, Stack } from "@chakra-ui/react"
import { ImageUpload } from "./ImageUpload"
import { api } from "~/utils/api"
import { useCallback, useEffect, useState } from "react"
import { type ItemImage } from "@evy/db"
import { type DirectUploadUrlResult, uploadImage, validateFiles, getThumbhash } from "@evy/images"
import { useRouter } from "next/router"
import { ImageUpdateModal } from "../image-update/ImageUpdateModal"

type Props = {
  itemId: string
  disclosure: UseDisclosureReturn
  onUploaded: (newImage: ItemImage) => void
  onUpdated: (image: ItemImage) => void
}
export const UploadDialog = ({ itemId, disclosure, onUploaded, onUpdated }: Props) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = disclosure
  const [directUpload, setDirectUpload] = useState<DirectUploadUrlResult | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadedImage, setUploadedImage] = useState<ItemImage | null>(null)

  const { mutateAsync: directUploadMutateAsync } = api.image.getDirectUploadUrl.useMutation()
  const imageCreateMutation = api.image.createBasicImage.useMutation()

  useEffect(() => {
    const fetchData = async () => {
      const directUpload = await directUploadMutateAsync({ itemId })
      setDirectUpload(directUpload)
    }
    if (disclosure.isOpen && directUpload === null) {
      fetchData().catch(console.error)
    }
  }, [disclosure, directUpload, itemId, directUploadMutateAsync])

  const onSave = useCallback(async (image: ItemImage) => {
    onUpdated(image)
    onClose()
    await router.replace(router.asPath)
    setDirectUpload(null)
    setUploading(false)
    setUploadedImage(null)
  }, [setDirectUpload, onClose, router, onUpdated])

  const handleFiles = useCallback(async (files: File[]) => {
    const validationResult = validateFiles(files)
    if (validationResult !== true || directUpload === null) {
      // TODO: Show error to user?
      console.error(validationResult)
      return
    }

    setUploading(true)

    await uploadImage({ file: files[0]!, directUpload: directUpload.result })

    const thumbhash = await getThumbhash(files[0]!)

    const createdImage = await imageCreateMutation.mutateAsync({ itemId, externalImageId: directUpload.result.id, thumbhash })

    setUploading(false)
    onUploaded(createdImage)
    setUploadedImage(createdImage)
  }, [directUpload, imageCreateMutation, itemId, onUploaded])

  const body = directUpload === null || uploading
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
          <ImageUpload onDrop={handleFiles} />
        </ModalBody>

        <ModalFooter>
        </ModalFooter>
      </>
      : <ImageUpdateModal image={uploadedImage} onSave={onSave} />

  return <Modal size='2xl' isOpen={isOpen} onClose={onClose} >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Upload Image</ModalHeader>
      <ModalCloseButton />
      {body}
    </ModalContent>
  </Modal>
}