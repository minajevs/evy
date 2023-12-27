import Head from "next/head"
import { Box, Button, Container, Flex, HStack, Heading, Icon, useColorMode, useColorModeValue, useToken } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { Sidebar, type LinkItem } from "./navigation/Sidebar"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { BottomNavigation } from "./navigation/BottomNavigation"
import { MobileNav } from "./navigation/MobileNav"
import { Link } from "@chakra-ui/next-js"
import { FiMoon, FiSun } from "react-icons/fi"

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
        <Box maxW='1440' height={100} px={{ base: 4, md: 8 }} py={6} mx='auto' >
          <Navbar />
        </Box>
      </Box>
      {children}
    </Box>
  </>
}

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return <Box px={4}>
    <Flex h={12} alignItems="center" justifyContent="space-between" mx="auto">
      <Heading size="lg" justifyContent='flex-start'>
        <Link href="/">
          Evy ⚡️
        </Link>
      </Heading>
      <HStack
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
      <HStack>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <Icon as={FiMoon} /> : <Icon as={FiSun} />}
        </Button>
        <Button colorScheme="teal">
          Sign in
        </Button>
      </HStack>
    </Flex>
  </Box>
}

type NavLinkProps = {
  name: string
  href: string
}
const NavLink = ({ name, href }: NavLinkProps) => {
  return (
    <Link
      href={href}
      lineHeight="inherit"
      _hover={{
        textDecoration: 'none',
        color: useColorModeValue('teal.500', 'teal.200')
      }}
    >
      {name}
    </Link>
  );
}

export default LandingLayout