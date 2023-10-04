import { type ItemImage } from "@evy/db"
import { ImageDisplay } from "../image-display"
import { Box } from "@chakra-ui/react"

type Props = {
  image: ItemImage
  onClick: () => void
}
export const ItemCard = ({ image, onClick }: Props) => {
  return <>
    <Box
      role='group'
      zIndex={1}
      cursor='pointer'
      onClick={onClick}>
      <ImageDisplay
        image={image}
        height='25vh'
      />
    </Box>
  </>
}