import { HStack, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, type Item, prisma } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { CollectionCard } from "~/components/collections/CollectionCard"
import NewCollectionDialog from "~/components/collections/NewCollectionDialog"
import Layout from "~/layout"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  collections: (Collection & { items: Item[] })[]
} & LayoutServerSideProps

const MyPage: NextPage<Props> = ({
  collections, layout
}) => {

  if (collections.length === 0)
    return <>
      <Layout title="My Collections" layout={layout}>
        <NoCollections />
      </Layout>
    </>

  const colllectionView = <SimpleGrid columns={1} spacing='8'>
    {collections.map(collection => <CollectionCard key={collection.id} collection={collection} />)}
  </SimpleGrid>

  return <>
    <Layout title="My Collections" layout={layout}>
      <HStack width='100%' justifyContent='space-between' mb='4'>
        <Heading size="md">Collections</Heading>
        <NewCollectionDialog />
      </HStack>
      {colllectionView}
    </Layout>
  </>
}

const NoCollections = () => {
  return <>
    <Heading size="lg">You have no collections yet</Heading>
    <Text>Start by creating a new collection</Text>
  </>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const auth = await getServerSession({ req, res })

  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: auth.user.id
    },
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    props: {
      collections,
      ...await getLayoutProps(auth.user.id)
    }
  }

}

export default MyPage