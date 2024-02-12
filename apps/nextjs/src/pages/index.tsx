
import { Box, Heading, Text } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import type { GetServerSideProps, NextPage } from "next"
import { LandingLayout } from "~/layout"
import { Hero } from "~/components/landing/hero";
import { useBackgroundPattern, useTransparentColor } from "@evy/styling";
import { Navbar } from "~/components/landing/navbar";
import { Footer } from "~/components/landing/footer";
import { ImageSection } from "~/components/landing/imageSection";
import { Features } from "~/components/landing/features";
import { ScrollText } from "~/components/landing/ScrollText";
import { PlannedFeatures } from "~/components/landing/plannedFeatures";
import { FinalCta } from "~/components/landing/finalCta";

type Props = {
  signedIn: boolean
}
const Home: NextPage<Props> = ({ signedIn }) => {
  const pattern = useBackgroundPattern({ fade: true })

  const redBlob = useTransparentColor('primary.400', 0.1)
  const blueBlob = useTransparentColor('secondary.400', 0.1)


  return (
    <LandingLayout>
      <Box backgroundImage={pattern} flex={1}>
        <Navbar signedIn={signedIn} />

        <Hero />
        <ImageSection my={{ base: 8, md: 16 }} />
      </Box>
      <Box>
        <Heading px={1} textAlign='center' fontFamily='onest' id="features">All your things in one place</Heading>
        <ScrollText textAlign='center' mt={4} mb={2} fontSize='xl' fontWeight={600} fontFamily='onest' textShadow='0px 0px 25px var(--chakra-colors-secondary-300)'>
          <>books</>
          <>headphones</>
          <>coins</>
          <>baseball cards</>
          <>hockey pucks</>
          <>fancy sneakers</>
          <>beanie babies</>
          <>mechanical keyboards</>
          <>jerseys</>
          <>fountain pens</>
          <>vinyl</>
        </ScrollText>
        <Text px={1} textAlign='center' fontSize='lg'>
          Whatever your collection is,
          we have got you covered.
          <br />
          Evy is packed with features for any type of collection
        </Text>

        <Features my={8} />

        {/* <Heading mt={{ base: 8, md: 16 }} textAlign='center' fontFamily='onest'>Digital space for your collections</Heading>
        <Text textAlign='center'>share your cool stuff with the world </Text> */}

        <Box
          backgroundImage={{
            base: 'none',
            sm: `radial-gradient(at 45% 30%, ${redBlob} 0, transparent 35%), radial-gradient(at 82% 65%, ${blueBlob} 0, transparent 30%);`
          }}
          py={10}
          my={-10}
        >
          <Box
            backgroundImage={{
              base: `radial-gradient(at 45% 30%, ${redBlob} 0, transparent 70%);`,
              sm: 'none'
            }}
            py={10}
            my={-10}
          >
            <Heading mt={{ base: 8, md: 16 }} textAlign='center' fontFamily='onest'>What&apos;s coming?</Heading>
            <Text mt={2} px={1} textAlign='center' fontSize='lg'>
              We are always adding cool new items to our feature collection.
              <br />
              Here&apos;s what we&apos;ve got planned.
            </Text>
          </Box>
          <PlannedFeatures mt={20} />
        </Box>

        <FinalCta py={{ base: 8, md: 16 }} />
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