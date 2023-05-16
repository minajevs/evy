import { Heading, Text } from "@chakra-ui/react"
import { getAuth } from "@clerk/nextjs/server"
import { type Collection, prisma } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import Layout from "~/layout"

type Props = {
  collections: Collection[]
}

const MyPage: NextPage<Props> = ({ collections }) => {
  return <>
    <Layout title="My" collections={collections}>
      {
        collections.length === 0
          ? <NoCollections />
          : ''
      }
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
  const auth = getAuth(req)

  if (!auth.userId) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: auth.userId
    }
  })

  return {
    props: {
      collections
    }
  }
}

export default MyPage