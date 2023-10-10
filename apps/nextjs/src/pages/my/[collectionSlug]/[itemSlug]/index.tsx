import { EditIcon, LinkIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, ButtonGroup, HStack, Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type ItemImage, type User } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { ItemMedia } from "~/components/item-media"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import { env } from "~/env.mjs"
import Layout from "~/layout"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  item: Item & { collection: Collection & { user: User } } & { images: ItemImage[] }
} & LayoutServerSideProps

const ItemPage: NextPage<Props> = ({ layout, item }) => {
  const url = `${env.NEXT_PUBLIC_HOST}/${item.collection.user.username}/${item.collection.slug}/${item.slug}`
  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Link href={`/my/${item.collection.slug}`}>{item.collection.name}</Link>
          <Text display='inline' pl='1' fontWeight={200}>/</Text>
          <Text display='inline' pl='1'>{item.name}</Text>
        </Heading>
        <ButtonGroup>
          <ShareDialog buttonProps={{ leftIcon: <LinkIcon /> }}>
            {url}
          </ShareDialog>
          <Button leftIcon={<EditIcon />} variant='solid' as={Link} href={`/my/${item.collection.slug}/${item.slug}/edit`}>
            Edit
          </Button>
        </ButtonGroup>
      </HStack>
      {
        item.description !== null && item.description.length > 0
          ? <Text mb='8'>{item.description}</Text>
          : null
      }

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
      collection: {
        include: {
          user: true
        }
      },
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