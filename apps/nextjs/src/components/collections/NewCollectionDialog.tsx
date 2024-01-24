import { Button, type ButtonProps, FormControl, FormErrorMessage, FormLabel, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useZodForm } from "../forms"
import { api } from "~/utils/api"
import { useRouter } from "next/router"
import { Plus } from "lucide-react"
import { newCollectionSchema } from "@evy/api/schemas"
import { Controller } from "react-hook-form"
import { Editor } from "../editor"

type Props = {
  as?: React.ElementType
} & ButtonProps

export const NewCollectionDialog = ({ as, ...rest }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useZodForm({ schema: newCollectionSchema, })

  const createMutation = api.collection.create.useMutation()

  const onSubmit = handleSubmit(async (input) => {
    const createdCollection = await createMutation.mutateAsync(input)
    onClose()
    await router.push(`/my/${createdCollection.slug}`)
  })

  const ButtonComponent = as ?? Button

  return <>
    <ButtonComponent
      leftIcon={<Icon as={Plus} />}
      onClick={onOpen}
      {...rest}>
      Add new
    </ButtonComponent>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>Create a collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={errors.name !== undefined} isRequired={true}>
              <FormLabel htmlFor="name">Collection name</FormLabel>
              <Input
                {...register('name')}
                placeholder='Name'
              />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description !== undefined} mt={4}>
              <FormLabel>Collection description</FormLabel>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Editor
                    ref={(el) => field.ref(el)}
                    name={field.name}
                    onValueChange={field.onChange}
                    value={null}
                  />
                )}
              />
              <FormErrorMessage>
                {errors.description?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}

              isDisabled={!isDirty || !isValid}
              type="submit"
            >
              Save
            </Button>

            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>
}

export default NewCollectionDialog

