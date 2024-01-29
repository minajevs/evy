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
    // "unoptimized" means nextjs won't optimize image and instead return "raw" image
    // which is desired behavior, because images are already CDN optimized by cloudflare
    // fun fact: making images "optimized" (unoptimized={false}) prevents them from being cached by browser
    unoptimized
    {...rest}
  />
}