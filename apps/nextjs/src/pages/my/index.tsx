import { Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { prisma } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import Layout from "~/layout"

const MyPage: NextPage = () => {
  return <>
    <Layout title="My" collections={[]}>
      <NoCollections />
    </Layout>
  </>
}

const NoCollections = () => {
  return <>
    <Heading size="lg">You have no collections yet</Heading>
    <Text>Start by creating a new collection</Text>
  </>
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const auth = await getServerSession({ req, res })

  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: auth.user.id
    }
  })

  if (collections.length === 0) {
    return { props: {} }
  }

  return { redirect: { destination: `/my/${collections[0]!.id}`, permanent: false } }
}

export default MyPage