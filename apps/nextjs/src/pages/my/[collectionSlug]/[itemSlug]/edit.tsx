import { Icon } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import { Button, ButtonGroup, FormControl, Flex, FormErrorMessage, Heading, Text, useBoolean, Input, FormLabel, Textarea, VStack, Box, InputGroup, InputLeftAddon, useColorModeValue, InputRightElement, Spinner } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { z } from "zod"
import { useZodForm } from "~/components/forms"
import { env } from "~/env.mjs"
import Layout from "~/layout"
import { api } from "~/utils/api"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { useVerifyValue } from "~/utils/useVerifyValue"
import { FiCheck, FiSave, FiX } from "react-icons/fi"
import { editItemSchema } from "@evy/api/schemas"

type Props = {
  item: Item & { collection: Collection & { user: User } }
} & LayoutServerSideProps

const EditItemPage: NextPage<Props> = ({ layout, item }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const { debounceSettled, shouldVerify, verifyValue, onChange } = useVerifyValue(item.slug)

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch
  } = useZodForm({
    schema: editItemSchema, defaultValues: {
      id: item.id,
      name: item.name,
      description: item.description ?? undefined,
      slug: item.slug
    }
  })

  const updateMutation = api.item.update.useMutation()
  const verifyItemSlugQuery = api.item.verifyItemSlug.useQuery({ collectionId: item.collectionId, slug: verifyValue }, {
    enabled: shouldVerify && errors.slug === undefined,
    cacheTime: 0
  })

  const slugAvailable = verifyItemSlugQuery.data ?? false
  const errorAvailability = shouldVerify && !slugAvailable && !verifyItemSlugQuery.isLoading
  const saveDisabled = !isValid || shouldVerify && !slugAvailable || !debounceSettled

  const onSubmit = handleSubmit(async (input) => {
    on()
    const updatedItem = await updateMutation.mutateAsync(input)
    await router.replace(`/my/${item.collection.slug}/${updatedItem.slug}`)
  })

  return <>
    <Layout title="Item" layout={layout}>
      <form onSubmit={onSubmit}>
        <Flex justifyContent='space-between'>
          <Heading size="lg" mb="4">
            <Link href={`/my/${item.collection.slug}`}>{item.collection.name}</Link>
            <Text display='inline' pl='1' fontWeight={200}>/</Text>
            <Text display='inline' pl='1'>{watch('name')}</Text>
          </Heading>
          <ButtonGroup isAttached>
            <Button leftIcon={<Icon as={FiSave} />} variant='solid' isLoading={loading} isDisabled={saveDisabled} type="submit">
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
        </Flex>
        <VStack spacing='4' alignItems='baseline'>
          <Box width='full'>
            <FormControl isInvalid={errors.name !== undefined} isRequired isDisabled={loading}>
              <FormLabel>Item name</FormLabel>
              <Input
                {...register('name')}
                placeholder='Name'
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box width='full'>
            <FormControl isInvalid={errors.description !== undefined} isDisabled={loading}>
              <FormLabel>Item description</FormLabel>
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
                <InputLeftAddon bg={useColorModeValue('gray.200', 'whiteAlpha.300')}>{env.NEXT_PUBLIC_HOST}/{item.collection.user.username}/{item.collection.slug}/</InputLeftAddon>
                <Input
                  {...register('slug', {
                    onChange: onChange
                  })}
                  placeholder='item-url'
                />
                <InputRightElement>
                  {
                    !(shouldVerify && errors.slug === undefined)
                      ? null
                      : verifyItemSlugQuery.isLoading
                        ? <Spinner />
                        : slugAvailable
                          ? <Icon as={FiCheck} color='green.500' />
                          : <Icon as={FiX} color='red.500' />
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

const paramsSchema = z.object({ itemSlug: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { itemSlug, collectionSlug } = paramsSchema.parse(params)

  const currentItem = await prisma.item.findFirst({
    where: {
      collection: {
        slug: collectionSlug,
        userId: auth.user.id,
      },
      slug: itemSlug
    },
    include: {
      collection: {
        include: {
          user: true
        }
      }
    }
  })

  if (currentItem === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  return {
    props: {
      item: currentItem,
      ...await getLayoutProps(auth.user.id)
    }
  }
}

export default EditItemPage