import { Link } from "@chakra-ui/next-js"
import { Icon, IconButton, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, useDisclosure, type MenuProps, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import { CircleUserRoundIcon, EditIcon, LogOutIcon, MessageCircleQuestionIcon, UserIcon } from "lucide-react"
import { signOut } from 'next-auth/react'
import { FeedbackForm } from "../feedback/FeedbackForm"

type Props = {
} & Omit<MenuProps, 'children'>
export const ProfileNavButton = ({ }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return <>
    <Menu>
      <MenuButton as={IconButton} isRound variant='ghost' icon={<Icon as={CircleUserRoundIcon} />}>
        Profile
      </MenuButton>
      <MenuList>
        <MenuGroup title='Profile'>
          <MenuItem icon={<Icon as={UserIcon} />} as={Link} href='/profile'>View</MenuItem>
          <MenuItem icon={<Icon as={EditIcon} />} as={Link} href='/profile/edit'>Edit</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem icon={<Icon as={MessageCircleQuestionIcon} />} onClick={onOpen}>Have some feedback?</MenuItem>
        {/* <MenuItem as={Link} href='/terms'>Terms of Service</MenuItem>
      <MenuItem as={Link} href='/privacy'>Privacy Policy</MenuItem>
      <MenuDivider /> */}
        <MenuDivider />
        <MenuItem icon={<Icon as={LogOutIcon} />} onClick={() => void signOut({ callbackUrl: '/' })}>Sign out</MenuItem>
      </MenuList>
    </Menu>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody my={8}>
          <FeedbackForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
}