import { Modal, ModalOverlay, ModalContent, type UseDisclosureReturn, Card, CardBody, Text, VStack, Button, CardFooter, useBoolean } from "@chakra-ui/react"
import { ImageDisplay } from "../image-display"
import { type ItemImage } from "@evy/db"
import { Icon } from '@chakra-ui/react'
import { useConfirm } from "~/utils/confirm"
import { api } from "~/utils/api"
import { ImageUpdateForm } from "./ImageUpdateForm"
import { useZodForm } from "~/components/forms"
import { FormProvider } from "react-hook-form"
import { useEffect, useState } from "react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { updateImageSchema } from "@evy/api/schemas"

type Props = {
  image: ItemImage
  disclosure: UseDisclosureReturn
  onDeleted: (image: ItemImage) => void
  onUpdated: (image: ItemImage) => void
}
export const ImageUpdateModal = ({ image, onDeleted, disclosure: { isOpen, onClose }, onUpdated }: Props) => {
  const [localImage, setLocalImage] = useState(image)
  const [editing, { on, off }] = useBoolean()
  const [loading, { on: onLoading, off: offLoading }] = useBoolean()
  const { confirmWithLoading, close } = useConfirm()

  const form = useZodForm({ schema: updateImageSchema, defaultValues: { id: image.id, name: image.name ?? undefined, description: image.description ?? undefined } })
  const { handleSubmit, formState: { isValid } } = form

  useEffect(() => {
    form.reset({ id: image.id, name: image.name ?? undefined, description: image.description ?? undefined })
    setLocalImage(image)
  }, [image, form, setLocalImage])

  const mutation = api.image.updateImage.useMutation()
  const deleteMutation = api.image.deleteImage.useMutation()

  const onSubmit = handleSubmit(async data => {
    onLoading()
    const updatedImage = await mutation.mutateAsync(data)
    setLocalImage(updatedImage)
    onUpdated(updatedImage)
    offLoading()
    off()
  })

  const onCancel = () => {
    form.reset({ id: image.id, name: image.name ?? undefined, description: image.description ?? undefined })
    off()
  }

  const handleDelete = async () => {
    const confirmResult = await confirmWithLoading({ text: 'Are you sure want to delete this image?' })
    if (!confirmResult) return

    await deleteMutation.mutateAsync({ id: image.id })
    close()
    onDeleted(image)
    handleClose()
  }

  const handleClose = () => {
    off()
    offLoading()
    close()
    onClose()
  }

  const cardBody = editing
    ? <CardBody>
      <ImageUpdateForm image={image} />
    </CardBody>
    : (localImage.name === null || localImage.name.length === 0) && (localImage.description === null || localImage.description.length === 0)
      ? null
      : <CardBody>
        <Text as='b'>{localImage.name}</Text>
        <Text>{localImage.description}</Text>
      </CardBody>

  const cardFooter = editing
    ? <>
      <Button
        flex='1'
        colorScheme='blue'
        isDisabled={!isValid}
        // key necessary https://stackoverflow.com/questions/71754898/involuntary-form-submit-when-rendering-submit-button-in-reactjs
        key='submitButton'
        type="submit"
        isLoading={loading}
      >
        Save
      </Button>
      <Button flex='1' variant='ghost' onClick={onCancel}>
        Cancel
      </Button>
    </>
    : <>
      <Button flex='1' variant='ghost' leftIcon={<Icon as={FiEdit} />} onClick={() => on()}>
        Edit
      </Button>
      <Button flex='1' variant='ghost' leftIcon={<Icon as={FiTrash2} />} colorScheme='red' onClick={handleDelete}>
        Delete
      </Button>
    </>

  return <FormProvider {...form}>
    <Modal size='5xl' isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent background='transparent' shadow='none' border='none'>
        <form onSubmit={onSubmit}>
          <VStack spacing={3} >
            <ImageDisplay image={image} height='66vh' fit='contain' onClick={handleClose} />
            <Card width='sm'>
              {cardBody}
              <CardFooter justify='space-between' flexWrap='wrap'>
                {cardFooter}
              </CardFooter>
            </Card>
          </VStack>
        </form>
      </ModalContent>
    </Modal>
  </FormProvider>
}