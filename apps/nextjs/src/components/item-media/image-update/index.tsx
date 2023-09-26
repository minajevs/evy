import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, type UseDisclosureReturn, ModalBody } from "@chakra-ui/react"
import { ImageDisplay } from "../image-display"
import { type ItemImage } from "@evy/db"

type Props = {
  image: ItemImage
  disclosure: UseDisclosureReturn
}
export const ImageUpdate = ({ image, disclosure: { isOpen, onClose } }: Props) => {
  return <Modal size='5xl' isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent background='transparent' shadow='none' border='none' onClick={onClose}>
      <ImageDisplay image={image} height='66vh' fit='contain' />
    </ModalContent>
  </Modal>
}