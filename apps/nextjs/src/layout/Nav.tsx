import { Box, Button, Flex, Stack, useColorMode } from "@chakra-ui/react"
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import Link from "next/link"
import { useBackgroundColor } from "@evy/styling"
import { useSession, signIn, signOut } from 'next-auth/react'

export const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useBackgroundColor('navigation')
  const session = useSession()
  return <>
    <Box
      px={4}
      bg={bg}
      borderBottom='1px'
      borderBottomColor={useBackgroundColor('bold-border')}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link href="/">
            📚 Evy
          </Link>
        </Box>
        <Box></Box>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button variant='ghost' onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Button variant='ghost' onClick={session ? () => void signOut() : () => void signIn()}>
              {session ? "Sign out" : "Sign in"}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  </>
}