import { Button, ButtonGroup, FormControl, HStack, Heading, Input, Text, useBoolean, FormErrorMessage, FormLabel, Textarea, VStack, Box, InputGroup, InputLeftAddon, useColorModeValue, InputRightElement, Spinner } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import Layout from "~/layout"
import { api } from "~/utils/api"
import { Link } from "@chakra-ui/next-js"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { editCollectionSchema } from "@evy/api/schemas"
import { useZodForm } from "~/components/forms"
import { useRouter } from "next/router"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { env } from "~/env.mjs"
import { useVerifyValue } from "~/utils/useVerifyValue"

type Props = {
  collection: Collection & { items: Item[] } & { user: User }
} & LayoutServerSideProps

const CollectionEditPage: NextPage<Props> = ({ layout, collection }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const { debounceSettled, shouldVerify, verifyValue, onChange } = useVerifyValue(collection.slug)

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
    watch
  } = useZodForm({ schema: editCollectionSchema, defaultValues: { id: collection.id, name: collection.name, slug: collection.slug, description: collection.description ?? undefined } })

  const updateMutation = api.collection.update.useMutation()
  const verifySlugAvailableQuery = api.collection.verifyCollectionSlug.useQuery({ slug: verifyValue }, {
    enabled: shouldVerify && errors.slug === undefined,
    cacheTime: 0
  })

  const slugAvailable = verifySlugAvailableQuery.data ?? false
  const errorAvailability = shouldVerify && !slugAvailable
  const saveDisabled = !isValid || errorAvailability || !debounceSettled

  const onSubmit = handleSubmit(async (input) => {
    on()
    const updatedCollection = await updateMutation.mutateAsync(input)
    await router.replace(`/my/${updatedCollection.slug}`)
  })

  return <>
    <Layout title="Collection" layout={layout}>
      <form onSubmit={onSubmit}>
        <HStack justifyContent='space-between'>
          <Heading size="lg" mb="4">
            <Text>{watch('name')}</Text>
          </Heading>
          <ButtonGroup isAttached>
            <Button leftIcon={<CheckIcon />} variant='solid' isLoading={loading} isDisabled={saveDisabled} type="submit">
              Save
            </Button>
            {
              !loading ?
                <Button variant='solid' as={Link} href={`/my/${collection.slug}`}>
                  Cancel
                </Button>
                : null
            }
          </ButtonGroup>
        </HStack>
        <VStack spacing='4' alignItems='baseline'>
          <Box width='full'>
            <FormControl isInvalid={errors.name !== undefined} isRequired isDisabled={loading}>
              <FormLabel>Collection name</FormLabel>
              <Input
                {...register('name')}
                placeholder='Name'
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box width='full'>
            <FormControl isInvalid={errors.description !== undefined} mt={4} isDisabled={loading}>
              <FormLabel>Collection description</FormLabel>
              <Textarea
                {...register('description')}
                placeholder='Placeholder'
                resize='vertical'
              />
              <FormErrorMessage>
                {errors.description?.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box width='full'>
            <FormControl isInvalid={errors.slug !== undefined || errorAvailability} isRequired isDisabled={loading}>
              <FormLabel>URL</FormLabel>
              <InputGroup>
                <InputLeftAddon bg={useColorModeValue('gray.200', 'whiteAlpha.300')}>{env.NEXT_PUBLIC_HOST}/{collection.user.username}/</InputLeftAddon>
                <Input
                  {...register('slug', {
                    onChange: onChange
                  })}
                  placeholder='collection-url'
                />
                <InputRightElement>
                  {
                    !(shouldVerify && errors.slug === undefined)
                      ? null
                      : verifySlugAvailableQuery.isLoading
                        ? <Spinner />
                        : slugAvailable
                          ? <CheckIcon color='green.500' />
                          : <CloseIcon color='red.500' />
                  }
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{
                errors.slug?.message !== undefined
                  ? errors.slug?.message
                  : 'This URL is unavailable'}</FormErrorMessage>
            </FormControl>
          </Box>
        </VStack>
      </form>
    </Layout>
  </>
}

const paramsSchema = z.object({ collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { collectionSlug } = paramsSchema.parse(params)

  const currentCollection = await prisma.collection.findFirst({
    where: {
      userId: auth.user.id,
      slug: collectionSlug,
    },
    include: {
      items: true,
      user: true
    }
  })

  if (currentCollection === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  return {
    props: {
      collection: currentCollection,
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default CollectionEditPage