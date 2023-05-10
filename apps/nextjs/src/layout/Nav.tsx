import { Box, Button, Flex, Stack, useColorMode } from "@chakra-ui/react"
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import Link from "next/link"
import { useBackgroundColor } from "@evy/styling"
import { UserButton } from "@clerk/nextjs"

export const Nav = () => {
  const background = useBackgroundColor()
  const { colorMode, toggleColorMode } = useColorMode()
  return <>
    <Box bg={background} px={4}>
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
            <UserButton />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  </>
}