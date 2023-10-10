import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import { useZodForm } from "../forms"
import { api } from "~/utils/api"
import { newCollectionSchema } from "@evy/api/schemas"
import { useRouter } from "next/router"
import { NavItemBase } from "~/layout/sidebar/NavItem"

export const NewCollection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useZodForm({ schema: newCollectionSchema, })

  const createMutation = api.collection.create.useMutation()

  const onSubmit = handleSubmit(async (input) => {
    await createMutation.mutateAsync(input)
    onClose()
    await router.replace(router.asPath)
  })

  return <>
    <NavItemBase onClick={onOpen} mt='8'>
      + Add new
    </NavItemBase>
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
              <Textarea
                {...register('description')}
                placeholder='Placeholder'
                resize='vertical'
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

export default NewCollection

