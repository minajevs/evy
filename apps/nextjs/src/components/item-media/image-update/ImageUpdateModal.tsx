import { Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalFooter, Textarea, useBoolean } from "@chakra-ui/react"
import { useForm } from "../../forms"
import { updateImageSchema } from "@evy/api/schemas"
import { useEffect } from "react"
import { api } from "~/utils/api"
import { useRouter } from "next/router"
import { type ItemImage } from "@evy/db"
import { ImageDisplay } from "../image-display"

type Props = {
  image: ItemImage
  onSave: () => void
}

export const ImageUpdateModal = ({ image, onSave }: Props) => {
  const [loading, { on }] = useBoolean()
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset
  } = useForm({ schema: updateImageSchema, defaultValues: { imageId: image.id } })

  useEffect(() => {
    reset({ imageId: image.id })
  }, [image.id, reset])

  const mutation = api.image.updateImage.useMutation()

  const onSubmit = handleSubmit(async data => {
    on()
    await mutation.mutateAsync(data)
    onSave()
  })

  return <>
    <form onSubmit={onSubmit}>
      <ModalBody pb={6}>
        <ImageDisplay mb={4} image={image} fit='contain' height='40vh' />
        <FormControl isInvalid={errors.name !== undefined}>
          <FormLabel htmlFor="name">Image name</FormLabel>
          <Input
            {...register('name')}
            placeholder='Name'
          />
          <FormErrorMessage>
            {errors.name?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.description !== undefined} mt={4}>
          <FormLabel>Image description</FormLabel>
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
          isDisabled={!isValid}
          type="submit"
          isLoading={loading}
        >
          Save
        </Button>
      </ModalFooter>
    </form>
  </>
}