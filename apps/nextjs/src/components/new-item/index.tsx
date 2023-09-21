import { Button, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import { useForm } from "../forms"
import { newItemSchema } from "@evy/api/schemas"
import { useCallback, useEffect } from "react"
import { api } from "~/utils/api"
import { useRouter } from "next/router"

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
  } = useForm({ schema: newItemSchema, defaultValues: { collectionId } })

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
    router.replace(router.asPath)
  })

  return <>
    <Card
      onClick={onOpen}
      boxShadow='lg'
      _hover={{
        boxShadow: 'xl',
        transform: 'translateY(-2px)',
        transitionDuration: '0.2s',
        transitionTimingFunction: "ease-in-out"
      }}
      _active={{
        transform: 'translateY(2px)',
        transitionDuration: '0.1s',
      }}
      cursor='pointer'
    >
      <CardBody>
        + Add new item
      </CardBody>
    </Card>
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