import { Button, Icon, type StackProps, Text, VStack } from "@chakra-ui/react"
import { Evy } from "../common/icons/Evy"
import { signIn } from "next-auth/react"
import { useBackgroundPattern } from "@evy/styling"

type Props = StackProps
export const FinalCta = ({ ...rest }: Props) => {
  const pattern = useBackgroundPattern({ fadeBoth: true })

  return <VStack
    backgroundImage={pattern}
    justifyContent='center'
    alignItems='center'
    {...rest}
  >
    <Icon as={Evy} mx={1} color='primary.500' boxSize={16} />
    <Text fontSize='lg'>Keep track of your stuff and share it with the world.</Text>
    <Button
      mt={12}
      size='lg'
      colorScheme="primary"
      onClick={() => void signIn()}
      boxShadow='lg'
      _hover={{
        boxShadow: 'xl',
        transform: 'translateY(-2px)',
        transitionDuration: '0.2s',
        transitionTimingFunction: "ease-in-out",
      }}
      _active={{
        transform: 'translateY(2px)',
        transitionDuration: '0.2s',
      }}
    >
      Get started
    </Button>
    <Text fontSize='sm'>
      yes, it's free
    </Text>
  </VStack>
}