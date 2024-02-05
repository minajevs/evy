
import { Box, Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import type { GetServerSideProps, NextPage } from "next"
import { LandingLayout } from "~/layout"
import { Hero } from "~/components/landing/hero";
import { useBackgroundPattern } from "@evy/styling";
import { Navbar } from "~/components/landing/navbar";
import { Footer } from "~/components/landing/footer";
import { ImageSection } from "~/components/landing/imageSection";
import { Features } from "~/components/landing/features";
import { ScrollText } from "~/components/landing/ScrollText";

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
      </Box>
      <Box>
        <Heading px={1} textAlign='center' fontFamily='onest'>All your things in one place</Heading>
        <ScrollText textAlign='center' mt={4} mb={2} fontSize='xl' fontWeight={600} fontFamily='onest' textShadow='0px 0px 25px var(--chakra-colors-secondary-300)'>
          <>books</>
          <>headphones</>
          <>coins</>
          <>baseball cards</>
          <>fancy sneakers</>
          <>beanie babies</>
          <>mechanical keyboards</>
          <>jerseys</>
        </ScrollText>
        <Text px={1} textAlign='center' fontSize='lg'>
          Whatever your collection is,
          we have got you covered.
          <br />
          Evy is packed with features for any type of collection
        </Text>

        <Features my={8} />

        <Heading mt={{ base: 8, md: 16 }} textAlign='center' fontFamily='onest'>Digital space for your collections</Heading>
        <Text textAlign='center'>share your cool stuff with the world </Text>

        <Text width='100%' textAlign='center' my={4}>
          This is a landing page v0.4,
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