import { Box, Button, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, HStack, Heading, SimpleGrid, Text, useBoolean } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { Link } from "@chakra-ui/next-js"
import { EditIcon } from "@chakra-ui/icons"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  collection: Collection & { items: (Item & { collection: Collection })[] }
} & LayoutServerSideProps

const CollectionPage: NextPage<Props> = ({ layout, collection }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
        <Button leftIcon={<EditIcon />} variant='solid' as={Link} href={`/my/${collection.slug}/edit`}>
          Edit
        </Button>
      </HStack>

      <Text mb='8'>{collection.description}</Text>
      <ItemList collectionId={collection.id} items={collection.items} />
    </Layout>
  </>
}

type ItemListProps = {
  collectionId: string
  items: (Item & { collection: Collection })[]
}
const ItemList = ({ collectionId, items }: ItemListProps) => {
  const itemViews = <SimpleGrid columns={4} spacing='8'>
    {items.map(item => <ItemView key={item.id} item={item} />)}
  </SimpleGrid>
  const noItems = <Box>
    <Text>No items in this collection yet</Text>
    <Text>Click "Add" to add a first item</Text>
  </Box>

  return <>
    <HStack width='100%' justifyContent='space-between' mb='4'>
      <Heading size="md">Items</Heading>
      <NewItem collectionId={collectionId} />
    </HStack>
    {items.length === 0
      ? noItems
      : itemViews}
  </>
}

type ItemViewProps = {
  item: Item & { collection: Collection }
}
const ItemView = ({ item }: ItemViewProps) => <Link href={`/my/${item.collection.slug}/${item.slug}`}>
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