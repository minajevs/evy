import Head from "next/head"
import { Box, Button, Container, Drawer, Flex, HStack, Heading, Icon, IconButton, type LinkProps, Menu, MenuButton, Stack, Text, useColorMode, useColorModeValue, useDisclosure, useToken, Divider, VStack } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { Sidebar, type LinkItem } from "./navigation/Sidebar"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { BottomNavigation } from "./navigation/BottomNavigation"
import { MobileNav } from "./navigation/MobileNav"
import { Link } from "@chakra-ui/next-js"
import { FiChevronDown, FiColumns, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi"
import { signIn, signOut, useSession } from "next-auth/react"
import { useAutoAnimate } from '@formkit/auto-animate/react'


type Props = {
  children: React.ReactNode
}

const LandingLayout = ({ children }: Props) => {
  const bg = useBackgroundColor('page')
  // Translate pattern by 100 pixels, where 100 is height of box
  const pattern = useBackgroundPattern({ translateY: 100 })

  return <>
    <Head>
      <title>{`⚡️ Evy`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box minH="100vh" bg={bg}>
      <Box backgroundImage={pattern}>

        <Navbar />
      </Box>
      {children}
    </Box>
  </>
}

const Navbar = () => {
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
            bg={useColorModeValue('white', 'black')}>
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

export default LandingLayout