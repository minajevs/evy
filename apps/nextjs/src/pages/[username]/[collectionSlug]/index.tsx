import { Box, Button, ButtonGroup, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, HStack, Heading, SimpleGrid, Text, VStack, useBoolean } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { Link } from "@chakra-ui/next-js"
import { EditIcon, LinkIcon } from "@chakra-ui/icons"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import { ItemCard } from "~/components/item/ItemCard"

type Props = {
  collection: Collection & { items: (Item & { collection: Collection })[] } & { user: User }
} & LayoutServerSideProps

const UserCollectionPage: NextPage<Props> = ({ layout, collection }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
        <ButtonGroup isAttached>
          <ShareDialog
            buttonProps={{ leftIcon: <LinkIcon /> }}
            username={collection.user.username}
            collectionSlug={collection.slug}
          />
        </ButtonGroup>
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
  items: (Item & { collection: Collection })[]
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
          collection: true
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
        collections: currentCollection.user.collections
      }
    }
  }
}

export default UserCollectionPage