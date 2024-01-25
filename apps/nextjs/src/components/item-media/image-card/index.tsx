import { type ItemImage } from "@evy/db"
import { Box, type BoxProps } from "@chakra-ui/react"
import { ImageDisplay } from "~/components/common/ImageDisplay"

type Props = {
  image: ItemImage
  onClick: () => void
} & BoxProps
export const ImageCard = ({ image, onClick, ...rest }: Props) => {
  return <>
    <Box
      role='group'
      cursor='pointer'
      onClick={onClick}
      {...rest}
    >
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