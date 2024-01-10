import { Box, type BoxProps } from "@chakra-ui/react"
import { type ItemImage } from "@evy/db"
import { CustomImage } from "~/components/common/CustomImage"

type Props = {
  image: ItemImage
  fit?: 'cover' | 'contain'
  height?: BoxProps['height']
  width?: BoxProps['width']
} & BoxProps

export const ImageDisplay = ({ image, fit, height, width, ...rest }: Props) => {
  return <Box width='full' height='full'>
    <Box
      pos='relative'
      height={height}
      width={width}
      {...rest}
      key={image.id}>
      <CustomImage image={image} fit={fit ?? 'cover'} />
    </Box>
  </Box>
}