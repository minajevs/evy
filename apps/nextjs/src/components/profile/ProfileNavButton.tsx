import { Link } from "@chakra-ui/next-js"
import { Icon, IconButton, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, type MenuProps } from "@chakra-ui/react"
import { CircleUserRoundIcon, EditIcon, LogOutIcon, UserIcon } from "lucide-react"
import { signOut } from 'next-auth/react'

type Props = {
} & Omit<MenuProps, 'children'>
export const ProfileNavButton = ({ }: Props) => {
  return <Menu>
    <MenuButton as={IconButton} isRound variant='ghost' icon={<Icon as={CircleUserRoundIcon} />}>
      Profile
    </MenuButton>
    <MenuList>
      <MenuGroup title='Profile'>
        <MenuItem icon={<Icon as={UserIcon} />} as={Link} href='/profile'>View</MenuItem>
        <MenuItem icon={<Icon as={EditIcon} />} as={Link} href='/profile/edit'>Edit</MenuItem>
      </MenuGroup>
      <MenuDivider />
      {/* <MenuItem as={Link} href='/terms'>Terms of Service</MenuItem>
      <MenuItem as={Link} href='/privacy'>Privacy Policy</MenuItem>
      <MenuDivider /> */}
      <MenuItem icon={<Icon as={LogOutIcon} />} onClick={() => void signOut({ callbackUrl: '/' })}>Sign out</MenuItem>
    </MenuList>
  </Menu>
}