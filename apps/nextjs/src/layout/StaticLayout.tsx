import Head from "next/head"
import { Box, Container } from "@chakra-ui/react"
import { useSession } from 'next-auth/react'
import { useBackgroundColor } from "@evy/styling"
import { Navbar } from "~/components/landing/navbar"
import { Footer } from "~/components/landing/footer"
import { Prose } from "@nikolovlazar/chakra-ui-prose"


type Props = {
  title: string
  children: React.ReactNode
}

export const StaticLayout = ({ title, children }: Props) => {
  const bg = useBackgroundColor('page')
  const session = useSession()

  return <>
    <Head>
      <title>{`Evy.app | ${title}`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
    <Box minH="100dvh" bg={bg} display='flex' flexDirection='column'>
      <Navbar signedIn={session.status === 'authenticated'} />
      <Container maxW='4xl' mt={16} mb={8}>
        <Prose>
          {children}
        </Prose>
      </Container>
      <Footer />
    </Box>
  </>
}

export default StaticLayout