import { Card, CardBody, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import { m } from "framer-motion"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"

type Props = {
  collections: Collection[]
  collection: Collection & { items: Item[] }
}

const CollectionPage: NextPage<Props> = ({ collections, collection }) => {
  return <>
    <Layout title="Collection" collections={collections}>
      <Heading size="lg" mb="4">{collection.name}</Heading>
      <Text mb='8'>{collection.description}</Text>
      <ItemList items={collection.items} />
    </Layout>
  </>
}

type ItemListProps = {
  items: Item[]
}
const ItemList = ({ items }: ItemListProps) => {

  const itemViews = items.map(item => <>
    {item.name}
  </>)

  return <>
    <Heading size="md" mb='4'>Items</Heading>
    <SimpleGrid columns={4} spacing='8'>
      <NewItem />
      {itemViews}
    </SimpleGrid>
  </>
}

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