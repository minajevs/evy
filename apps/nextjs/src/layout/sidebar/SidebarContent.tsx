import { Box, Flex, type BoxProps, CloseButton, Stack, Button, useColorMode, Text, Divider, VStack } from "@chakra-ui/react"
import { NavItemLink } from "./NavItem"
import { useBackgroundColor } from "@evy/styling"
import { UserButton } from "@clerk/nextjs"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import NewCollection from "~/components/new-collection"

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
      <VStack h='full' justifyContent='space-between'>
        <Box>
          <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              <Link href="/">
                📚 Evy
              </Link>
            </Text>
            <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
          </Flex>
          {linkItems.map((link) => (
            <NavItemLink key={link.name} href={link.href}>
              {link.name}
            </NavItemLink>
          ))}
          <NewCollection />
        </Box>
        <Box px="8" py="16">
          <Stack direction={'row'} spacing={7}>
            <Button variant='ghost' onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <UserButton />
          </Stack>
        </Box>
      </VStack>
    </Box>
  )
}