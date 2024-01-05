import { Button, Container, Heading, Highlight, Text, VStack } from "@chakra-ui/react"
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
      <Highlight
        query='everyone'
        // teal.100 - rgb(178, 245, 234)
        // cyan.200 - rgb(157, 236, 249)
        styles={{ px: 2, pt: 0, pb: 1, rounded: 'full', bgGradient: 'linear(to-br, rgb(178, 245, 234, 0.6), rgb(157, 236, 249, 0.6))' }}
      >
        Collection management for everyone
      </Highlight>
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