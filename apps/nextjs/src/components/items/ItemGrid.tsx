import { VStack, SimpleGrid } from "@chakra-ui/react"
import { type Collection, type Item, type ItemImage } from "@evy/db"
import { ItemCard } from "./ItemCard"

type ItemProp = Item & { collection: Collection } & { images: ItemImage[] }

type Props = {
  items: ItemProp[]
}
export const ItemGrid = ({ items }: Props) => {
  return <VStack spacing={4} alignItems='start'>
    <SimpleGrid columns={{ sm: 2, md: 3, lg: 4, xl: 5 }} spacing='8'>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </SimpleGrid>
  </VStack>
}