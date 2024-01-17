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
import { ErrorCodes } from "@evy/auth/src/errorCodes"
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

  const onSubmit = async (values: z.infer<typeof signinFormSchema>) => {
    setErrorMessage(null)
    plausible('signin', {
      props: {
        email: values.email
      }
    })
    const res = await signIn<"credentials">("credentials", {
      ...values,
      redirect: false,
    })

    if (!res) {
      setErrorMessage("Something went wrong")
      return
    }

    if (res.error === ErrorCodes.CredentialsMissing) {
      setErrorMessage("Something went wrong")
      return
    }
    if (res.error === ErrorCodes.IncorrectEmailPassword) {
      setErrorMessage("Email or password is incorrect")
      return
    }

    if (res.error !== null || !res.ok) {
      setErrorMessage("Something went wrong")
      return
    }

    await router.push('/my')
  };

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
        onSubmit={handleSubmit(onSubmit)}
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