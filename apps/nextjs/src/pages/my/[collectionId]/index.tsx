import { Button, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, HStack, Heading, SimpleGrid, Text, useBoolean } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { api } from "~/utils/api"
import { Link } from "@chakra-ui/next-js"
import { EditIcon } from "@chakra-ui/icons"
import { EditText } from "~/components/common/EditText"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  collection: Collection & { items: Item[] }
} & LayoutServerSideProps

const CollectionPage: NextPage<Props> = ({ layout, collection }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
        <Button leftIcon={<EditIcon />} variant='solid' as={Link} href={`/my/${collection.id}/edit`}>
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
  items: Item[]
}
const ItemList = ({ collectionId, items }: ItemListProps) => {
  const itemViews = items.map(item => <ItemView key={item.id} item={item} />)

  return <>
    <Heading size="md" mb='4'>Items</Heading>
    <SimpleGrid columns={4} spacing='8'>
      <NewItem collectionId={collectionId} />
      {itemViews}
    </SimpleGrid>
  </>
}

type ItemViewProps = {
  item: Item
}
const ItemView = ({ item }: ItemViewProps) => <Link href={`/my/${item.collectionId}/${item.id}`}>
  <Card
    boxShadow='lg'
    _hover={{
      boxShadow: 'xl',
      transform: 'translateY(-2px)',
      transitionDuration: '0.2s',
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


const paramsSchema = z.object({ collectionId: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { collectionId } = paramsSchema.parse(params)

  const currentCollection = await prisma.collection.findFirst({
    where: {
      userId: auth.user.id,
      id: collectionId,
    },
    include: {
      items: true
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