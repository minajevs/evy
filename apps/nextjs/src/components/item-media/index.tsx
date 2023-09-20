import { Button, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { ImageUpload } from "./ImageUpload"
import { PlusSquareIcon } from "@chakra-ui/icons"

type FormValues = {
  file_: FileList
}

export const ItemMedia = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => console.log('On Submit: ', data))

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return 'Files is required'
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024)
      const MAX_FILE_SIZE = 10
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb'
      }
    }
    return true
  }

  return <>
    <form onSubmit={onSubmit}>
      <FormControl isInvalid={errors.file_ !== undefined} isRequired>
        <FormLabel>File Input</FormLabel>

        <ImageUpload
          multiple
          register={register('file_', { validate: validateFiles })}
        >
          <Button leftIcon={<PlusSquareIcon />}>
            Upload
          </Button>
        </ImageUpload>

        <FormErrorMessage>
          {errors.file_?.message}
        </FormErrorMessage>
      </FormControl>

      <Button>Submit</Button>
    </form>
  </>
}