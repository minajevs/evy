import { Modal, ModalOverlay, ModalContent, type UseDisclosureReturn, Card, CardBody, Text, VStack } from "@chakra-ui/react"
import { type ItemImage } from "@evy/db"
import { ImageDisplay } from "../common/ImageDisplay"

type Props = {
  image: ItemImage
  disclosure: UseDisclosureReturn
}
export const ImageModal = ({ image, disclosure: { isOpen, onClose } }: Props) => {
  const cardBody = (image.name === null || image.name.length === 0) && (image.description === null || image.description.length === 0)
    ? null
    : <CardBody>
      <Text as='b'>{image.name}</Text>
      <Text>{image.description}</Text>
    </CardBody>


  return <Modal size='full' scrollBehavior="outside" isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent background='transparent' height='100%' shadow='none' border='none' onClick={onClose}>
      <VStack spacing={3} height='100%' m={2}>
        <ImageDisplay image={image} height='100%' fit='contain' onClick={onClose} />
        <Card width='sm' onClick={(e) => {
          // do not close modal on Card click
          e.stopPropagation()
        }}>
          {cardBody}
          {/* <CardFooter justify='space-between' flexWrap='wrap'>
              {cardFooter}
            </CardFooter> */}
        </Card>
      </VStack>
    </ModalContent>
  </Modal>
}