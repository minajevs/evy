import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, type UseDisclosureReturn, ModalBody, Box, Card, CardBody, Text, Stack, VStack, FormControl, FormErrorMessage, FormLabel, Input, Textarea, Button, ButtonGroup, CardFooter, useBoolean, useEditable, useStatStyles } from "@chakra-ui/react"
import { ImageDisplay } from "./image-display"
import { type ItemImage } from "@evy/db"

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


  return <Modal size='5xl' isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent background='transparent' shadow='none' border='none'>
      <VStack spacing={3} >
        <ImageDisplay image={image} height='66vh' fit='contain' onClick={onClose} />
        <Card width='sm'>
          {cardBody}
          {/* <CardFooter justify='space-between' flexWrap='wrap'>
              {cardFooter}
            </CardFooter> */}
        </Card>
      </VStack>
    </ModalContent>
  </Modal>
}