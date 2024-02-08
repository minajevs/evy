import { SimpleGrid } from "@chakra-ui/react"
import type { Item, ItemImage } from "@evy/db"
import { ImageCard } from "./image-card"

type LocalImage = ItemImage & { defaultItem: Item | null }

type Props<T extends ItemImage | LocalImage> = {
  images: T[]
  onClick: (image: T) => void
  children?: React.ReactNode
}
export const ImageGrid = <T extends ItemImage | LocalImage>({ images, onClick, children }: Props<T>) => {
  if (images.length === 0) {
    return children
  }
  return <SimpleGrid columns={{ xl: 4, md: 3, sm: 2, base: 1 }} spacing='3' width='100%' >
    {images.map(image => <ImageCard
      key={image.id}
      image={image}
      onClick={() => onClick(image)}
    />)}
  </SimpleGrid>
}