import { EditIcon } from "@chakra-ui/icons";
import { HStack, Heading, Button, Text, Avatar, WrapItem, Box, Divider, SimpleGrid, Card, CardHeader, CardBody, VStack } from "@chakra-ui/react";
import { getServerSession } from "@evy/auth";
import { type Collection, prisma, type User, type Item } from "@evy/db";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import Link from "next/link";
import Layout from "~/layout"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps";

type Props = {
  user: User & { collections: (Collection & { items: Item[] })[] }
} & LayoutServerSideProps


const Profile: NextPage<Props> = ({ user, layout }) => {
  const userImage = user.image ?? ''

  const nameEmpty = user.name === null || user.name.length === 0

  const collections = user.collections.length > 0
    ? <SimpleGrid columns={1} spacing='8'>
      {user.collections.map(collection => <CollectionView key={collection.id} collection={collection} />)}
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
        <Button leftIcon={<EditIcon />} variant='solid' as={Link} href={`/profile/edit`}>
          Edit
        </Button>
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
      <Text fontWeight={500} color='gray.500'>
        <Text display='inline'>Joined:</Text>
        <Text display='inline'>{user.createdAt.toLocaleDateString('en-GB')}</Text>
      </Text>
      <Divider my='4' />
      <Heading size='md' mb='4'>Collections</Heading>
      {collections}
    </Layout>
  )
}

type CollectionViewProps = {
  collection: Collection & { items: Item[] }
}
const CollectionView = ({ collection }: CollectionViewProps) => {
  const description = collection.description === null || collection.description.length === 0
    ? <Text as='i'>No description</Text>
    : <Text>{collection.description}</Text>
  return <Link href={`/my/${collection.id}`}>
    <Card
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        transitionDuration: '0.1s',
        transitionTimingFunction: "ease-in-out"
      }}
      _active={{
        transform: 'translateY(2px)',
        transitionDuration: '0.1s',
      }}
      cursor='pointer'
    >
      <CardBody>
        <HStack justifyContent='space-between'>
          <Box>
            <Heading size='md'>{collection.name}</Heading>
            {description}
          </Box>
          <Box>
            <Text>Items: {collection.items.length}</Text>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  </Link >
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
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
      layout: {
        collections: user.collections
      }
    }
  }
}

export default Profile