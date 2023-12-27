import { Flex, IconButton, type FlexProps, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling";
import { Link } from "@chakra-ui/next-js"
import { FiInbox, FiSearch, FiUser } from "react-icons/fi";
import { NavItemLink } from "./NavItem";

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
          <Icon as={FiInbox} boxSize={6} />
          <Text fontWeight='600'>
            Collections
          </Text>
        </VStack>
      </Link>
      <Link href='/profile'>
        <VStack color='teal' spacing={0}>
          <Icon as={FiUser} boxSize={6} />
          <Text fontWeight='600'>
            Profile
          </Text>
        </VStack>
      </Link>
    </Flex>
  )
}