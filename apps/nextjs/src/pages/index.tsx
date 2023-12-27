
import { Image } from "@chakra-ui/next-js";
import { Box, Container, Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { getServerSession } from "@evy/auth";
import { useBackgroundPattern } from "@evy/styling";
import type { GetServerSidePropsContext, NextPage } from "next"
import NextImage from 'next/image'
import Layout from "~/layout"
import LandingLayout from "~/layout/LandingLayout"

const Home: NextPage = () => {
  const pattern = useBackgroundPattern({ fade: true })

  return (
    <LandingLayout>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent='center'
        backgroundImage={pattern}
      >
        <Text>
          This is a landing page v0.1,
          don't judge, ok?
        </Text>
        <Box
          pos="relative"
          minW='30rem'
          minH='15rem'
        >
          Hello WOrld!
        </Box>
      </Stack>
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