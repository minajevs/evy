import Head from "next/head"
import { Box } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"


type Props = {
  children: React.ReactNode
}

export const SharingLayout = ({ children }: Props) => {
  const bg = useBackgroundColor('page')

  return <>
    <Head>
      <title>{`⚡️ Evy`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box height="100vh" bg={bg} display='flex' flexDirection='column'>
      <Box height='100%' px={{ base: 4, md: 8, lg: 16, xl: 32 }} py={{ base: 4, md: 8 }} >
        {children}
      </Box>
    </Box>
  </>
}

export default SharingLayout