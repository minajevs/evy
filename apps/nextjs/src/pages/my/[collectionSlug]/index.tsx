import { Box, Button, ButtonGroup, HStack, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User, type ItemImage, type ItemTag, type Tag as DbTag, type Tag } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import { MyLayout } from "~/layout"
import { Link } from "@chakra-ui/next-js"
import { Icon } from "@chakra-ui/react"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { ShareDialog } from "~/components/share-dialog/ShareDialog"
import { Edit, MoreVerticalIcon, Share2 } from "lucide-react"
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
import { TagsSelect, type TagLike } from "~/components/items/TagsSelect"
import { ItemFilter } from "~/components/items/ItemFilter"

const StyledLink = styled(Link)`
  text-decoration: none;
  &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none;
  }
`

const viewCookieName = 'preference:item-view'
const pageSize = 30

type ItemProp = Item
  & { collection: Collection & { user: User } }
  & { defaultImage: ItemImage | null }
  & { images: ItemImage[] }
  & { tags: (ItemTag & { tag: DbTag })[] }

type Props = {
  collection: Collection & { items: ItemProp[] } & { user: User } & { htmlDescription: string | null } & { tags: Tag[] },
  tagsFilter: string[] | null,
  view: View,
  sorting: Sorting,
  sortingDirection: SortingDirection,
  page: number,
  totalItems: number
} & LayoutServerSideProps

const CollectionPage: NextPage<Props> = ({ layout, collection, tagsFilter, view, sorting, sortingDirection, page, totalItems }) => {
  const [currentTags, setCurrentTagsFilter] = useState<TagLike[] | null>(tagsFilter === null ? null : collection.tags.filter(tag => tagsFilter.includes(tag.text)))
  const router = useRouter()
  const [cookies, setCookie] = useCookies([viewCookieName])
  const [currentView, setView] = useState<View>(view)

  const updateView = (view: 'grid' | 'table') => {
    setCookie(viewCookieName, view, { path: '/', sameSite: 'strict' })
    setView(view)
  }

  const changePage = async (page: number) => {
    const orderBy = router.query['orderBy']
    const tags = router.query['tags']
    await router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        page,
        ...orderBy === undefined ? {} : { orderBy },
        ...tags === undefined ? {} : { tags },
      } as z.infer<typeof querySchema>,
    })
  }

  const updateSorting = async (sorting: Sorting, direction: SortingDirection) => {
    const tags = router.query['tags']
    await router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        orderBy: `${sorting} ${direction}`,
        ...tags === undefined ? {} : { tags },
      } as z.infer<typeof querySchema>,
    })
  }

  const changeTagFilter = async (tags: TagLike[] | null) => {
    const orderBy = router.query['orderBy']
    const page = router.query['page']
    setCurrentTagsFilter(tags)
    // if tags are unselected, remove them from query and reset pagination
    if (tags === null) {
      await router.push({
        pathname: router.asPath.split('?')[0],
        query: {
          ...orderBy === undefined ? {} : { orderBy },
        } as z.infer<typeof querySchema>,
      })
    } else { // otherwise preserver order and page, and push tags to query
      await router.push({
        pathname: router.asPath.split('?')[0],
        query: {
          ...page === undefined ? {} : { page },
          ...orderBy === undefined ? {} : { orderBy },
          tags: tags.map(x => x.text),
        } as z.infer<typeof querySchema>,
      })
    }
  }

  const addTagToFilter = async (tag: TagLike) => {
    if (currentTags === null) {
      // if no tags selected - add a tag
      await changeTagFilter([tag])
    } else if (currentTags.some(x => x.id === tag.id)) {
      // if clicked tag is already in selected - unselect it
      const newTags = currentTags.filter(x => x.id !== tag.id)
      await changeTagFilter(newTags.length > 0 ? newTags : null)
    } else {
      // if tag no selected - select it
      await changeTagFilter([...currentTags, tag])
    }
  }

  const itemView = collection.items.length === 0
    ? <Box>
      <Text>No items in this collection yet</Text>
      <Text>{'Click "Add" to add a first item'}</Text>
    </Box>
    : currentView === 'grid'
      ? <ItemGrid items={collection.items} onTagClick={addTagToFilter} />
      : <ItemTable items={collection.items} onTagClick={addTagToFilter} />


  return <>
    <MyLayout title="Collection" layout={layout}>
      <HStack width='100%' justifyContent='space-between' alignItems='baseline'>
        <Heading size="lg" mb="4">
          <Text>{collection.name}</Text>
        </Heading>
        {/* Mobile Menu Buttons */}
        <Menu>
          <MenuButton as={IconButton} aria-label="item actions" icon={<Icon as={MoreVerticalIcon} />} variant='outline' display={{ base: 'flex', md: 'none' }}>
            Actions
          </MenuButton>
          <MenuList>
            <ShareDialog
              customButton={<MenuItem icon={<Icon as={Share2} />}>Share</MenuItem>}
              username={collection.user.username}
              collectionSlug={collection.slug}
            />
            <MenuItem icon={<Icon as={Edit} />} as={StyledLink} href={`/my/${collection.slug}/edit`}>
              Edit
            </MenuItem>
          </MenuList>
        </Menu>
        {/* Desktop Menu Buttons */}
        <ButtonGroup display={{ base: 'none', md: 'flex' }}>
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
          <Box display={{ base: 'none', xl: 'flex' }}>
            <TagsSelect
              filter={currentTags}
              tags={collection.tags}
              onTagsChange={changeTagFilter} />
          </Box>
          <ItemFilter
            display={{ base: 'none', lg: 'flex', xl: 'none' }}
            filter={currentTags}
            tags={collection.tags}
            onTagsChange={changeTagFilter}
          />
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
        <HStack>
          <ItemFilter
            filter={currentTags}
            tags={collection.tags}
            onTagsChange={changeTagFilter}
          />
          <ItemViewSelector
            currentView={currentView}
            updateView={updateView}
          />
        </HStack>
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
const querySchema = z.object({
  page: z.coerce.number().optional(),
  orderBy: orderBySchema.optional(),
  tags: z.string().or(z.array(z.string())).optional().transform(arg => arg === undefined ? undefined : arg instanceof Array ? arg : [arg])
})
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
  const tags = (queryResult.success ? queryResult.data.tags : null) ?? null
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
        tags: true,
        items: {
          ...tags !== null && tags.length > 0 ? {
            where: {
              AND: tags.map(tag => ({
                tags: { some: { tag: { text: tag } } }
              }))
            },
          } : {},
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
            },
            defaultImage: true
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
      tagsFilter: tags,
      view: view,
      sorting: orderBy,
      sortingDirection: direction,
      page,
      totalItems: itemCount,
      ...await getLayoutProps(auth.user.id, req.cookies)
    }
  }
}

export default CollectionPage