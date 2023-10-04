import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, type UseDisclosureReturn, ModalBody, Box, Card, CardBody, Text, Stack, VStack, FormControl, FormErrorMessage, FormLabel, Input, Textarea, Button, ButtonGroup, CardFooter } from "@chakra-ui/react"
import { ImageDisplay } from "../image-display"
import { Item, type ItemImage } from "@evy/db"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { useConfirm } from "~/utils/confirm"
import { api } from "~/utils/api"

type Props = {
  image: ItemImage
  disclosure: UseDisclosureReturn
  onDeleted: (image: ItemImage) => void
}
export const ImageModal = ({ image, onDeleted, disclosure: { isOpen, onClose } }: Props) => {
  const { confirmWithLoading, close } = useConfirm()

  const deleteMutation = api.image.deleteImage.useMutation()

  const handleDelete = async () => {
    const confirmResult = await confirmWithLoading({ text: 'Are you sure want to delete this image?' })
    if (!confirmResult) return

    await deleteMutation.mutateAsync({ imageId: image.id })
    close()
    onDeleted(image)
    onClose()
  }
  return <Modal size='5xl' isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent background='transparent' shadow='none' border='none'>
      <VStack spacing={3} >
        <ImageDisplay image={image} height='66vh' fit='contain' onClick={onClose} />
        <Card width='sm'>
          {image.name === null && image.description === null
            ? null
            : <CardBody>
              <Text as='b'>{image.name}</Text>
              <Text>{image.description}</Text>
            </CardBody>
          }

          <CardFooter justify='space-between' flexWrap='wrap'>
            <Button flex='1' variant='ghost' leftIcon={<EditIcon />} as={Link} href={`/my/media/${image.id}/edit`}>
              Edit
            </Button>
            <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />} colorScheme='red' onClick={handleDelete}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      </VStack>
    </ModalContent>
  </Modal>
}