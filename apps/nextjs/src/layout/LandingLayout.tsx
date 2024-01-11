import Head from "next/head"
import { Box } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { Navbar } from "~/components/landing/navbar"
import { Footer } from "~/components/landing/footer"


type Props = {
  children: React.ReactNode
}

export const LandingLayout = ({ children }: Props) => {
  const bg = useBackgroundColor('page')
  // Translate pattern by 100 pixels, where 100 is height of box
  const pattern = useBackgroundPattern({ translateY: 100 })

  return <>
    <Head>
      <title>{`⚡️ Evy`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.svg" />
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