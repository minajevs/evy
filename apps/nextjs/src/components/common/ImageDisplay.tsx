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
      // _after={{
      //   content: '""',
      //   w: 'full',
      //   h: 'full',
      //   pos: 'absolute',
      //   top: 5,
      //   left: 0,
      //   backgroundImage: getDataFromThumbhash(image.thumbhash),
      //   backgroundSize: 'cover',
      //   zIndex: -1,
      //   filter: 'blur(15px)',
      // }}
      key={image.id}>
      <CustomImage image={image} objectFit={fit ?? 'cover'} />
    </Box>
  </Box>
}