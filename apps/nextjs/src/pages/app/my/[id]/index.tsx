import { Card, CardBody, Editable, EditableInput, EditablePreview, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { api } from "~/utils/api"

type Props = {
  collections: Collection[]
  collection: Collection & { items: Item[] }
}

const CollectionPage: NextPage<Props> = ({ collections, collection }) => {
  const updateMutation = api.collection.updateName.useMutation()

  const onSubmit = async (newName: string) => {
    await updateMutation.mutateAsync({ name: newName, id: collection.id })
  }
  return <>
    <Layout title="Collection" collections={collections}>
      <Heading size="lg" mb="4">
        <Editable
          isDisabled={false}
          key={collection.name}
          defaultValue={collection.name}
          onSubmit={onSubmit}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Heading>
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
const ItemView = ({ item }: ItemViewProps) => <Card
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

const paramsSchema = z.object({ id: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { id } = paramsSchema.parse(params)

  const currentCollection = await prisma.collection.findFirst({
    where: {
      userId: auth.user.id,
      id,
    },
    include: {
      items: true
    }
  })

  if (currentCollection === null) {
    return { redirect: { destination: '/app/my', permanent: false } }
  }

  const allCollections = await prisma.collection.findMany({
    where: {
      userId: auth.user.id
    },
  })


  return {
    props: {
      collections: allCollections,
      collection: currentCollection
    }
  }
}

export default CollectionPage