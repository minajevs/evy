import { Button, Container, Heading, Highlight, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { useBackgroundPattern, useTransparentColor } from "@evy/styling"
import { signIn } from "next-auth/react"
import { Reveal } from "./Reveal"

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
    <Reveal>
      <Heading fontSize='5xl' mt={{ base: 16, md: 32 }} mb={4} textAlign='center' fontFamily='onest'>
        <Highlight
          query='organized'
          styles={{
            px: 3,
            rounded: 'full',
            bgGradient: bgGradient,
            color: useColorModeValue('rgb(26, 32, 44)', 'rgba(255, 255, 255, 0.92)')
          }}
        >
          Keep your things organized
        </Highlight>
      </Heading>
    </Reveal>
    <Container textAlign='center'>
      <Reveal>
        <Text fontSize='xl'>
          Evy is an app to manage your collections. Keep track of your stuff and share it with the world.
        </Text>
      </Reveal>
    </Container>
    <VStack
      justifyContent='center'
      alignItems='center'
      mt={{ base: 8, md: 16 }}
    >
      <Reveal>
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
      </Reveal>
      <Text>
        yes, it's free
      </Text>
    </VStack>
  </VStack>
}