import { EditIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, HStack, Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type ItemImage } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { ItemMedia } from "~/components/item-media"
import Layout from "~/layout"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  item: Item & { collection: Collection } & { images: ItemImage[] }
} & LayoutServerSideProps

const ItemPage: NextPage<Props> = ({ layout, item }) => {
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Link href={`/my/${item.collection.slug}`}>{item.collection.name}</Link>
          <Text display='inline' pl='1' fontWeight={200}>/</Text>
          <Text display='inline' pl='1'>{item.name}</Text>
        </Heading>
        <Button leftIcon={<EditIcon />} variant='solid' as={Link} href={`/my/${item.collection.slug}/${item.slug}/edit`}>
          Edit
        </Button>
      </HStack>
      <Text mb='8'>{item.description}</Text>
      <ItemMedia itemId={item.id} images={item.images} />
    </Layout>
  </>
}

const paramsSchema = z.object({ itemSlug: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { itemSlug, collectionSlug } = paramsSchema.parse(params)

  const currentItem = await prisma.item.findFirst({
    where: {
      collection: {
        slug: collectionSlug,
        userId: auth.user.id,
      },
      slug: itemSlug
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