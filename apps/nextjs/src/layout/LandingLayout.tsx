import Head from "next/head"
import { Box } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"


type Props = {
  children: React.ReactNode
}

export const LandingLayout = ({ children }: Props) => {
  const bg = useBackgroundColor('page')

  return <>
    <Head>
      <title>{`Evy.app`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
    <Box minH="100dvh" bg={bg} display='flex' flexDirection='column'>
      {children}
    </Box>
  </>
}

export default LandingLayout