import { Box, Card, CardBody, HStack, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { type Collection, prisma, type Item, type User, type ItemImage } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { SharingLayout } from "~/layout"
import { ItemCard } from "~/components/items/ItemCard"
import { getServerSession } from "@evy/auth"
import { HtmlView } from "~/components/common/HtmlView"
import { Link } from "@chakra-ui/next-js"
import { ProfileCard } from "~/components/profile/ProfileCard"

type ItemProp = Item & { collection: Collection } & { images: ItemImage[] }

type Props = {
  collection: Collection & { items: ItemProp[] } & { user: User } & { htmlDescription: string | null }
}

const UserCollectionPage: NextPage<Props> = ({ collection }) => {
  const showDescription = collection.description !== null && collection.description.length !== 0

  return <>
    <SharingLayout title={`${collection.name} - ${collection.user.name ?? collection.user.username}`}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading mb={4}>
          <Text>{collection.name}</Text>
        </Heading>
      </HStack>
      <Link href={`/${collection.user.username}`}>
        <ProfileCard
          mb={8}
          user={collection.user}
        />
      </Link>
      {showDescription
        ? <Card boxShadow='xl' mb={8}>
          <CardBody>
            <HtmlView value={collection.htmlDescription} />
          </CardBody>
        </Card>
        : null
      }
      <HStack
        width='100%'
        mb='4'
        alignItems='baseline'
        spacing={8}>
        <Heading size="md">Items</Heading>
        <Text fontWeight={500} color='gray.500' whiteSpace='nowrap'>Total: {collection.items.length}</Text>
      </HStack>
      <ItemList items={collection.items} username={collection.user.username} />
    </SharingLayout >
  </>
}

type ItemListProps = {
  username: string
  items: ItemProp[]
}
const ItemList = ({ username, items }: ItemListProps) => {
  if (items.length === 0) {
    return <Box>
      <Text>No items in this collection yet</Text>
    </Box>
  }
  return <SimpleGrid columns={4} spacing='8'>
    {items.map(item => <ItemCard key={item.id} item={item} linkPrefix={username} />)}
  </SimpleGrid>
}

const paramsSchema = z.object({ username: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const { username, collectionSlug } = paramsSchema.parse(params)
  const auth = await getServerSession({ req, res })

  const currentCollection = await prisma.collection.findFirst({
    where: {
      user: {
        username
      },
      slug: collectionSlug,
    },
    include: {
      user: {
        include: {
          collections: true
        }
      },
      items: {
        include: {
          collection: true,
          images: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      }
    }
  })

  if (currentCollection === null) {
    return { redirect: { destination: `/${username}`, permanent: false } }
  }

  return {
    props: {
      collection: currentCollection,
      layout: {
        loggedIn: auth?.user !== undefined,
        collections: []
      }
    }
  }
}

export default UserCollectionPage