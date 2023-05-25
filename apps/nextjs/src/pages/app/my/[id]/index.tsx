import { Heading, Text } from "@chakra-ui/react"
import { getAuth } from "@clerk/nextjs/server"
import { type Collection, prisma } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import Layout from "~/layout"

type Props = {
  collections: Collection[]
  collection: Collection
}

const CollectionPage: NextPage<Props> = ({ collections, collection }) => {
  return <>
    <Layout title="Collection" collections={collections}>
      <Heading size="lg" mb="4">{collection.name}</Heading>
      <Text>{collection.description}</Text>
    </Layout>
  </>
}

const paramsSchema = z.object({ id: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = getAuth(req)
  if (!auth.userId) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { id } = paramsSchema.parse(params)

  const collections = await prisma.collection.findMany({
    where: {
      userId: auth.userId
    }
  })

  const collection = collections.find(x => x.id === id)

  if (collection === undefined) {
    return { redirect: { destination: '/app/my', permanent: false } }
  }

  return {
    props: {
      collections,
      collection
    }
  }
}

export default CollectionPage