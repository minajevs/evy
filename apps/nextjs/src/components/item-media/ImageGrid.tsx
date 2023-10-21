import { SimpleGrid } from "@chakra-ui/react"
import type { ItemImage } from "@evy/db"
import { ImageCard } from "./image-card"

type Props = {
  images: ItemImage[]
  onClick: (image: ItemImage) => void
  children: React.ReactNode
}
export const ImageGrid = ({ images, onClick, children }: Props) => {
  if (images.length === 0) {
    return children
  }
  return <SimpleGrid columns={{ xl: 4, md: 3, sm: 2, base: 1 }} spacing='3'>
    {images.map(image => <ImageCard
      key={image.id}
      image={image}
      onClick={() => onClick(image)}
    />)}
  </SimpleGrid>
}