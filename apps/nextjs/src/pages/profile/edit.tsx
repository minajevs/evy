import { HStack, Heading, Button, Text, Box, useBoolean, ButtonGroup, FormControl, FormLabel, Input, FormErrorMessage, VStack, InputGroup, InputRightElement, Spinner, Icon } from "@chakra-ui/react"
import { editUserSchema } from "@evy/api/schemas"
import { getServerSession } from "@evy/auth";
import { prisma, type User } from "@evy/db";
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router";
import { Check, Save, X } from "lucide-react"
import { useZodForm } from "~/components/forms"
import { MyLayout } from "~/layout"
import { api } from "~/utils/api";
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps";
import { useVerifyValue } from "~/utils/useVerifyValue";

type Props = {
  user: User
} & LayoutServerSideProps


const EditProfile: NextPage<Props> = ({ user, layout }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const { debounceSettled, shouldVerify, verifyValue, onChange } = useVerifyValue(user.username)

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useZodForm({
    schema: editUserSchema, defaultValues: {
      username: user.username,
      name: user.name ?? undefined
    }
  })

  const updateMutation = api.user.update.useMutation()
  const verifyUsernameAvailableQuery = api.user.verifyUsernameAvailable.useQuery({ username: verifyValue! }, {
    enabled: shouldVerify && errors.username === undefined && verifyValue !== null,
    cacheTime: 0
  })

  const usernameAvailable = verifyUsernameAvailableQuery.data ?? false
  const errorAvailability = shouldVerify && !usernameAvailable && !verifyUsernameAvailableQuery.isLoading
  const saveDisabled = !isValid || shouldVerify && !usernameAvailable || !debounceSettled

  const onSubmit = handleSubmit(async (input) => {
    on()
    await updateMutation.mutateAsync(input)
    await router.replace(`/profile`)
  })

  return (
    <MyLayout layout={layout}>
      <form onSubmit={onSubmit}>
        <HStack width='100%' justifyContent='space-between'>
          <Heading size="lg" mb="4">
            <Text>Profile</Text>
          </Heading>
          <ButtonGroup isAttached>
            <Button leftIcon={<Icon as={Save} />} variant='solid' isLoading={loading} isDisabled={saveDisabled} type="submit">
              Save
            </Button>
            {
              !loading ?
                <Button variant='solid' onClick={() => router.back()}>
                  Cancel
                </Button>
                : null
            }
          </ButtonGroup>
        </HStack>
        <VStack spacing='4' alignItems='baseline'>
          {user.email
            ? <Box width='full'>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder='Email'
                isDisabled
                defaultValue={user.email}
              />
            </Box>
            : null
          }
          <Box width='full'>
            <FormControl isInvalid={errors.username !== undefined || errorAvailability} isRequired isDisabled={loading}>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <Input
                  {...register('username', {
                    onChange: onChange
                  })}
                  placeholder='Username'
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
          </Box>
          <Box width='full'>
            <FormControl isInvalid={errors.name !== undefined} isDisabled={loading}>
              <FormLabel>Name</FormLabel>
              <Input
                {...register('name')}
                placeholder='Name'
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </VStack>
      </form>
    </MyLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const user = await prisma.user.findFirst({
    where: {
      id: auth.user.id
    },
    include: {
      collections: true
    }
  })

  if (user === null) throw new Error('User is not found in DB')

  return {
    props: {
      user,
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default EditProfile