import { Box, Button, Container, Divider, Flex, HStack, Heading, Icon, IconButton, Link, type LinkProps, Stack, Text, VStack, useColorMode, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { FiMoon, FiSun, FiX, FiMenu } from "react-icons/fi"
import { signIn } from "next-auth/react"

export const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [parent] = useAutoAnimate({ easing: 'ease-in-out' })

  return <Box ref={parent}>
    <Flex maxW='1440' height={100} px={{ base: 4, md: 8 }} py={6} mx="auto">
      <Box px={4} width='100%'>
        <Flex h={12} alignItems="center" justifyContent="space-between" mx="auto">
          {/* Heading */}
          <Heading size="lg" justifyContent='flex-start' w={150}>
            <Link href="/">
              Evy ⚡️
            </Link>
          </Heading>

          {/* Desktop menu  */}
          <HStack
            display={{ base: 'none', md: 'flex' }}
            alignItems="center"
            spacing={8}
            px={12}
            py={4}
            borderRadius={40}
            borderWidth={2}
            borderColor={useBackgroundColor('bold-border')}
            bg={useBackgroundColor('navigation')}>
            <NavLink name="Features" href="/" />
            <NavLink name="About" href="/" />
            <NavLink name="Pricing" href="/" />
          </HStack>

          {/* Buttons */}
          <HStack w={150} justifyContent='end'>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <Icon as={FiMoon} /> : <Icon as={FiSun} />}
            </Button>
            <Button
              display={{ base: 'none', md: 'inherit' }}
              colorScheme="teal"
              onClick={() => void signIn()}>
              Sign in
            </Button>
            <IconButton
              size="md"
              icon={isOpen ? <Icon as={FiX} /> : <Icon as={FiMenu} />}
              aria-label="Open Menu"
              display={{ base: 'inherit', md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
          </HStack>
        </Flex>
      </Box>
    </Flex>
    {/* Mobile Menu */}
    {isOpen ? (
      <Box
        p={4}
        display={{ base: 'inherit', md: 'none' }}
        bg={useBackgroundColor('page')}
        borderWidth={2}
        borderColor={useBackgroundColor('bold-border')}
        borderX={0}
      >
        <Stack
          as="nav"
          alignItems='center'
          spacing={8}
          fontSize='lg'
        >
          <NavLink name="Features" href="/" />
          <NavLink name="About" href="/" />
          <NavLink name="Pricing" href="/" />

          <Divider mt={16} />
          <VStack>
            <Heading fontSize='lg'>
              Existing user?
            </Heading>
            <Button
              colorScheme="teal"
              onClick={() => void signIn()}>
              Sign in
            </Button>
          </VStack>
        </Stack>
      </Box>
    ) : null}
  </Box>
}

type NavLinkProps = {
  name: string
  href: string
} & LinkProps
const NavLink = ({ name, href, ...rest }: NavLinkProps) => {
  return (
    <Link
      href={href}
      lineHeight="inherit"
      _hover={{
        textDecoration: 'none',
        color: useColorModeValue('teal.500', 'teal.200')
      }}
      {...rest}
    >
      {name}
    </Link>
  );
}