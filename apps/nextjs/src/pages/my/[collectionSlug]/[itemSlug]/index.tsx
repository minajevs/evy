import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import { Button, ButtonGroup, HStack, Heading, Text, useDisclosure } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type ItemImage, type User, type ItemTag, type Tag } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { ItemMedia } from "~/components/item-media"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import { MyLayout } from "~/layout"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { Edit, MoreVerticalIcon, Plus, Share2 } from "lucide-react"
import { HtmlView } from "~/components/common/HtmlView"
import styled from "@emotion/styled"
import { ItemTags } from "~/components/items/ItemTags"

const StyledLink = styled(Link)`
  text-decoration: none;
  &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none;
  }
`

type Props = {
  item: Item
  & { collection: Collection & { user: User } & { tags: Tag[] } }
  & { images: ItemImage[] }
  & { htmlDescription: string | null }
  & { tags: (ItemTag & { tag: Tag })[] }
} & LayoutServerSideProps

const ItemPage: NextPage<Props> = ({ layout, item }) => {
  const uploadDisclosure = useDisclosure()

  return <>
    <MyLayout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between' alignItems='baseline'>
        <Heading size="lg" mb="4">
          <Link href={`/my/${item.collection.slug}`}>{item.collection.name}</Link>
          <Text display='inline' pl='1' fontWeight={200}>/</Text>
          <Text display='inline' pl='1'>{item.name}</Text>
        </Heading>
        {/* Mobile Menu Buttons */}
        <Menu>
          <MenuButton as={IconButton} aria-label="item actions" icon={<Icon as={MoreVerticalIcon} />} variant='outline' display={{ base: 'flex', md: 'none' }}>
            Actions
          </MenuButton>
          <MenuList>
            <ShareDialog
              customButton={<MenuItem icon={<Icon as={Share2} />}>Share</MenuItem>}
              username={item.collection.user.username}
              collectionSlug={item.collection.slug}
              itemSlug={item.slug}
            />
            <MenuItem icon={<Icon as={Edit} />} as={StyledLink} href={`/my/${item.collection.slug}/${item.slug}/edit`}>
              Edit
            </MenuItem>
          </MenuList>
        </Menu>
        {/* Desktop Menu Buttons */}
        <ButtonGroup display={{ base: 'none', md: 'flex' }}>
          <ShareDialog
            buttonProps={{ leftIcon: <Icon as={Share2} />, variant: 'outline' }}
            username={item.collection.user.username}
            collectionSlug={item.collection.slug}
            itemSlug={item.slug}
          />
          <Button leftIcon={<Icon as={Edit} />} variant='outline' as={StyledLink} href={`/my/${item.collection.slug}/${item.slug}/edit`}>
            Edit
          </Button>
        </ButtonGroup>
      </HStack>
      <ItemTags my={4} itemId={item.id} collectionTags={item.collection.tags} tags={item.tags.map(x => x.tag)} />
      <HtmlView mb={8} value={item.htmlDescription} />
      <HStack width='100%' justifyContent='space-between' mb={2}>
        <Heading size='md'>Media</Heading>
        <Button leftIcon={<Icon as={Plus} />} variant='solid' onClick={uploadDisclosure.onOpen}>
          Add
        </Button>
      </HStack>
      <ItemMedia itemId={item.id} images={item.images} uploadDisclosure={uploadDisclosure} />
    </MyLayout>
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
      tags: {
        include: {
          tag: true
        }
      },
      collection: {
        include: {
          user: true,
          tags: true
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