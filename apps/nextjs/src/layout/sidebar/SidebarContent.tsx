import { Box, Flex, type BoxProps, CloseButton, Stack, Button, useColorMode, Text, Divider, VStack, Heading, Avatar, HStack } from "@chakra-ui/react"
import { NavItemLink } from "./NavItem"
import { useBackgroundColor } from "@evy/styling"
import { Icon } from '@chakra-ui/react'
import { FiInbox, FiMoon, FiSun } from 'react-icons/fi'
import { Link } from "@chakra-ui/next-js"
import { signIn, signOut, useSession } from "next-auth/react"
import NewCollectionDialog from "~/components/collection/NewCollectionDialog"

export type LinkItem = {
  name: string
  href: string
}

type SidebarProps = {
  onClose: () => void
  linkItems: LinkItem[]
} & BoxProps

export const SidebarContent = ({ onClose, linkItems, ...rest }: SidebarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useBackgroundColor('navigation')
  const session = useSession()

  const username = session.data?.user.name ?? ''
  const userimage = session.data?.user.image ?? ''

  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRightColor={useBackgroundColor('bold-border')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      boxShadow='lg'
      {...rest}>
      <VStack h='full'>
        {/* Heading */}
        <Box pt='8' pb='4' w='100%'>
          <Heading size="lg" mx='8' mb='4' justifyContent='flex-start'>
            <Link href="/">
              Evy ⚡️
            </Link>
          </Heading>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Box>
        {/* Collections navigation */}
        <Box py='4' width='100%'>
          <Text px='8' py='2' color='teal' fontWeight='600'>
            <Icon as={FiInbox} /> Collections
          </Text>
          {linkItems.map((link) => (
            <NavItemLink key={link.name} href={link.href}>
              {link.name}
            </NavItemLink>
          ))}
          <NewCollectionDialog />
        </Box>
        {/* Other Settings */}
        <Box width='100%' pt="4" pb='16' marginTop='auto'>
          <Divider />
          <NavItemLink href='/profile' alignItems='center' flexDirection='row'>
            Profile
          </NavItemLink>

          <HStack width='100%' spacing='0'>
            <Button width='100%' px='8' justifyContent='flex-start' textAlign='left' variant='ghost' onClick={session.status === 'authenticated' ? () => void signOut() : () => void signIn()}>
              {session.status === 'authenticated' ? "Sign out" : "Sign in"}
            </Button>
            <Button width='100%' variant='ghost' onClick={toggleColorMode}>
              {colorMode === 'light' ? <Icon as={FiMoon} /> : <Icon as={FiSun} />}
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}