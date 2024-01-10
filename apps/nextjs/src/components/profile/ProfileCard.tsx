import { HStack, Avatar, VStack, Text, Heading, type StackProps } from "@chakra-ui/react"
import { type User } from "@evy/db"

type Props = {
  user: User
} & StackProps
export const ProfileCard = ({ user, ...rest }: Props) => {
  const userImage = user.image ?? ''
  const nameEmpty = user.name === null || user.name.length === 0

  return <HStack mb='4' {...rest}>
    <Avatar bg='teal.500' name={user.name ?? user.username} src={userImage} boxShadow='md' />
    <VStack alignItems='baseline' spacing={0}>
      <Heading size='md'>{nameEmpty ? user.username : user.name}</Heading>
      {!nameEmpty
        ? <Text size="sm">{user.username}</Text>
        : null}
    </VStack>
  </HStack>
}