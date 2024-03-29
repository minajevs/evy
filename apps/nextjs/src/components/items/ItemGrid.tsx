import { VStack, SimpleGrid } from "@chakra-ui/react"
import { type ItemTag, type Tag as DbTag, type Collection, type Item, type ItemImage } from "@evy/db"
import { ItemCard } from "./ItemCard"

type ItemProp = Item
  & { collection: Collection }
  & { defaultImage: ItemImage | null }
  & { images: ItemImage[] }
  & { tags: (ItemTag & { tag: DbTag })[] }

type Props = {
  items: ItemProp[]
  onTagClick: (tag: DbTag) => void
}
export const ItemGrid = ({ items, onTagClick }: Props) => {
  return <VStack spacing={4} alignItems='start'>
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing='8' width='100%'>
      {items.map(item => <ItemCard key={item.id} item={item} onTagClick={onTagClick} />)}
    </SimpleGrid>
  </VStack>
}