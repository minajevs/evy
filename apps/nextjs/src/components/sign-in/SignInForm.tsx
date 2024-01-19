import { AbsoluteCenter, Alert, AlertIcon, Box, Button, Divider, FormControl, FormErrorMessage, Icon, Input, VStack, useBoolean } from "@chakra-ui/react"
import { useZodFormContext } from "../forms"
import { type signinFormSchema } from "./FormCard"
import { Mail } from "lucide-react"
import { useBackgroundColor } from "@evy/styling"
import { GithubProviderButton } from "./provider-buttons/GithubProviderButton"
import { GoogleProviderButton } from "./provider-buttons/GoogleProviderButton"

type Props = {
  errorMessage: string | null
  loading: boolean
}
export const SignInForm = ({ errorMessage, loading }: Props) => {
  const {
    register,
    formState: { errors },
    reset
  } = useZodFormContext<typeof signinFormSchema>()
  const [loadingGitHub, { on: onGithub }] = useBoolean(false)
  const [loadingGoogle, { on: onGoogle }] = useBoolean(false)
  return <>
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
        isLoading={loading}
        isDisabled={loading || loadingGitHub}
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
      <GithubProviderButton disabled={loading || loadingGitHub || loadingGoogle} onClick={onGithub} />
      <GoogleProviderButton disabled={loading || loadingGitHub || loadingGoogle} onClick={onGoogle} />
    </VStack>
  </>
}