import { SimpleGrid, HStack, Heading, Avatar, VStack, Divider, Box, Text } from "@chakra-ui/react"
import { prisma, type Collection, type Item, type User } from "@evy/db"
import { type GetServerSideProps, type NextPage } from "next"
import { z } from "zod"
import { CollectionCard } from "~/components/collection/CollectionCard"
import Layout from "~/layout"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  user: User & { collections: (Collection & { items: Item[] })[] }
} & LayoutServerSideProps

const Profile: NextPage<Props> = ({ user, layout }) => {
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
    <Layout layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>Profile</Text>
        </Heading>
      </HStack>

      <HStack mb='4'>
        <Avatar bg='teal.500' name={user.name ?? user.username} src={userImage} />
        <VStack alignItems='baseline' spacing={0}>
          <Heading size='md'>{nameEmpty ? user.username : user.name}</Heading>
          {!nameEmpty
            ? <Text size="sm">{user.username}</Text>
            : null}
        </VStack>
      </HStack>
      <Box fontWeight={500} color='gray.500'>
        <Text display='inline'>Joined:</Text>
        <Text display='inline'>{user.createdAt.toLocaleDateString('en-GB')}</Text>
      </Box>
      <Divider my='4' />
      <Heading size='md' mb='4'>Collections</Heading>
      {collections}
    </Layout>
  )
}

const paramsSchema = z.object({ username: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const { username } = paramsSchema.parse(params)

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      collections: {
        include: {
          items: true
        }
      }
    }
  })

  if (user === null) throw new Error('User is not found in DB')

  return {
    props: {
      user,
      layout: {
        collections: user.collections
      }
    }
  }
}

export default Profile