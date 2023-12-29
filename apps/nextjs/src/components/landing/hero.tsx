import { Button, Container, Heading, Text, VStack } from "@chakra-ui/react"
import { useBackgroundPattern } from "@evy/styling"
import { signIn } from "next-auth/react"

export const Hero = () => {
  const pattern = useBackgroundPattern({ fade: true })

  return <VStack
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
    <VStack
      justifyContent='center'
      alignItems='center'
      mt={8}
    >
      <Button size='lg' colorScheme="teal" onClick={() => void signIn()}>
        Get started
      </Button>
    </VStack>
  </VStack>
}