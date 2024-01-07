import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react"
import { type Collection, type Item } from "@evy/db"
import Link from "next/link"

type CollectionCardProps = {
  linkPrefix?: string
  collection: Collection & { items: Item[] }
}
export const CollectionCard = ({ collection, linkPrefix }: CollectionCardProps) => {
  return <Link href={`/${linkPrefix ?? 'my'}/${collection.slug}`}>
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
        <HStack justifyContent='space-between'>
          <Box>
            <Heading size='md'>{collection.name}</Heading>
          </Box>
          <Box>
            <Text>Items: {collection.items.length}</Text>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  </Link >
}