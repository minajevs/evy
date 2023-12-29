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
import { Navbar } from "~/components/landing/navbar"
import { Footer } from "~/components/landing/footer"


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
    <Box minH="100vh" bg={bg} display='flex' flexDirection='column'>
      <Box backgroundImage={pattern}>
        <Navbar />
      </Box>
      <Box flex={1}>
        {children}
      </Box>
      <Footer />
    </Box>
  </>
}

export default LandingLayout