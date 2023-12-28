
import { Image } from "@chakra-ui/next-js";
import { Box, Button, Container, Heading, Skeleton, Stack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { getServerSession } from "@evy/auth";
import { useBackgroundPattern } from "@evy/styling";
import type { GetServerSidePropsContext, NextPage } from "next"
import NextImage from 'next/image'
import Layout from "~/layout"
import LandingLayout from "~/layout/LandingLayout"
import { signIn, signOut, useSession } from "next-auth/react"

const Home: NextPage = () => {
  const pattern = useBackgroundPattern({ fade: true })

  return (
    <LandingLayout>
      <VStack
        justifyContent='center'
        alignItems='center'
        backgroundImage={pattern}
      >
        <Heading fontSize='5xl' mt={12} mb={8} textAlign='center'>
          Keep track of your collections
        </Heading>
        <Container textAlign='center'>
          <Text fontSize='xl'>
            Evy is an app to manage, overview, track, share and discover precious hobbies
          </Text>
        </Container>
      </VStack>
      <VStack
        justifyContent='center'
        alignItems='center'
        mt={8}
      >
        <Button size='lg' colorScheme="teal" onClick={() => void signIn()}>
          Get started
        </Button>
        <Text>
          This is a landing page v0.1,
          don't judge, ok?
        </Text>
      </VStack>
    </LandingLayout>
  )
}


export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const auth = await getServerSession({ req, res })

  if (!auth) {
    return { props: {} }
  }

  return { redirect: { permanent: false, destination: "/my" } }
}

export default Home