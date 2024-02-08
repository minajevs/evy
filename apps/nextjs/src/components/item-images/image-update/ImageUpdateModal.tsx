import { Modal, ModalOverlay, ModalContent, type UseDisclosureReturn, Card, CardBody, Text, VStack, Button, CardFooter, useBoolean, Badge, Box } from "@chakra-ui/react"
import { type Item, type ItemImage } from "@evy/db"
import { Icon } from '@chakra-ui/react'
import { useConfirm } from "~/utils/confirm"
import { api } from "~/utils/api"
import { ImageUpdateForm } from "./ImageUpdateForm"
import { useZodForm } from "~/components/forms"
import { FormProvider } from "react-hook-form"
import { useEffect, useState } from "react"
import { CheckSquare, Edit, ImageIcon, Trash2 } from "lucide-react"
import { updateImageSchema } from "@evy/api/schemas"
import { ImageDisplay } from "~/components/common/ImageDisplay"

type LocalImage = ItemImage & { defaultItem: Item | null }
type Props = {
  image: LocalImage
  disclosure: UseDisclosureReturn
  onDeleted: (image: LocalImage) => void
  onUpdated: (image: LocalImage) => void
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
  const setDefaultImageMutation = api.image.setDefaultImage.useMutation()

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
    const confirmResult = await confirmWithLoading({ text: 'Are you sure you want to delete this image?' })
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

  const handleSetThumbnail = async () => {
    onLoading()
    const updatedItem = await setDefaultImageMutation.mutateAsync({ id: image.id })
    const updatedImage = ({ ...localImage, defaultItem: updatedItem })
    setLocalImage(updatedImage)
    onUpdated(updatedImage)
    offLoading()
  }

  const isDefault = localImage.defaultItem !== null

  const cardBody = editing
    ? <CardBody>
      <ImageUpdateForm image={image} />
      <Box mt={4}>
        {
          isDefault
            ? <Badge variant='subtle' colorScheme='green'><Icon as={CheckSquare} boxSize='1rem' verticalAlign='middle' pb={0.5} /> Item thumbnail</Badge>
            : <Button variant='link' leftIcon={<Icon as={ImageIcon} />} onClick={handleSetThumbnail}>
              Set as item thumbnail
            </Button>
        }
      </Box>
    </CardBody>
    : (localImage.name === null || localImage.name.length === 0) && (localImage.description === null || localImage.description.length === 0) && !isDefault
      ? null
      : <CardBody>
        <Text as='b'>{localImage.name}</Text>
        <Text>{localImage.description}</Text>
        <Box mt={4}>
          {
            isDefault
              ? <Badge variant='subtle' colorScheme='green'><Icon as={CheckSquare} boxSize='1rem' verticalAlign='middle' pb={0.5} /> Item thumbnail</Badge>
              : null
          }
        </Box>
      </CardBody>

  const cardFooter = editing
    ? <>
      <Button
        flex='1'
        colorScheme='secondary'
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
      <Button flex='1' variant='ghost' leftIcon={<Icon as={Edit} />} onClick={() => on()}>
        Edit
      </Button>
      <Button flex='1' variant='ghost' leftIcon={<Icon as={Trash2} />} colorScheme='red' onClick={handleDelete}>
        Delete
      </Button>
    </>

  return <FormProvider {...form}>
    <Modal size='full' scrollBehavior="outside" isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent background='transparent' height='100%' padding={3} shadow='none' border='none' onClick={handleClose}>
        <form style={{ height: '100%' }} onSubmit={onSubmit}>
          <VStack spacing={3} height='100%'>
            <ImageDisplay image={image} height='100%' fit='contain' onClick={handleClose} />
            <Card width='sm' onClick={(e) => {
              // do not close modal on Card click
              e.stopPropagation()
            }}>
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