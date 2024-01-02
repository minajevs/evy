import { Box, HStack, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { type Collection, prisma, type Item, type User, type ItemImage } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import Layout from "~/layout"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { ItemCard } from "~/components/item/ItemCard"
import { getServerSession } from "@evy/auth"

type ItemProp = Item & { collection: Collection } & { images: ItemImage[] }

type Props = {
  collection: Collection & { items: ItemProp[] } & { user: User }
} & LayoutServerSideProps

const UserCollectionPage: NextPage<Props> = ({ layout, collection }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
      </HStack>
      {
        collection.description !== null && collection.description.length > 0
          ? <Text mb='8'>{collection.description}</Text>
          : null
      }
      <HStack width='100%' justifyContent='space-between' mb='4'>
        <Heading size="md">Items</Heading>
      </HStack>
      <ItemList items={collection.items} username={collection.user.username} />
    </Layout>
  </>
}

type ItemListProps = {
  username: string
  items: ItemProp[]
}
const ItemList = ({ username, items }: ItemListProps) => {
  if (items.length === 0) {
    return <Box>
      <Text>No items in this collection yet</Text>
    </Box>
  }
  return <SimpleGrid columns={4} spacing='8'>
    {items.map(item => <ItemCard key={item.id} item={item} linkPrefix={username} />)}
  </SimpleGrid>
}

const paramsSchema = z.object({ username: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const { username, collectionSlug } = paramsSchema.parse(params)
  const auth = await getServerSession({ req, res })

  const currentCollection = await prisma.collection.findFirst({
    where: {
      user: {
        username
      },
      slug: collectionSlug,
    },
    include: {
      user: {
        include: {
          collections: true
        }
      },
      items: {
        include: {
          collection: true,
          images: true
        }
      }
    }
  })

  if (currentCollection === null) {
    return { redirect: { destination: `/${username}`, permanent: false } }
  }

  return {
    props: {
      collection: currentCollection,
      layout: {
        loggedIn: auth?.user !== undefined,
        collections: []
      }
    }
  }
}

export default UserCollectionPage