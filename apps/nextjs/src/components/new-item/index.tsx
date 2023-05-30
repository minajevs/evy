import { Button, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import { useForm } from "../forms"
import { newCollectionSchema } from "@evy/api/schemas"

export const NewItem = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm({ schema: newCollectionSchema, })

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
        <form onSubmit={console.log}>
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