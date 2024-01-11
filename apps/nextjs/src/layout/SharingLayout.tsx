import Head from "next/head"
import { Box, Center, Container, HStack, Heading, Icon, IconButton, useColorMode } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { EvyLogo } from "~/components/logo/EvyLogo"
import { Link } from "@chakra-ui/next-js"
import { Moon, Sun } from "lucide-react"


type Props = {
  children: React.ReactNode
  title?: string
}

export const SharingLayout = ({ title, children }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useBackgroundColor('page')

  return <>
    <Head>
      <title>{title !== undefined ? `${title} | Evy.app` : `Evy.app`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
    <Box minHeight="100vh" height={{ base: '100%', md: '100vh' }} bg={bg} display='flex' flexDirection='column'>
      <HStack width='100%' justifyContent='flex-end'>
        <IconButton
          m={4}
          aria-label="toggle color mode"
          icon={colorMode === 'light' ? <Icon as={Moon} /> : <Icon as={Sun} />}
          variant='outline'
          onClick={toggleColorMode}
        />
      </HStack>
      <Box flex={1} px={{ base: 4, md: 8, lg: 16, xl: 32 }} >
        <Container maxW='container.xl' p={0} height='100%'>
          {children}
        </Container>
      </Box>
      <Center m={8}>
        <Heading size='lg'>
          <Link href='/' _hover={{
            textDecoration: 'none'
          }}>
            <EvyLogo />
          </Link>
        </Heading>
      </Center>
    </Box>
  </>
}

export default SharingLayout