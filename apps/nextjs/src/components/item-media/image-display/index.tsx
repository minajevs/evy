import Image from "next/image";
import { Box, type BoxProps } from "@chakra-ui/react"
import { type ItemImage } from "@evy/db"
import { getDataFromThumbhash, imageSrc } from "@evy/images"

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
      <Image
        src={imageSrc(image.externalImageId)}
        alt='img'
        fill={true}
        objectFit={fit ?? 'cover'}
        placeholder="blur"
        blurDataURL={getDataFromThumbhash(image.thumbhash)}
      />
    </Box>
  </Box>
}