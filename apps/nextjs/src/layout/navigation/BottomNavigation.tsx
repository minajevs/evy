import { Flex, type FlexProps, Icon, Text, VStack } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling";
import { Link } from "@chakra-ui/next-js"
import { Inbox, User } from "lucide-react";

type Props = FlexProps

export const BottomNavigation = ({ ...rest }: Props) => {
  const bg = useBackgroundColor('navigation')
  return (
    <Flex
      as='nav'
      position='fixed'
      bottom={0}
      w='100vw'
      px={16}
      alignItems="center"
      bg={bg}
      justifyContent='space-around'
      borderBottom="1px"
      borderBottomColor={useBackgroundColor('bold-border')}
      boxShadow='md'
      {...rest}>
      <Link href='/my' my={4}>
        <VStack color='teal' spacing={0}>
          <Icon as={Inbox} boxSize={6} />
          <Text fontWeight='600'>
            Collections
          </Text>
        </VStack>
      </Link>
      <Link href='/profile' my={4}>
        <VStack color='teal' spacing={0}>
          <Icon as={User} boxSize={6} />
          <Text fontWeight='600'>
            Profile
          </Text>
        </VStack>
      </Link>
    </Flex>
  )
}