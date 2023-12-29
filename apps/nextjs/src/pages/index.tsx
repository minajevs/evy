
import { Text } from "@chakra-ui/react";
import { getServerSession } from "@evy/auth";
import type { GetServerSidePropsContext, NextPage } from "next"
import LandingLayout from "~/layout/LandingLayout"
import { Hero } from "~/components/landing/hero";

const Home: NextPage = () => {
  return (
    <LandingLayout>
      <Hero />
      <Text width='100%' textAlign='center' my={4}>
        This is a landing page v0.2,
        don't judge, ok?
      </Text>
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