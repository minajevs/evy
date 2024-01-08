import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@evy/auth"
import { Stack, Flex, Heading, VStack, FormControl, FormLabel, Input, Checkbox, Button, Link, Text, Divider, Icon } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { Github } from "lucide-react"

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const pattern = useBackgroundPattern({ fade: true })

  return <Flex
    minH="100vh"
    p={8}
    pt={32}
    justifyContent="center"
    bg={useBackgroundColor('page')}
    backgroundImage={pattern}
  >
    <Stack spacing={4}>
      <Stack align="center">
        <Heading fontSize="3xl">Welcome!</Heading>
        <Text fontSize="xl">Sign in to your account</Text>
      </Stack>
      <VStack
        as="form"
        spacing={8}
        boxSize={{ base: 'xs', sm: 'sm', md: 'md' }}
        h="max-content !important"
        bg={useBackgroundColor('navigation')}
        rounded="lg"
        boxShadow="lg"
        p={{ base: 5, sm: 10 }}
      >
        <VStack spacing={4} w="100%">
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input rounded="md" type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input rounded="md" type="password" />
          </FormControl>
        </VStack>
        <VStack w="100%">
          <Stack direction="row" justifyContent="space-between" w="100%">
            <Checkbox colorScheme="teal" size="md">
              Remember me
            </Checkbox>
            <Link fontSize={{ base: 'md', sm: 'md' }}>Forgot password?</Link>
          </Stack>
          <Button
            colorScheme="teal"
            w="100%"
          >
            Sign in
          </Button>
        </VStack>
        <Divider />
        <VStack w="100%">
          {Object.values(providers).map((provider) => (
            <Button w='100%' variant='outline' key={provider.id} onClick={() => signIn(provider.id)}>
              <Icon as={Github} mr={4} /> Sign in with {provider.name}
            </Button>
          ))}
        </VStack>
      </VStack>
    </Stack>
  </Flex>
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}