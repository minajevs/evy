import NextImage from "next/image"
import { type ImageProps } from "@chakra-ui/next-js"
import { type ItemImage } from "@evy/db"
import { getDataFromThumbhash, imageSrc } from "@evy/images"

type Props = {
  image: ItemImage
  fit: 'cover' | 'contain'
} & Omit<ImageProps, 'src' | 'alt' | 'placeholder'>

export const CustomImage = ({ image, fit, ...rest }: Props) => {
  return <NextImage
    src={imageSrc(image.externalImageId)}
    alt={image.name ?? image.description ?? 'image for an item'}
    fill={true}
    style={{ objectFit: fit }}
    placeholder="blur"
    blurDataURL={getDataFromThumbhash(image.thumbhash)}
    {...rest}
  />
}