import { Box, Button, ButtonGroup, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, HStack, Heading, SimpleGrid, Text, VStack, useBoolean } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { Link } from "@chakra-ui/next-js"
import { Icon } from "@chakra-ui/react"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import { ItemCard } from "~/components/item/ItemCard"
import { FiEdit, FiShare2 } from "react-icons/fi"

type Props = {
  collection: Collection & { items: (Item & { collection: Collection })[] } & { user: User }
} & LayoutServerSideProps

const CollectionPage: NextPage<Props> = ({ layout, collection }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
        <ButtonGroup isAttached>
          <ShareDialog
            buttonProps={{ leftIcon: <Icon as={FiShare2} /> }}
            username={collection.user.username}
            collectionSlug={collection.slug}
          />
          <Button leftIcon={<Icon as={FiEdit} />} variant='solid' as={Link} href={`/my/${collection.slug}/edit`}>
            Edit
          </Button>
        </ButtonGroup>
      </HStack>
      {
        collection.description !== null && collection.description.length > 0
          ? <Text mb='8'>{collection.description}</Text>
          : null
      }
      <HStack width='100%' justifyContent='space-between' mb='4'>
        <Heading size="md">Items</Heading>
        <NewItem collectionId={collection.id} />
      </HStack>
      <ItemList items={collection.items} />
    </Layout>
  </>
}

type ItemListProps = {
  items: (Item & { collection: Collection })[]
}
const ItemList = ({ items }: ItemListProps) => {
  if (items.length === 0) {
    return <Box>
      <Text>No items in this collection yet</Text>
      <Text>{'Click "Add" to add a first item'}</Text>
    </Box>
  }
  return <SimpleGrid columns={{ sm: 2, md: 4 }} spacing='8'>
    {items.map(item => <ItemCard key={item.id} item={item} />)}
  </SimpleGrid>
}

const paramsSchema = z.object({ collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { collectionSlug } = paramsSchema.parse(params)

  const currentCollection = await prisma.collection.findFirst({
    where: {
      userId: auth.user.id,
      slug: collectionSlug,
    },
    include: {
      user: true,
      items: {
        include: {
          collection: true
        }
      }
    }
  })

  if (currentCollection === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  return {
    props: {
      collection: currentCollection,
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default CollectionPage