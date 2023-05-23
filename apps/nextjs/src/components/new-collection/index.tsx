import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { type SubmitHandler } from "react-hook-form"
import { NavItemBase } from "~/layout/sidebar/NavItem"
import { type NewCollectionType, useNewCollectionForm } from "./form"

export const NewCollection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useNewCollectionForm()

  const onSubmit: SubmitHandler<NewCollectionType> = ({ name }) => {
    console.log(name)
  }

  console.log(errors)

  return <>
    <NavItemBase onClick={onOpen}>
      + Add new collection
    </NavItemBase>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create a collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={errors.name !== undefined}>
              <FormLabel htmlFor="name">First name</FormLabel>
              <Input
                id="name"
                {...register('name')}
                placeholder='First name'
              />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last name</FormLabel>
              <Input placeholder='Last name' />
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

