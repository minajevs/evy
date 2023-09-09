import { EditIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, HStack, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { api } from "~/utils/api"

type Props = {
  collections: Collection[]
  item: Item & { collection: Collection }
}

const ItemPage: NextPage<Props> = ({ collections, item }) => {
  return <>
    <Layout title="Collection" collections={collections}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Link href={`/my/${item.collectionId}`}>{item.collection.name}</Link> <Text display='inline' fontWeight={200}>/</Text> {item.name}
        </Heading>
        <Button leftIcon={<EditIcon />} variant='solid'>
          Edit
        </Button>
      </HStack>
      <Text mb='8'>{item.description}</Text>
    </Layout>
  </>
}

const paramsSchema = z.object({ itemId: z.string(), collectionId: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { itemId, collectionId } = paramsSchema.parse(params)

  const currentItem = await prisma.item.findFirst({
    where: {
      collection: {
        id: collectionId,
        userId: auth.user.id,
      },
      id: itemId
    },
    include: {
      collection: true
    }
  })

  if (currentItem === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  const allCollections = await prisma.collection.findMany({
    where: {
      userId: auth.user.id
    },
  })


  return {
    props: {
      collections: allCollections,
      item: currentItem
    }
  }
}

export default ItemPage