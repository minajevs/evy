import { Box, Button, ButtonGroup, HStack, Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User, type ItemImage, type ItemTag, type Tag as DbTag } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import { MyLayout } from "~/layout"
import { Link } from "@chakra-ui/next-js"
import { Icon } from "@chakra-ui/react"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import { Edit, Share2 } from "lucide-react"
import { type SortingDirection } from "~/utils/sorting/types"
import { ItemGrid } from "~/components/items/ItemGrid"
import { useState } from "react"
import { useRouter } from "next/router"
import { ItemTable } from "~/components/items/ItemTable"
import { useCookies } from "react-cookie"
import { Pagination } from "~/components/common/Paginations"
import { ItemSorting, type Sorting } from "~/components/items/ItemSorting"
import { ItemViewSelector, type View } from "~/components/items/ItemViewSelector"
import { HtmlView } from "~/components/common/HtmlView"
import styled from "@emotion/styled"

const StyledLink = styled(Link)`
  text-decoration: none;
  &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none;
  }
`

const viewCookieName = 'preference:item-view'
const pageSize = 30

type ItemProp = Item & { collection: Collection & { user: User } } & { images: ItemImage[] } & { tags: (ItemTag & { tag: DbTag })[] }

type Props = {
  collection: Collection & { items: ItemProp[] } & { user: User } & { htmlDescription: string | null },
  view: View,
  sorting: Sorting,
  sortingDirection: SortingDirection,
  page: number,
  totalItems: number
} & LayoutServerSideProps

const CollectionPage: NextPage<Props> = ({ layout, collection, view, sorting, sortingDirection, page, totalItems }) => {
  const router = useRouter()
  const [cookies, setCookie] = useCookies([viewCookieName]);
  const [currentView, setView] = useState<View>(view)

  const updateView = (view: 'grid' | 'table') => {
    setCookie(viewCookieName, view, { path: '/', sameSite: 'strict' })
    setView(view)
  }

  const changePage = async (page: number) => {
    const orderBy = router.query['orderBy']
    await router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        page,
        ...orderBy === undefined ? {} : { orderBy },
      } as z.infer<typeof querySchema>,
    })
  }

  const updateSorting = async (sorting: Sorting, direction: SortingDirection) => {
    await router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        orderBy: `${sorting} ${direction}`
      } as z.infer<typeof querySchema>,
    })
  }

  const itemView = collection.items.length === 0
    ? <Box>
      <Text>No items in this collection yet</Text>
      <Text>{'Click "Add" to add a first item'}</Text>
    </Box>
    : currentView === 'grid'
      ? <ItemGrid items={collection.items} />
      : <ItemTable items={collection.items} />


  return <>
    <MyLayout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
        <ButtonGroup isAttached>
          <ShareDialog
            buttonProps={{ leftIcon: <Icon as={Share2} />, variant: 'outline' }}
            username={collection.user.username}
            collectionSlug={collection.slug}
          />
          <Button leftIcon={<Icon as={Edit} />} variant='outline' as={StyledLink} href={`/my/${collection.slug}/edit`}>
            Edit
          </Button>
        </ButtonGroup>
      </HStack>
      <HtmlView mb={8} value={collection.htmlDescription} />
      <HStack width='100%' justifyContent='space-between' mb='4'>
        <HStack alignItems='baseline' spacing={8}>
          <Heading size="md">Items</Heading>
          <ItemSorting
            display={{ base: 'none', lg: 'flex' }}
            sorting={sorting}
            sortingDirection={sortingDirection}
            updateSorting={updateSorting} />
        </HStack>
        <HStack>
          <ItemViewSelector
            display={{ base: 'none', lg: 'flex' }}
            currentView={currentView}
            updateView={updateView}
          />
          <NewItem collectionId={collection.id} />
        </HStack>
      </HStack>
      <HStack mb={4} display={{ base: 'flex', lg: 'none' }} justifyContent='space-between'>
        <ItemSorting
          sorting={sorting}
          sortingDirection={sortingDirection}
          updateSorting={updateSorting} />
        <ItemViewSelector
          currentView={currentView}
          updateView={updateView}
        />
      </HStack>
      {itemView}
      <Pagination currentPage={page} totalItems={totalItems} pageSize={pageSize} changePage={changePage} mt={4} />
    </MyLayout >
  </>
}

const orderBySchema = z.enum([
  'name asc', 'name desc',
  'date asc', 'date desc'
])
const querySchema = z.object({ page: z.coerce.number().optional(), orderBy: orderBySchema.optional() })
const paramsSchema = z.object({ collectionSlug: z.string() })

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params, query }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { collectionSlug } = paramsSchema.parse(params)
  const queryResult = querySchema.safeParse(query)

  const page = (queryResult.success ? queryResult.data.page : null) ?? 1
  const order = (queryResult.success ? queryResult.data.orderBy : null) ?? 'date desc'
  const [orderBy, direction] = order.split(' ') as [Sorting, SortingDirection]

  const view = req.cookies[viewCookieName] as View | undefined ?? 'grid'

  const skip = (page - 1) * pageSize
  const take = pageSize

  const [currentCollection, itemCount] = await prisma.$transaction([
    prisma.collection.findFirst({
      where: {
        userId: auth.user.id,
        slug: collectionSlug,
      },
      include: {
        user: true,
        items: {
          skip,
          take,
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
          },
          orderBy: {
            ...(orderBy === 'name' ? { name: direction } : {}),
            ...(orderBy === 'date' ? { createdAt: direction } : {})
          }
        }
      }
    }),
    prisma.item.count({
      where: {
        collection: {
          userId: auth.user.id,
          slug: collectionSlug,
        }
      }
    })
  ])

  if (currentCollection === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  return {
    props: {
      collection: currentCollection,
      view: view,
      sorting: orderBy,
      sortingDirection: direction,
      page,
      totalItems: itemCount,
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default CollectionPage