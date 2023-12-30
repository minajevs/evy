import { Button, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import { useZodForm } from "../forms"
import { useCallback, useEffect } from "react"
import { api } from "~/utils/api"
import { useRouter } from "next/router"
import { Icon } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import { newItemSchema } from "@evy/api/schemas"

type Props = {
  collectionId: string
}

export const NewItem = ({ collectionId }: Props) => {
  const { isOpen, onOpen: _onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
    reset
  } = useZodForm({ schema: newItemSchema, defaultValues: { collectionId } })

  useEffect(() => {
    reset({ collectionId })
  }, [collectionId, reset])

  const createMutation = api.item.create.useMutation()

  const onOpen = useCallback(() => {
    reset()
    _onOpen()
  }, [reset, _onOpen])

  const onSubmit = handleSubmit(async data => {
    await createMutation.mutateAsync(data)
    onClose()
    reset()
    await router.replace(router.asPath)
  })

  return <>
    <Button
      leftIcon={<Icon as={FiPlus} />}
      variant='solid'
      onClick={onOpen}>
      Add
    </Button>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>Create an item</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={errors.name !== undefined} isRequired={true}>
              <FormLabel htmlFor="name">Item name</FormLabel>
              <Input
                {...register('name')}
                placeholder='Name'
              />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description !== undefined} mt={4}>
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