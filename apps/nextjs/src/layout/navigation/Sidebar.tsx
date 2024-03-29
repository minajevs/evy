import { Box, type BoxProps, Button, useColorMode, Text, Divider, VStack, Heading, HStack } from "@chakra-ui/react"
import { NavItemBase, NavItemLink } from "./NavItem"
import { useBackgroundColor } from "@evy/styling"
import { Icon } from '@chakra-ui/react'
import { Inbox, Moon, Sun, User } from 'lucide-react'
import { Link } from "@chakra-ui/next-js"
import { signIn, signOut, useSession } from "next-auth/react"
import NewCollectionDialog from "~/components/collections/NewCollectionDialog"
import { EvyLogo } from "~/components/logo/EvyLogo"

export type LinkItem = {
  name: string
  href: string
}

type SidebarProps = {
  linkItems: LinkItem[]
} & BoxProps

export const Sidebar = ({ linkItems, ...rest }: SidebarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useBackgroundColor('navigation')
  const session = useSession()

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
            <Link href='/' _hover={{
              textDecoration: 'none'
            }}>
              <EvyLogo />
            </Link>
          </Heading>
        </Box>
        {/* Collections navigation */}
        <Box py='4' width='100%'>
          <NavItemLink href='/my' alignItems='center' flexDirection='row'>
            <HStack color="primary">
              <Icon as={Inbox} />
              <Text fontWeight='600'>
                Collections
              </Text>
            </HStack>
          </NavItemLink>
          {linkItems.map((link) => (
            <NavItemLink key={link.name} href={link.href}>
              {link.name}
            </NavItemLink>
          ))}
          <NewCollectionDialog as={NavItemBase} display="flex" mt={8} />
        </Box>
        {/* Other Settings */}
        <Box width='100%' pt="4" pb='16' marginTop='auto'>
          <Divider />
          <NavItemLink href='/profile' alignItems='center' flexDirection='row'>
            <HStack color='primary'>
              <Icon as={User} />
              <Text fontWeight='600'>
                Profile
              </Text>
            </HStack>
          </NavItemLink>

          <HStack width='100%' spacing='0'>
            <Button width='100%' px='8' justifyContent='flex-start' textAlign='left' variant='ghost' onClick={session.status === 'authenticated' ? () => void signOut({ callbackUrl: '/' }) : () => void signIn()}>
              {session.status === 'authenticated' ? "Sign out" : "Sign in"}
            </Button>
            <Button width='100%' variant='ghost' onClick={toggleColorMode}>
              {colorMode === 'light' ? <Icon as={Moon} /> : <Icon as={Sun} />}
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}