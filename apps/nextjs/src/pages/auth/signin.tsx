import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "@evy/auth"
import { Stack, Flex, Heading, VStack, FormControl, FormLabel, Input, Button, Text, Divider, Icon, Alert, AlertIcon, FormErrorMessage } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { Github } from "lucide-react"
import z from 'zod'
import { usePlausible } from 'next-plausible'
import { useZodForm } from "~/components/forms"
import { useState } from "react"
import { Link } from "@chakra-ui/next-js"
import { useRouter } from "next/router"

const signinFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(1, "Password is required")
})

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const pattern = useBackgroundPattern({ fade: true })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useZodForm({
    schema: signinFormSchema
  })

  const plausible = usePlausible()


  // async function onSubmit(data: FormData) {
  //   const signInResult = await signIn("email", {
  //     email: data.email.toLowerCase(),
  //     redirect: false,
  //     callbackUrl: searchParams?.get("from") || "/dashboard",
  //   })

  //   if (!signInResult?.ok) {
  //     return toast({
  //       title: "Something went wrong.",
  //       description: "Your sign in request failed. Please try again.",
  //       variant: "destructive",
  //     })
  //   }

  //   return toast({
  //     title: "Check your email",
  //     description: "We sent you a login link. Be sure to check your spam too.",
  //   })
  // }

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
        onSubmit={handleSubmit(console.log)}
      >
        <VStack spacing={4} w="100%">
          <FormControl id="email" isInvalid={errors.email !== undefined}>
            <FormLabel>Email</FormLabel>
            <Input {...register('email')} rounded="md" type="email" placeholder="john.doe@example.com" />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isInvalid={errors.password !== undefined}>
            <FormLabel>Password</FormLabel>
            <Input {...register('password')} rounded="md" type="password" placeholder="•••••••••••••" />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            <Link href='/' fontSize={{ base: 'md', sm: 'md' }}>Forgot password?</Link>
          </FormControl>
        </VStack>
        <VStack w="100%">
          {
            errorMessage !== null
              ? <Alert status="error">
                <AlertIcon />
                {errorMessage}
              </Alert>
              : null
          }
          <Button
            colorScheme="teal"
            w="100%"
            type='submit'
          >
            Sign in
          </Button>
        </VStack>
        <Divider />
        <VStack w="100%">
          <Button w='100%' variant='outline' onClick={() => signIn('github')}>
            <Icon as={Github} mr={4} /> Sign in with GitHub
          </Button>
        </VStack>
      </VStack>
      <Link href='/auth/signup'>
        Don&apos;t have an account? <Text as='span' color="teal">Sign up</Text>
      </Link>
    </Stack>
  </Flex>
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context)

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