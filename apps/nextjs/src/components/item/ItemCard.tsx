import { Card, CardBody } from "@chakra-ui/react"
import type { Collection, Item } from "@evy/db"
import Link from "next/link"

type Props = {
  linkPrefix?: string
  item: Item & { collection: Collection }
}
export const ItemCard = ({ linkPrefix, item }: Props) => <Link href={`/${linkPrefix ?? 'my'}/${item.collection.slug}/${item.slug}`}>
  <Card
    _hover={{
      boxShadow: 'md',
      transform: 'translateY(-2px)',
      transitionDuration: '0.1s',
      transitionTimingFunction: "ease-in-out"
    }}
    _active={{
      transform: 'translateY(2px)',
      transitionDuration: '0.1s',
    }}
    cursor='pointer'
  >
    <CardBody>
      {item.name}
      {item.description}
    </CardBody>
  </Card>
</Link>