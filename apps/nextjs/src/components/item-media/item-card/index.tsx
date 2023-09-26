import { type ItemImage } from "@evy/db"
import { ImageDisplay } from "../image-display"
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"

type Props = {
  image: ItemImage
  onClick: () => void
}
export const ItemCard = ({ image, onClick }: Props) => {
  return <>
    <ImageDisplay image={image} height='25vh' cursor='pointer' onClick={onClick} />
  </>
}