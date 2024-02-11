import { Circle, Icon, SimpleGrid } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import { Button, ButtonGroup, FormControl, Flex, FormErrorMessage, Heading, Text, useBoolean, Input, FormLabel, VStack, Box, InputGroup, InputLeftAddon, useColorModeValue, InputRightElement, Spinner } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User, type ItemImage } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { z } from "zod"
import { useZodForm } from "~/components/forms"
import { env } from "~/env.mjs"
import { MyLayout } from "~/layout"
import { api } from "~/utils/api"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { useVerifyValue } from "~/utils/useVerifyValue"
import { Check, CheckCheck, Save, X } from "lucide-react"
import { editItemSchema } from "@evy/api/schemas"
import { Controller } from "react-hook-form"
import { Editor } from "~/components/editor"
import { ImageCard } from "~/components/item-images/image-card"

type Props = {
  item: Item & { collection: Collection & { user: User } } & { htmlDescription: string | null } & { images: ItemImage[] }
} & LayoutServerSideProps

const EditItemPage: NextPage<Props> = ({ layout, item }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const { debounceSettled, shouldVerify, verifyValue, onChange } = useVerifyValue(item.slug)

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch
  } = useZodForm({
    schema: editItemSchema, defaultValues: {
      id: item.id,
      name: item.name,
      description: item.description ?? undefined,
      slug: item.slug,
      defaultImageId: item.defaultImageId ?? undefined
    }
  })

  const updateMutation = api.item.update.useMutation()
  const verifyItemSlugQuery = api.item.verifyItemSlug.useQuery({ collectionId: item.collectionId, slug: verifyValue! }, {
    enabled: shouldVerify && errors.slug === undefined && verifyValue !== null,
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

  const badgeColor = useColorModeValue('white', 'black')

  console.log(isValid, errors)

  return <>
    <MyLayout title="Item" layout={layout}>
      <form onSubmit={onSubmit}>
        <Flex justifyContent='space-between'>
          <Heading size="lg" mb="4">
            <Link href={`/my/${item.collection.slug}`}>{item.collection.name}</Link>
            <Text display='inline' pl='1' fontWeight={200}>/</Text>
            <Text display='inline' pl='1'>{watch('name')}</Text>
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
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Editor
                    ref={(el) => field.ref(el)}
                    name={field.name}
                    onValueChange={field.onChange}
                    value={item.htmlDescription}
                  />
                )}
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
                          ? <Icon as={Check} color='green.500' />
                          : <Icon as={X} color='red.500' />
                  }
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{
                errors.slug?.message !== undefined
                  ? errors.slug?.message
                  : 'This URL is unavailable'}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box width='full'>
            <FormControl isInvalid={errors.defaultImageId !== undefined} isDisabled={loading}>
              <FormLabel>Thumbnail</FormLabel>
              {
                item.images.length > 0
                  ? <Controller
                    name='defaultImageId'
                    control={control}
                    render={({ field }) => (
                      <SimpleGrid columns={{ xl: 8, md: 6, sm: 4, base: 2 }} spacing='3' width='100%'>
                        {item.images.map(image =>
                          <Flex justify='center' role="group" key={image.id} position='relative'>
                            <ImageCard
                              image={image}
                              width='full'
                              borderRadius='md'
                              border={field.value === image.id ? '2px solid' : undefined}
                              borderColor='primary'
                              overflow='hidden'
                              filter={field.value === image.id ? 'brightness(75%) saturate(140%)' : undefined}
                              _hover={{ filter: 'brightness(75%) saturate(140%)' }}
                              onClick={() => {
                                if (field.value === image.id) return field.onChange(null)
                                return field.onChange(image.id)
                              }}
                            />
                            {
                              field.value === image.id
                                ?
                                <Circle
                                  size={6}
                                  bg='primary'
                                  color={badgeColor}
                                  position='absolute'
                                  margin='auto'
                                  top={0}
                                  left={0}
                                  bottom={0}
                                  right={0}
                                >
                                  <Icon
                                    as={CheckCheck}
                                  />
                                </Circle>
                                : null
                            }
                          </Flex>)}
                      </SimpleGrid>
                    )}
                  />
                  : <Text>No images for this item yet</Text>
              }
              <FormErrorMessage>{errors.defaultImageId?.message}</FormErrorMessage>
            </FormControl>
          </Box>
        </VStack>
      </form>
    </MyLayout>
  </>
}

const paramsSchema = z.object({ itemSlug: z.string(), collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/my', permanent: false } }
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
      images: true,
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