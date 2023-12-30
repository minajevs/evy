import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react"
import { type updateImageSchema } from "@evy/api/schemas"
import { type ItemImage } from "@evy/db"
import { useEffect } from "react"
import { useZodFormContext } from "~/components/forms"

type Props = {
  image: ItemImage
}

export const ImageUpdateForm = ({ image }: Props) => {
  const {
    register,
    formState: { errors },
    reset
  } = useZodFormContext<typeof updateImageSchema>()

  useEffect(() => {
    reset({ id: image.id })
  }, [image.id, reset])

  return <>
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
  </>
}