import { Link } from "@chakra-ui/next-js"
import { Box, Card, CardBody, Center, Divider, Flex, HStack, Heading, Icon, IconButton, Text, VStack, useDisclosure } from "@chakra-ui/react"
import { type Collection, prisma, type Item, type ItemImage, type User, type ItemTag, type Tag as DbTag } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { useCallback, useRef, useState } from "react"
import { z } from "zod"
import { ImageModal } from "~/components/item-media/ImageModal"
import { SharingLayout } from "~/layout"
import { getServerSession } from "@evy/auth"
import { HtmlView } from "~/components/common/HtmlView"
import { ImageDisplay } from "~/components/common/ImageDisplay"
import { ArrowLeft, ArrowRight, Expand } from "lucide-react"
import { useHasOverflow } from "~/utils/useHasOverflow"
import { ProfileCard } from "~/components/profile/ProfileCard"
import { ItemTagView } from "~/components/items/ItemTagView"

type ItemProp = Item
  & { collection: Collection & { user: User } }
  & { images: ItemImage[] }
  & { htmlDescription: string | null }
  & { tags: (ItemTag & { tag: DbTag })[] }

type Props = {
  item: ItemProp
}

const ItemPage: NextPage<Props> = ({ item }) => {
  const View = item.images.length > 0
    ? ImageView
    : NoImageView

  return <>
    <SharingLayout title={`${item.name} - ${item.collection.name} - ${item.collection.user.name ?? item.collection.user.username}`}>
      <View item={item} />
    </SharingLayout>
  </>
}

const ItemHeading = ({ item }: Props) => {
  return <>
    <Heading mb={4}>
      <Text display='inline'>{item.name}</Text>
    </Heading>
    <HStack alignItems='top' spacing={4}>
      <Link href={`/${item.collection.user.username}`} mb={4}>
        <ProfileCard
          user={item.collection.user}
        />
      </Link>
      <Center height={12}>
        <Divider opacity={1} orientation='vertical' />
      </Center>
      <Link href={`/${item.collection.user.username}/${item.collection.slug}`}>
        <Heading fontWeight={400} size="md">
          {item.collection.name}
        </Heading>
      </Link>
    </HStack>
  </>
}

const NoImageView = ({ item }: Props) => {
  return <>
    <ItemHeading item={item} />
    <Card>
      <CardBody>
        <HtmlView mb={8} value={item.htmlDescription} />
      </CardBody>
    </Card>
  </>
}

const ImageView = ({ item }: Props) => {
  const viewImageDisclosure = useDisclosure()
  const [viewImage, setViewImage] = useState<ItemImage>(item.images[0]!)
  const [openImage, setOpenImage] = useState<ItemImage | null>(null)

  const onClick = useCallback(() => {
    setOpenImage(viewImage)
    viewImageDisclosure.onOpen()
  }, [setOpenImage, viewImageDisclosure, viewImage])

  const showImageDescription = (viewImage.name !== null && viewImage.name.length !== 0) || (viewImage.description !== null && viewImage.description.length !== 0)

  return <>
    <Flex
      height='100%'
      alignItems='start'
      gap={5}
      direction={{ base: 'column', md: 'row' }}
    >
      <Box width={{ base: '100%', md: '50%' }}>
        <ItemHeading item={item} />
        {
          item.tags.length > 0
            ? <Flex mb={4} gap={2} flexWrap='wrap' width='full'>
              {item.tags.map(tag => <ItemTagView key={tag.id} tag={tag.tag} onClick={console.log} />)}
            </Flex>
            : null
        }
        {item.description !== null && item.description.length > 0
          ? <Card boxShadow='xl' mb={4}>
            <CardBody>
              <HtmlView value={item.htmlDescription} />
            </CardBody>
          </Card>
          : null
        }
      </Box>
      <VStack
        height='100%'
        width={{ base: '100%', md: '50%' }}
        minHeight='50vh'
        spacing={9}
      >
        <Card
          height='100%'
          width='100%'
          overflow='hidden'
          boxShadow='xl'
        >
          <Box
            position='relative'
            width='100%'
            height='100%'
            cursor='pointer'
            onClick={onClick}
          >
            <ImageDisplay
              minHeight='33vh'
              overflow='hidden'
              image={viewImage}
              fit={'cover'}
              height='100%'
            />
            <IconButton
              aria-label="expand image"
              isRound
              position='absolute'
              top={2}
              right={2}
              opacity={0.5}
              _hover={{
                opacity: 1
              }}
              icon={<Icon as={Expand} />}
            />
          </Box>
          {
            showImageDescription
              ? <CardBody>
                <Text as='b'>{viewImage.name}</Text>
                <Text>{viewImage.description}</Text>
              </CardBody>
              : null
          }
        </Card>
        <ScrollableItemList images={item.images} onImageClick={setViewImage} />
      </VStack>
    </Flex>
    {
      openImage !== null
        ? <ImageModal
          image={openImage}
          disclosure={viewImageDisclosure}
        />
        : null
    }
  </>
}

type ScrollableItemListProps = {
  images: ItemImage[]
  onImageClick: (image: ItemImage) => void
}
const ScrollableItemList = ({ images, onImageClick }: ScrollableItemListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasOverflow = useHasOverflow(scrollRef)

  if (images.length <= 1) return null

  return <VStack
    height={{ base: '33%', md: '22%' }}
    width='100%'
  >
    <Flex
      direction='row'
      gap={3}
      flex={1}
      width='100%'
      height='100%'
      alignItems='flex-start'
      overflowX='scroll'
      ref={scrollRef}
    >
      {images.map(image => <Box
        height='100%'
        aspectRatio='1/1'
        key={image.id}>
        <ImageDisplay
          minHeight='10vh'
          aspectRatio='1/1'
          width='100%'
          height='100%'
          image={image}
          cursor='pointer'
          onClick={() => onImageClick(image)}
        />
      </Box>)}
    </Flex>
    <Box visibility={hasOverflow ? 'unset' : 'hidden'} display='flex' alignItems='center'>
      <Icon as={ArrowLeft} />  <Text mx={4}>scroll for more</Text> <Icon as={ArrowRight} />
    </Box>

  </VStack>
}

const paramsSchema = z.object({ username: z.string(), itemSlug: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const { username, itemSlug, collectionSlug } = paramsSchema.parse(params)
  const auth = await getServerSession({ req, res })

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
      tags: {
        include: {
          tag: true
        }
      },
      collection: {
        include: {
          user: true
        }
      },
      images: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (currentItem === null) {
    return { redirect: { destination: `/${username}/${collectionSlug}`, permanent: false } }
  }

  return {
    props: {
      item: currentItem,
      layout: {
        loggedIn: auth?.user !== undefined,
        collections: []
      }
    }
  }
}

export default ItemPage