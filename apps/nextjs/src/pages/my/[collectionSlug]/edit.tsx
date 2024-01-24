import { Button, ButtonGroup, FormControl, HStack, Heading, Input, Text, useBoolean, FormErrorMessage, FormLabel, VStack, Box, InputGroup, InputLeftAddon, useColorModeValue, InputRightElement, Spinner, IconButton } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item, type User, type CollectionImage } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { MyLayout } from "~/layout"
import { api } from "~/utils/api"
import { Icon } from "@chakra-ui/react"
import { useZodForm } from "~/components/forms"
import { useRouter } from "next/router"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { env } from "~/env.mjs"
import { useVerifyValue } from "~/utils/useVerifyValue"
import { Check, Save, Trash2, X } from "lucide-react"
import { editCollectionSchema } from "@evy/api/schemas"
import { Editor } from "~/components/editor"
import { Controller } from "react-hook-form"
import { ImageUpload } from "~/components/item-media/new-media/ImageUpload"
import { getThumbhash, uploadImage } from "@evy/images"
import { ImageDisplay } from "~/components/common/ImageDisplay"
import { useState } from "react"

type Props = {
  collection: Collection & { items: Item[] } & { user: User } & { htmlDescription: string | null } & { images: CollectionImage[] }
} & LayoutServerSideProps

const CollectionEditPage: NextPage<Props> = ({ layout, collection }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const [removeImageId, setRemoveImageId] = useState<string | undefined>()
  const { debounceSettled, shouldVerify, verifyValue, onChange } = useVerifyValue(collection.slug)
  const [currentImage, setCurrentImage] = useState(collection.images?.[0])

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch
  } = useZodForm({
    schema: editCollectionSchema,
    defaultValues: {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description ?? undefined
    }
  })

  const updateMutation = api.collection.update.useMutation()
  const createCollectionImageMutation = api.collection.createBasicImage.useMutation()
  const directUploadMutation = api.image.getDirectUploadUrl.useMutation()
  const removeImageMutation = api.collection.removeImage.useMutation()

  const verifySlugAvailableQuery = api.collection.verifyCollectionSlug.useQuery({ slug: verifyValue! }, {
    enabled: shouldVerify && errors.slug === undefined && verifyValue !== null,
    cacheTime: 0
  })

  const slugAvailable = verifySlugAvailableQuery.data ?? false
  const errorAvailability = shouldVerify && !slugAvailable && !verifySlugAvailableQuery.isLoading
  const saveDisabled = !isValid || shouldVerify && !slugAvailable || !debounceSettled

  const onSubmit = handleSubmit(async (input) => {
    on()
    if (removeImageId !== undefined) {
      await removeImageMutation.mutateAsync({ imageId: removeImageId })
    }
    if (input.logo !== undefined && input.logo.length > 0) {
      const directUpload = await directUploadMutation.mutateAsync({ collectionId: input.id })
      await uploadImage({ file: input.logo[0]!, directUpload: directUpload.result })
      const thumbhash = await getThumbhash(input.logo[0]!)
      await createCollectionImageMutation.mutateAsync({ collectionId: collection.id, externalImageId: directUpload.result.id, thumbhash })
    }
    const result = await updateMutation.mutateAsync({ ...input, logo: undefined })
    await router.replace(`/my/${result.slug}`)
  })

  const onRemoveImage = async (imageId: string) => {
    setRemoveImageId(imageId)
    setCurrentImage(undefined)
  }

  return <>
    <MyLayout title="Collection" layout={layout}>
      <form onSubmit={onSubmit}>
        <HStack justifyContent='space-between'>
          <Heading size="lg" mb="4">
            <Text>{watch('name')}</Text>
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
            {
              currentImage !== undefined
                ? <FormControl>
                  <FormLabel>Cover image</FormLabel>
                  <Box position='relative'>
                    <ImageDisplay filter='brightness(75%) saturate(140%)' height='10rem' image={currentImage} />
                    <IconButton
                      aria-label="remove image"
                      icon={<Icon as={Trash2} />}
                      position='absolute'
                      margin='auto'
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      onClick={() => onRemoveImage(currentImage.id)}
                    />
                  </Box>
                </FormControl>
                : <FormControl isInvalid={errors.logo !== undefined} mt={4} isDisabled={loading}>
                  <FormLabel>Cover image</FormLabel>
                  <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload height="10rem" onDrop={field.onChange} />
                    )}
                  />
                  <FormErrorMessage>
                    {errors.logo?.message?.toString()}
                  </FormErrorMessage>
                </FormControl>
            }
          </Box>
          <Box width='full'>
            <FormControl isInvalid={errors.description !== undefined} mt={4} isDisabled={loading}>
              <FormLabel>Collection description</FormLabel>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Editor
                    ref={(el) => field.ref(el)}
                    name={field.name}
                    onValueChange={field.onChange}
                    value={collection.htmlDescription}
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
        </VStack>
      </form>
    </MyLayout>
  </>
}

const paramsSchema = z.object({ collectionSlug: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  const { collectionSlug } = paramsSchema.parse(params)

  const currentCollection = await prisma.collection.findFirst({
    where: {
      userId: auth.user.id,
      slug: collectionSlug,
    },
    include: {
      items: true,
      user: true,
      images: true
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