import { Button, ModalBody, ModalFooter, useBoolean } from "@chakra-ui/react"
import { useZodForm } from "../../forms"
import { updateImageSchema } from "@evy/api/schemas"
import { api } from "~/utils/api"
import { type ItemImage } from "@evy/db"
import { ImageDisplay } from "../image-display"
import { FormProvider } from "react-hook-form"
import { ImageUpdateForm } from "../image-update/ImageUpdateForm"

type Props = {
  image: ItemImage
  onSave: (image: ItemImage) => void
}

export const ImageUploadUpdateModal = ({ image, onSave }: Props) => {
  const [loading, { on }] = useBoolean()
  const form = useZodForm({ schema: updateImageSchema, defaultValues: { id: image.id } })

  const mutation = api.image.updateImage.useMutation()

  const { handleSubmit, formState: { isValid } } = form

  const onSubmit = handleSubmit(async data => {
    on()
    const savedImage = await mutation.mutateAsync(data)
    onSave(savedImage)
  })

  return <form onSubmit={onSubmit}>
    <FormProvider {...form}>
      <ModalBody pb={6}>
        <ImageDisplay mb={4} image={image} fit='contain' height='40vh' />
        <ImageUpdateForm image={image} />
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
    </FormProvider>
  </form>
}