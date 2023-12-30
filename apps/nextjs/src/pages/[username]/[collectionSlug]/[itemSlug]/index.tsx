import { Icon } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import { Box, ButtonGroup, HStack, Heading, Text, useDisclosure } from "@chakra-ui/react"
import { type Collection, prisma, type Item, type ItemImage, type User } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { useCallback, useState } from "react"
import { z } from "zod"
import { ImageGrid } from "~/components/item-media/ImageGrid"
import { ImageModal } from "~/components/item-media/ImageModal"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import Layout from "~/layout"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { FiShare2 } from "react-icons/fi"

type Props = {
  item: Item & { collection: Collection & { user: User } } & { images: ItemImage[] }
} & LayoutServerSideProps

const ItemPage: NextPage<Props> = ({ layout, item }) => {
  const viewImageDisclosure = useDisclosure()
  const [viewImage, setViewImage] = useState<ItemImage | null>(null)

  const onClick = useCallback((image: ItemImage) => {
    setViewImage(image)
    viewImageDisclosure.onOpen()
  }, [setViewImage, viewImageDisclosure])

  return <>
    <Layout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Link href={`/${item.collection.user.username}/${item.collection.slug}`}>{item.collection.name}</Link>
          <Text display='inline' pl='1' fontWeight={200}>/</Text>
          <Text display='inline' pl='1'>{item.name}</Text>
        </Heading>
        <ButtonGroup>
          <ShareDialog
            buttonProps={{ leftIcon: <Icon as={FiShare2} /> }}
            username={item.collection.user.username}
            collectionSlug={item.collection.slug}
            itemSlug={item.slug}
          />
        </ButtonGroup>
      </HStack>
      {
        item.description !== null && item.description.length > 0
          ? <Text mb='8'>{item.description}</Text>
          : null
      }
      <HStack width='100%' justifyContent='space-between' mb={2}>
        <Heading size='md'>Media</Heading>
      </HStack>
      <ImageGrid images={item.images} onClick={onClick}>
        <Box>
          <Text>No media for this item yet</Text>
        </Box>
      </ImageGrid>
      {
        viewImage !== null
          ? <ImageModal
            image={viewImage}
            disclosure={viewImageDisclosure}
          />
          : null
      }
    </Layout>
  </>
}

const paramsSchema = z.object({ username: z.string(), itemSlug: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const { username, itemSlug, collectionSlug } = paramsSchema.parse(params)

  const currentItem = await prisma.item.findFirst({
    where: {
      collection: {
        slug: collectionSlug,
        user: {
          username
        }
      },
      slug: itemSlug
    },
    include: {
      collection: {
        include: {
          user: {
            include: {
              collections: true
            }
          }
        }
      },
      images: true
    }
  })

  if (currentItem === null) {
    return { redirect: { destination: `/${username}/${collectionSlug}`, permanent: false } }
  }

  return {
    props: {
      item: currentItem,
      layout: {
        collections: currentItem.collection.user.collections
      }
    }
  }
}

export default ItemPage