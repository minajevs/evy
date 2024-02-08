import { Button, ModalBody, ModalFooter, useBoolean } from "@chakra-ui/react"
import { useZodForm } from "../../forms"
import { api } from "~/utils/api"
import { type Item, type ItemImage } from "@evy/db"
import { FormProvider } from "react-hook-form"
import { ImageUpdateForm } from "../image-update/ImageUpdateForm"
import { updateImageSchema } from "@evy/api/schemas"
import { ImageDisplay } from "~/components/common/ImageDisplay"

type LocalImage = ItemImage & { defaultItem: Item | null }

type Props = {
  image: LocalImage
  onSave: (image: LocalImage) => void
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
          colorScheme='secondary'
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