import { Box, Flex, type BoxProps, CloseButton, Stack, Button, useColorMode, Text, Divider, VStack, Heading, Avatar } from "@chakra-ui/react"
import { NavItemLink } from "./NavItem"
import { useBackgroundColor } from "@evy/styling"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import NewCollection from "~/components/new-collection"
import { signIn, signOut, useSession } from "next-auth/react"

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
        {/* Nav Links */}
        <Box py='4'>
          {linkItems.map((link) => (
            <NavItemLink key={link.name} href={link.href}>
              {link.name}
            </NavItemLink>
          ))}
          <NewCollection />
        </Box>
        {/* Other Settings */}
        <Box px="8" pt="4" pb='16' marginTop='auto'>
          {
            session.status === 'authenticated'
              ? <Button variant='ghost' as={Link} href={`/profile`}>
                <Avatar name={username} src={userimage} size='sm' mx='1' />
                Profile
              </Button>
              : null
          }

          <Button variant='ghost' onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button variant='ghost' onClick={session.status === 'authenticated' ? () => void signOut() : () => void signIn()}>
            {session.status === 'authenticated' ? "Sign out" : "Sign in"}
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}