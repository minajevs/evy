
import { Box, Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import type { GetServerSideProps, NextPage } from "next"
import { LandingLayout } from "~/layout"
import { Hero } from "~/components/landing/hero";
import { useBackgroundPattern } from "@evy/styling";
import { Navbar } from "~/components/landing/navbar";
import { Footer } from "~/components/landing/footer";
import { ImageSection } from "~/components/landing/imageSection";

type Props = {
  signedIn: boolean
}
const Home: NextPage<Props> = ({ signedIn }) => {
  const pattern = useBackgroundPattern({ fade: true })

  return (
    <LandingLayout>
      <Box backgroundImage={pattern} flex={1}>
        <Navbar signedIn={signedIn} />

        <Hero />

        <ImageSection my={{ base: 8, md: 16 }} />

        <Heading mt={{ base: 8, md: 16 }} textAlign='center' fontFamily='onest'>Digital space for your collections</Heading>

        <Text width='100%' textAlign='center' my={4}>
          This is a landing page v0.2,
          don&apos;t judge, ok?
        </Text>
      </Box>
      <Footer />
    </LandingLayout>
  )
}


export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const auth = await getServerSession({ req, res })

  // if (!auth) {
  return {
    props: {
      signedIn: auth !== null
    }
  }
  // }

  // return { redirect: { permanent: false, destination: "/my" } }
}

export default Home