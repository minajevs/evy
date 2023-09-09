import { Button, ButtonGroup, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, FormControl, HStack, Heading, Input, type InputProps, SimpleGrid, Text, useBoolean, forwardRef, type As, FormErrorMessage, FormLabel, FormHelperText, Textarea } from "@chakra-ui/react"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { z } from "zod"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { api } from "~/utils/api"
import { Link } from "@chakra-ui/next-js"
import { CheckIcon, EditIcon } from "@chakra-ui/icons"
import { EditText } from "~/components/common/EditText"
import { editCollectionSchema } from "@evy/api/schemas"
import { useForm } from "~/components/forms"
import { useRouter } from "next/router"

type Props = {
  collections: Collection[]
  collection: Collection & { items: Item[] }
}

const CustomInput = forwardRef<InputProps, As>((props, ref) => <Input variant='unstyled' mb={0} ref={ref} {...props} />)

const CollectionEditPage: NextPage<Props> = ({ collections, collection }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm({ schema: editCollectionSchema, defaultValues: { id: collection.id, name: collection.name, description: collection.description ?? undefined } })

  const updateMutation = api.collection.update.useMutation()

  const onSubmit = handleSubmit(async (input) => {
    on()
    await updateMutation.mutateAsync(input)
    await router.replace(`/my/${collection.id}`)
  })

  return <>
    <Layout title="Collection" collections={collections}>
      <form onSubmit={onSubmit}>
        <Flex justifyContent='space-between' h='4rem'>
          <FormControl isInvalid={errors.name !== undefined} isRequired isDisabled={loading}>
            <Heading
              size="lg"
              as={CustomInput}
              {...register('name')}
              placeholder='Name' />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <ButtonGroup isAttached>
            <Button leftIcon={<CheckIcon />} variant='solid' isLoading={loading} isDisabled={!isValid} type="submit">
              Save
            </Button>
            {
              !loading ?
                <Button variant='solid' as={Link} href={`/my/${collection.id}`}>
                  Cancel
                </Button>
                : null
            }
          </ButtonGroup>
        </Flex>
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
      </form>
    </Layout>
  </>
}

const paramsSchema = z.object({ collectionId: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { collectionId } = paramsSchema.parse(params)

  const currentCollection = await prisma.collection.findFirst({
    where: {
      userId: auth.user.id,
      id: collectionId,
    },
    include: {
      items: true
    }
  })

  if (currentCollection === null) {
    return { redirect: { destination: '/my', permanent: false } }
  }

  const allCollections = await prisma.collection.findMany({
    where: {
      userId: auth.user.id
    },
  })


  return {
    props: {
      collections: allCollections,
      collection: currentCollection
    }
  }
}

export default CollectionEditPage