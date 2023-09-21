import { CheckIcon, EditIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, ButtonGroup, FormControl, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, FormErrorMessage, HStack, Heading, SimpleGrid, Text, useBoolean, forwardRef, type InputProps, type As, Input, FormLabel, Textarea } from "@chakra-ui/react"
import { editCollectionSchema, editItemSchema } from "@evy/api/schemas"
import { getServerSession } from "@evy/auth"
import { type Collection, prisma, type Item } from "@evy/db"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { z } from "zod"
import { useForm } from "~/components/forms"
import { NewItem } from "~/components/new-item"
import Layout from "~/layout"
import { api } from "~/utils/api"
import { getLayoutProps, type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  item: Item & { collection: Collection }
} & LayoutServerSideProps

const CustomInput = forwardRef<InputProps, As>((props, ref) => <Input variant='unstyled' mb={0} ref={ref} {...props} />)

const EditItemPage: NextPage<Props> = ({ layout, item }) => {
  const router = useRouter()
  const [loading, { on }] = useBoolean()
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
    watch
  } = useForm({ schema: editItemSchema, defaultValues: { itemId: item.id, name: item.name, description: item.description ?? undefined } })

  const updateMutation = api.item.update.useMutation()

  const onSubmit = handleSubmit(async (input) => {
    on()
    await updateMutation.mutateAsync(input)
    await router.replace(`/my/${item.collection.id}/${item.id}`)
  })

  return <>
    <Layout title="Item" layout={layout}>
      <form onSubmit={onSubmit}>
        <Flex justifyContent='space-between' h='4rem'>
          <FormControl isInvalid={errors.name !== undefined} isRequired isDisabled={loading}>
            <Heading size="lg" mb="4">
              <Link href={`/my/${item.collectionId}`}>{item.collection.name}</Link>
              <Text display='inline' pl='1' fontWeight={200}>/</Text>
              <Text display='inline' pl='1'>{watch('name')}</Text>
            </Heading>
          </FormControl>
          <ButtonGroup isAttached>
            <Button leftIcon={<CheckIcon />} variant='solid' isLoading={loading} isDisabled={!isValid} type="submit">
              Save
            </Button>
            {
              !loading ?
                <Button variant='solid' as={Link} href={`/my/${item.collection.id}/${item.id}`}>
                  Cancel
                </Button>
                : null
            }
          </ButtonGroup>
        </Flex>
        <FormControl isInvalid={errors.name !== undefined} isRequired isDisabled={loading}>
          <FormLabel>Item name</FormLabel>
          <Input
            {...register('name')}
            placeholder='Name'
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description !== undefined} mt={4} isDisabled={loading}>
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
      </form>
    </Layout>
  </>
}

const paramsSchema = z.object({ itemId: z.string(), collectionId: z.string() })
export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
  const auth = await getServerSession({ req, res })
  if (!auth) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { itemId, collectionId } = paramsSchema.parse(params)

  const currentItem = await prisma.item.findFirst({
    where: {
      collection: {
        id: collectionId,
        userId: auth.user.id,
      },
      id: itemId
    },
    include: {
      collection: true
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