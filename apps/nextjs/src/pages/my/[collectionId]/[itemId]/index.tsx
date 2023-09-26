import { AddIcon, EditIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, HStack, Heading, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type ItemImage } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { ItemMedia } from "~/components/item-media"
import { UploadDialog } from "~/components/item-media/new-media/UploadDialog"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { api } from "~/utils/api"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  item: Item & { collection: Collection } & { images: ItemImage[] }
} & LayoutServerSideProps

const ItemPage: NextPage<Props> = ({ layout, item }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Link href={`/my/${item.collectionId}`}>{item.collection.name}</Link>
          <Text display='inline' pl='1' fontWeight={200}>/</Text>
          <Text display='inline' pl='1'>{item.name}</Text>
        </Heading>
        <Button leftIcon={<EditIcon />} variant='solid' as={Link} href={`/my/${item.collection.id}/${item.id}/edit`}>
          Edit
        </Button>
      </HStack>
      <Text mb='8'>{item.description}</Text>
      <ItemMedia itemId={item.id} images={item.images} />
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
      collection: true,
      images: true
    }
  })

  if (currentItem === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  return {
    props: {
      item: currentItem,
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default ItemPage