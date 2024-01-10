import NextImage from "next/image"
import { Image, type ImageProps } from "@chakra-ui/next-js"
import { type ItemImage } from "@evy/db"
import { getDataFromThumbhash, imageSrc } from "@evy/images"

type Props = {
  image: ItemImage
  fit: 'cover' | 'contain'
} & Omit<ImageProps, 'src' | 'alt'>

export const CustomImage = ({ image, fit, ...rest }: Props) => {
  return <Image
    as={NextImage}
    src={imageSrc(image.externalImageId)}
    alt='img'
    fill={true}
    objectFit={fit}
    placeholder="blur"
    blurDataURL={getDataFromThumbhash(image.thumbhash)}
    {...rest}
  />
}