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
      {/* width - full, heigh - full, paddingTop - 100% to achieve square */}
      {/* set paddingTop to change dimensions, eg. w = 100px, paddingTop = 33% => h == 33px  */}
      <ImageDisplay
        image={image}
        width='full'
        height='full'
        paddingTop='100%'
      />
    </Box>
  </>
}