import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "@evy/auth"
import { Stack, Flex, Heading, VStack, FormControl, FormLabel, Input, Button, Text, Divider, Icon, Alert, AlertIcon, FormErrorMessage, FormHelperText, Box, AbsoluteCenter, InputGroup, InputRightElement, Spinner } from "@chakra-ui/react"
import { useBackgroundColor, useBackgroundPattern } from "@evy/styling"
import { Check, Github, X } from "lucide-react"
import type z from 'zod'
import { useZodForm } from "~/components/forms"
import { useState } from "react"
import { signUpSchema } from "@evy/auth/src/signUpSchema"
import { type ValidationResult } from "@evy/auth/src/validatePassword"
import { Link } from "@chakra-ui/next-js"
import { useVerifyValue } from "~/utils/useVerifyValue"
import { api } from "~/utils/api"
import { usePlausible } from "next-plausible"

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const pattern = useBackgroundPattern({ fade: true })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { debounceSettled, shouldVerify, verifyValue, onChange } = useVerifyValue(null)
  const plausible = usePlausible()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isValid, touchedFields },
  } = useZodForm({
    schema: signUpSchema
  })

  const verifyUsernameAvailableQuery = api.user.verifyUsernameAvailable.useQuery({ username: verifyValue! }, {
    enabled: shouldVerify && errors.username === undefined && verifyValue !== null,
    cacheTime: 0
  })

  const usernameAvailable = verifyUsernameAvailableQuery.data ?? false
  const errorAvailability = shouldVerify && !usernameAvailable && !verifyUsernameAvailableQuery.isLoading
  const saveDisabled = !isValid || shouldVerify && !usernameAvailable || !debounceSettled

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setErrorMessage(null)
    plausible('signup', {
      props: {
        email: values.email
      }
    })
    const result = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        ...values
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!result.ok) {
      const error = await result.json()
      setErrorMessage(error.message)
      return
    }

    await signIn<"credentials">("credentials", {
      ...values,
      callbackUrl: '/my'
    })
  }

  const passwordErrors = errors.password as unknown as ValidationResult | undefined

  const passwordHints = passwordErrors === undefined
    ? null
    : <>
      {(passwordErrors['lowercase'] || passwordErrors['uppercase']) && <Text>Contain uppercase and lowercase letters</Text>}
      {passwordErrors['min'] && <Text>Minimum 8 characters long</Text>}
      {passwordErrors['number'] && <Text>Contain at least 1 number</Text>}
    </>

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
        <Heading fontSize="3xl">Create an account</Heading>
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
          <FormControl id="username" isInvalid={errors.username !== undefined || errorAvailability}>
            <FormLabel>Username</FormLabel>
            <InputGroup>
              <Input
                {...register('username', {
                  onChange: onChange
                })}
                placeholder='john.doe'
              />
              <InputRightElement>
                {
                  !(shouldVerify && errors.username === undefined)
                    ? null
                    : verifyUsernameAvailableQuery.isLoading
                      ? <Spinner />
                      : usernameAvailable
                        ? <Icon as={Check} color='green.500' />
                        : <Icon as={X} color='red.500' />
                }
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{
              errors.username?.message !== undefined
                ? errors.username?.message
                : 'This username is unavailable'}</FormErrorMessage>
          </FormControl>
          <FormControl id="email" isInvalid={errors.email !== undefined}>
            <FormLabel>Email</FormLabel>
            <Input {...register('email')} rounded="md" type="email" placeholder="john.doe@example.com" />
            <FormErrorMessage>
              {errors.email?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl id="password" isInvalid={errors.password !== undefined}>
            <FormLabel>Password</FormLabel>
            <Input
              {...register('password')}
              placeholder="•••••••••••••"
              rounded="md"
              type="password"
            />
            <FormHelperText>
              {passwordHints}
            </FormHelperText>
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
            Create account
          </Button>
        </VStack>
        <Box position='relative' width='100%'>
          <Divider />
          <AbsoluteCenter px='4' bg={useBackgroundColor('navigation')}>
            or
          </AbsoluteCenter>
        </Box>
        <VStack w="100%">
          <Button w='100%' variant='outline' onClick={() => signIn('github')}>
            <Icon as={Github} mr={4} /> Sign in with GitHub
          </Button>
        </VStack>
      </VStack>
      <Link href='/auth/signin'>
        Already have an account? <Text as='span' color="teal">Sign in</Text>
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