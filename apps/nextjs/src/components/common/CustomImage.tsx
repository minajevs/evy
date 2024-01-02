import NextImage from "next/image"
import { Image, type ImageProps } from "@chakra-ui/next-js"
import { type ItemImage } from "@evy/db"
import { getDataFromThumbhash, imageSrc } from "@evy/images"

type Props = {
  image: ItemImage
} & Omit<ImageProps, 'src' | 'alt'>

export const CustomImage = ({ image, ...rest }: Props) => {
  return <Image
    as={NextImage}
    src={imageSrc(image.externalImageId)}
    alt='img'
    fill={true}
    objectFit={'cover'}
    placeholder="blur"
    blurDataURL={getDataFromThumbhash(image.thumbhash)}
    onLoad={() => console.debug('onLoad')}
    onLoadStart={() => console.debug('onLoadStart')}
    onLoadedData={() => console.debug('onLoadedData')}
    onLoadedMetadata={() => console.debug('onLoadedMetadata')}
    // ref={ref => ref && (ref.onload = hidePlaceholder)}
    ref={ref => {
      if (!ref) return
      ref.onload = () => console.debug('onload')
      ref.onloadstart = () => console.debug('onloadstart')
      ref.onloadeddata = () => console.debug('onloadeddata')
      ref.onloadedmetadata = () => console.debug('onloadedmetadata')
    }}
    {...rest}
  />
}