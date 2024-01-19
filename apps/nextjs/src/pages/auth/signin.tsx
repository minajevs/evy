import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "@evy/auth"
import { Stack, Flex, Heading, VStack, FormControl, Input, Button, Text, Divider, Icon, Alert, AlertIcon, FormErrorMessage, Box, AbsoluteCenter, useBoolean } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { ArrowLeft, Github, Inbox, Mail } from "lucide-react"
import z from 'zod'
import { usePlausible } from 'next-plausible'
import { useZodForm } from "~/components/forms"
import { useState } from "react"
import { useRouter } from "next/router"

const signinFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
})

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const pattern = useBackgroundPattern({ fade: true })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadingMagicLink, { on: onLink, off: offLink }] = useBoolean(false)
  const [loadingGitHub, { on: onGitHub, off: offGitHub }] = useBoolean(false)
  const [sent, { on: onSent, off: offSent }] = useBoolean(false)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useZodForm({
    schema: signinFormSchema
  })

  const plausible = usePlausible()


  const onSubmit = handleSubmit(async (data) => {
    plausible('login', {
      props: {
        type: 'email'
      }
    })
    setErrorMessage(null)
    onLink()

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: '/my',
    })

    offLink()

    if (!signInResult?.ok || signInResult.error) {
      console.error(signInResult?.error)
      return setErrorMessage('Something went wrong')
    }

    return onSent()
  })

  return <Flex
    minH="100vh"
    p={8}
    pt={32}
    justifyContent="center"
    bg={useBackgroundColor('page')}
    backgroundImage={pattern}
  >
    <Stack spacing={4}>
      <Stack align="center" opacity={sent ? 0 : 1}>
        <Heading fontSize="3xl">Welcome!</Heading>
        <Text fontSize="xl">Sign in to your account</Text>
      </Stack>
      <VStack
        as="form"
        boxSize={{ base: 'xs', sm: 'sm', md: 'md' }}
        h="max-content !important"
        bg={useBackgroundColor('navigation')}
        rounded="lg"
        boxShadow="lg"
        p={{ base: 5, sm: 10 }}
        onSubmit={onSubmit}
      >
        {
          sent
            ? <>
              <Heading fontSize='2xl'>We've sent you a magic link!</Heading>
              <Icon as={Inbox} boxSize='66' color='teal' />
              <Text textAlign='center'>
                Check your inbox for an email which contains a magic link that will log you in to your account.
              </Text>
              <Button mt={8} variant='ghost' leftIcon={<Icon as={ArrowLeft} />} onClick={offSent}> Back</Button>
            </>
            : <>
              <VStack spacing={4} w="100%">
                <FormControl id="email" isInvalid={errors.email !== undefined}>
                  <Input
                    {...register('email')}
                    rounded="md"
                    type="email"
                    placeholder="john.doe@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
                  isLoading={loadingMagicLink} isDisabled={loadingMagicLink || loadingGitHub}
                >
                  <Icon as={Mail} mr={4} /> Sign in with Email
                </Button>
              </VStack>
              <Box position='relative' width='100%' my={4}>
                <Divider />
                <AbsoluteCenter px='4' bg={useBackgroundColor('navigation')}>
                  or
                </AbsoluteCenter>
              </Box>
              <VStack w="100%">
                <Button isLoading={loadingGitHub} isDisabled={loadingGitHub || loadingMagicLink} w='100%' variant='outline' onClick={() => {
                  onGitHub()
                  return signIn('github')
                }}>
                  <Icon as={Github} mr={4} /> Sign in with GitHub
                </Button>
              </VStack>
            </>
        }
      </VStack>
      {/*
      <Link href='/auth/signup'>
        Don&apos;t have an account? <Text as='span' color="teal">Sign up</Text>
      </Link>
       */}
    </Stack>
  </Flex>
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context)

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/my" } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}