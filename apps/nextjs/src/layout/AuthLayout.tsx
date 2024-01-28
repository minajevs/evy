import { Flex } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import Head from "next/head"

type Props = {
  children: React.ReactNode
}
export const AuthLayout = ({ children }: Props) => {
  const bg = useBackgroundColor('page')
  const pattern = useBackgroundPattern({ fade: true })

  return <>
    <Head>
      <title>{`Evy.app | Sign In`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
    <Flex
      minH="100dvh"
      p={8}
      pt={32}
      justifyContent="center"
      bg={useBackgroundColor('page')}
      backgroundImage={pattern}>
      {children}
    </Flex>
  </>
}