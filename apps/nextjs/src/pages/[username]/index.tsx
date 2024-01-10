import { SimpleGrid, HStack, Heading, Divider, Box, Text, Avatar, VStack } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { prisma, type Collection, type Item, type User } from "@evy/db"
import { type GetServerSideProps, type NextPage } from "next"
import { z } from "zod"
import { CollectionCard } from "~/components/collections/CollectionCard"
import { SharingLayout } from "~/layout"

type Props = {
  user: User & { collections: (Collection & { items: Item[] })[] }
}

const Profile: NextPage<Props> = ({ user }) => {
  const userImage = user.image ?? ''
  const nameEmpty = user.name === null || user.name.length === 0

  const collections = user.collections.length > 0
    ? <SimpleGrid columns={1} spacing='8'>
      {user.collections.map(collection => <CollectionCard
        key={collection.id}
        collection={collection}
        linkPrefix={user.username}
      />)}
    </SimpleGrid>
    : <Box>
      <Text>No collections yet</Text>
    </Box>

  return (
    <SharingLayout>
      <HStack mb='4'>
        <Avatar size='lg' bg='teal.500' name={user.name ?? user.username} src={userImage} boxShadow='md' />
        <VStack alignItems='baseline' spacing={0}>
          <Heading>{nameEmpty ? user.username : user.name}</Heading>
          {!nameEmpty
            ? <Text fontSize="lg">{user.username}</Text>
            : null}
        </VStack>
      </HStack>
      <Box fontWeight={500} color='gray.500'>
        <Text display='inline'>Joined: {user.createdAt.toLocaleDateString('en-GB')}</Text>
      </Box>
      <Divider my='4' />
      <Heading size='md' mb='4'>Collections</Heading>
      {collections}
    </SharingLayout>
  )
}

const paramsSchema = z.object({ username: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const { username } = paramsSchema.parse(params)
  const auth = await getServerSession({ req, res })

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      collections: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (user === null) throw new Error('User is not found in DB')

  return {
    props: {
      user,
      layout: {
        loggedIn: auth?.user !== undefined,
        collections: []
      }
    }
  }
}

export default Profile