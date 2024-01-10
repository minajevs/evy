import { Icon } from "@chakra-ui/react"
import { HStack, Heading, Button, Text, Box, Divider, SimpleGrid } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth";
import { type Collection, prisma, type User, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { Edit } from "lucide-react"
import { CollectionCard } from "~/components/collections/CollectionCard"
import { MyLayout } from "~/layout"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { ProfileCard } from "~/components/profile/ProfileCard";

type Props = {
  user: User & { collections: (Collection & { items: Item[] })[] }
} & LayoutServerSideProps


const Profile: NextPage<Props> = ({ user, layout }) => {
  const collections = user.collections.length > 0
    ? <SimpleGrid columns={1} spacing='8'>
      {user.collections.map(collection => <CollectionCard key={collection.id} collection={collection} />)}
    </SimpleGrid>
    : <Box>
      <Text>No collections yet</Text>
    </Box>

  return (
    <MyLayout layout={layout}>
      <HStack width='100%' justifyContent='space-between'>
        <Heading size="lg" mb="4">
          <Text>Profile</Text>
        </Heading>
        <Button leftIcon={<Icon as={Edit} />} variant='solid' as={Link} href={`/profile/edit`}>
          Edit
        </Button>
      </HStack>

      <ProfileCard user={user} />

      <Box fontWeight={500} color='gray.500'>
        <Text display='inline'>Joined:</Text>
        <Text display='inline'>{user.createdAt.toLocaleDateString('en-GB')}</Text>
      </Box>
      <Divider my='4' />
      <Heading size='md' mb='4'>Collections</Heading>
      {collections}
    </MyLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const user = await prisma.user.findFirst({
    where: {
      id: auth.user.id
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
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default Profile