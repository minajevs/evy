import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, Heading, Button, Text, Avatar, WrapItem, Box, Divider, SimpleGrid, Card, CardHeader, CardBody, useBoolean, Flex, ButtonGroup, FormControl, FormLabel, Input, FormErrorMessage, VStack, FormHelperText, InputGroup, InputRightElement, Spinner } from "@chakra-ui/react";
import { editUserSchema } from "@evy/api/schemas";
import { getServerSession } from "@evy/auth";
import { slugify } from "@evy/auth/src/slugify";
import { type Collection, prisma, type User, type Item } from "@evy/db";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "~/components/forms";
import Layout from "~/layout"
import { api } from "~/utils/api";
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps";
import { useDebounce } from "~/utils/useDebounce";

type Props = {
  user: User
} & LayoutServerSideProps


const EditProfile: NextPage<Props> = ({ user, layout }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const [currentUsername, setCurrentUsername] = useState(user.username)
  const debouncedUsername = useDebounce(currentUsername, 500)

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
    setValue,
    watch
  } = useForm({
    schema: editUserSchema, defaultValues: {
      username: user.username,
      name: user.name ?? undefined
    }
  })

  const usernameChanged = currentUsername !== user.username

  const updateMutation = api.user.update.useMutation()
  const verifyUsernameAvailableQuery = api.user.verifyUsernameAvailable.useQuery({ username: debouncedUsername }, {
    enabled: debouncedUsername !== user.username && usernameChanged && errors.username === undefined,
    cacheTime: 0
  })

  const onSubmit = handleSubmit(async (input) => {
    on()
    await updateMutation.mutateAsync(input)
    await router.replace(`/profile`)
  })

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setCurrentUsername(event.target.value)

  const usernameVerifying = usernameChanged && verifyUsernameAvailableQuery.isLoading
  const usernameAvailable = usernameVerifying ? true : verifyUsernameAvailableQuery.data ?? true

  const saveDisabled = !isValid || debouncedUsername !== currentUsername || !usernameAvailable

  return (
    <Layout layout={layout}>
      <form onSubmit={onSubmit}>
        <HStack width='100%' justifyContent='space-between'>
          <Heading size="lg" mb="4">
            <Text>Profile</Text>
          </Heading>
          <ButtonGroup isAttached>
            <Button leftIcon={<CheckIcon />} variant='solid' isLoading={loading} isDisabled={saveDisabled} type="submit">
              Save
            </Button>
            {
              !loading ?
                <Button variant='solid' as={Link} href={`/profile`}>
                  Cancel
                </Button>
                : null
            }
          </ButtonGroup>
        </HStack>
        <VStack spacing='4' alignItems='baseline'>
          {user.email
            ? <Box minWidth='33vw'>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder='Email'
                isDisabled
                defaultValue={user.email}
              />
            </Box>
            : null
          }
          <Box minWidth='33vw'>
            <FormControl isInvalid={errors.username !== undefined || !usernameAvailable} isRequired isDisabled={loading}>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <Input
                  {...register('username', {
                    onChange: onUsernameChange
                  })}
                  placeholder='Username'
                />
                <InputRightElement>
                  {
                    debouncedUsername !== currentUsername || !usernameChanged || errors.username !== undefined
                      ? null
                      : verifyUsernameAvailableQuery.isLoading
                        ? <Spinner />
                        : usernameAvailable
                          ? <CheckIcon color='green.500' />
                          : <CloseIcon color='red.500' />
                  }
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{
                errors.username?.message !== undefined
                  ? errors.username?.message
                  : 'This username is unavailable'}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box minWidth='33vw'>
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
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
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
      layout: {
        collections: user.collections
      }
    }
  }
}

export default EditProfile