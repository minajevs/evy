import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { type LinkItem, SidebarContent } from "./SidebarContent"
import { MobileNav } from "./MobileNav"

type Props = {
  linkItems: LinkItem[]
}

export const Sidebar = ({ linkItems }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        linkItems={linkItems}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} linkItems={linkItems} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      {/* <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} /> */}
    </>
  );
}