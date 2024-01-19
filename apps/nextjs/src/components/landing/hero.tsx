import { Button, Container, Heading, Highlight, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { useBackgroundPattern } from "@evy/styling"
import { signIn } from "next-auth/react"

export const Hero = () => {
  const pattern = useBackgroundPattern({ fade: true })

  // teal.100 - rgb(178, 245, 234)
  // cyan.200 - rgb(157, 236, 249)
  // teal darkmode = rgb(129, 230, 217)
  // cyan darkmode = rgb(129, 230, 217)
  const bgGradient = useColorModeValue(
    'linear(to-br, rgba(178, 245, 234, 0.6), rgba(157, 236, 249, 0.6))',
    'linear(to-br, rgba(129, 230, 217, 0.3), rgba(157, 236, 249, 0.3))'
  )

  return <VStack
    justifyContent='center'
    alignItems='center'
  //backgroundImage={pattern}
  >
    <Heading fontSize='5xl' mt={12} mb={8} textAlign='center'>
      <Highlight
        query='everyone'
        styles={{
          px: 2,
          pt: 0,
          pb: 1,
          rounded: 'full',
          bgGradient: bgGradient,
          transform: 'skew(20deg)',
          transformOrigin: 'top left',
          color: useColorModeValue('rgb(26, 32, 44)', 'rgba(255, 255, 255, 0.92)')
        }}
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
      <Button
        size='lg'
        colorScheme="teal"
        onClick={() => void signIn()}
        boxShadow='lg'
        _hover={{
          boxShadow: 'xl',
          transform: 'translateY(-2px)',
          transitionDuration: '0.2s',
          transitionTimingFunction: "ease-in-out"
        }}
        _active={{
          transform: 'translateY(2px)',
          transitionDuration: '0.2s',
        }}
      >
        Get started
      </Button>
    </VStack>
  </VStack>
}