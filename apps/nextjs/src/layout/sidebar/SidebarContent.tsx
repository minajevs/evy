import { Box, Flex, type BoxProps, CloseButton } from "@chakra-ui/react"
import { NavItem } from "./NavItem"
import { useBackgroundColor } from "@evy/styling"

export type LinkItem = {
  name: string
  href: string
}

type SidebarProps = {
  onClose: () => void
  linkItems: LinkItem[]
} & BoxProps

export const SidebarContent = ({ onClose, linkItems, ...rest }: SidebarProps) => {
  const bg = useBackgroundColor('navigation')
  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRightColor={useBackgroundColor('bold-border')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h='10' alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {linkItems.map((link) => (
        <NavItem key={link.name}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}