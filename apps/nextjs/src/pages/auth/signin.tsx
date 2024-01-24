import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "@evy/auth"
import { Stack, useBoolean } from "@chakra-ui/react"
import { usePlausible } from 'next-plausible'
import { useZodForm } from "~/components/forms"
import { useState } from "react"
import { MagicLinkConfirmation } from "~/components/sign-in/MagicLinkConfirmation"
import { AuthLayout } from "~/layout"
import { FormHeading } from "~/components/sign-in/FormHeading"
import { FormCard, signinFormSchema } from "~/components/sign-in/FormCard"
import { FormProvider } from "react-hook-form"
import { SignInForm } from "~/components/sign-in/SignInForm"
import { AgreeDisclosure } from "~/components/sign-in/AgreeDisclosure"
import { env } from "~/env.mjs"

export default function SignIn({
  providers,
  featureGoogleAuthEnabled
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, { on, off }] = useBoolean(false)
  const [sent, { on: onSent, off: offSent }] = useBoolean(false)
  const plausible = usePlausible()

  const form = useZodForm({
    schema: signinFormSchema
  })
  const { handleSubmit } = form

  const onSubmit = handleSubmit(async (data) => {
    plausible('login', {
      props: {
        type: 'email'
      }
    })
    setErrorMessage(null)
    on()

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: '/my',
    })

    off()

    if (!signInResult?.ok || signInResult.error) {
      console.error(signInResult?.error)
      return setErrorMessage('Something went wrong')
    }

    return onSent()
  })

  return <AuthLayout>
    <Stack spacing={4}>
      <FormHeading show={!sent} />
      <FormCard onSubmit={onSubmit}>
        <FormProvider {...form}>
          {
            sent
              ? <MagicLinkConfirmation onBack={offSent} />
              : <SignInForm
                loading={loading}
                errorMessage={errorMessage}
                featureGoogleAuthEnabled={featureGoogleAuthEnabled}
              />
          }
        </FormProvider>
      </FormCard>
      <AgreeDisclosure />
    </Stack>
  </AuthLayout>
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
    props: {
      providers: providers ?? [],
      featureGoogleAuthEnabled: env.FEATURE_GOOGLE_AUTH_ENABLED
    },
  }
}