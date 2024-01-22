import { Button, Container, Heading, Highlight, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { useBackgroundPattern, useTransparentColor } from "@evy/styling"
import { signIn } from "next-auth/react"

export const Hero = () => {
  const patternColor = useColorModeValue('primary.300', 'primary.100')
  const pattern = useBackgroundPattern({ fade: true, fill: patternColor })

  const gradFrom = useTransparentColor(useColorModeValue('primary.200', 'primary.100'), 0.4)
  const gradTo = useTransparentColor(useColorModeValue('primary.600', 'primary.300'), 0.4)

  const bgGradient = useColorModeValue(
    `linear(to-br, ${gradFrom}, ${gradTo})`,
    `linear(to-br, ${gradFrom}, ${gradTo})`
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
        colorScheme="primary"
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