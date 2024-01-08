import { Flex, type FlexProps, Icon, Text, VStack } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling";
import { Link } from "@chakra-ui/next-js"
import { Inbox, User } from "lucide-react";

type Props = FlexProps

export const BottomNavigation = ({ ...rest }: Props) => {
  const bg = useBackgroundColor('navigation')
  return (
    <Flex
      position='absolute'
      bottom={0}
      w='100vw'
      px={16}
      py={10}
      alignItems="center"
      bg={bg}
      justifyContent='space-around'
      borderBottom="1px"
      borderBottomColor={useBackgroundColor('bold-border')}
      boxShadow='md'
      h={16}
      {...rest}>
      <Link href='/my'>
        <VStack color='teal' spacing={0}>
          <Icon as={Inbox} boxSize={6} />
          <Text fontWeight='600'>
            Collections
          </Text>
        </VStack>
      </Link>
      <Link href='/profile'>
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