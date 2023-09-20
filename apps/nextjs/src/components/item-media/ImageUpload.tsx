import { Flex, Icon, InputGroup, Link, Stack, Text, VisuallyHidden } from "@chakra-ui/react"
import { type ReactNode, useRef, useCallback } from "react"
import { type UseFormRegisterReturn } from "react-hook-form"
import { useDropzone } from 'react-dropzone'

type FileUploadProps = {
  register: UseFormRegisterReturn
  multiple?: boolean
  children?: ReactNode
}

const accept = 'image/*'

export const ImageUpload = ({ register, multiple = false, children }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { ref, ...rest } = register as { ref: (instance: HTMLInputElement | null) => void }

  const handleClick = () => inputRef.current?.click()

  return (
    <Flex
      mt={1}
      justify="center"
      px={6}
      pt={5}
      pb={6}
      borderWidth={2}
      borderStyle="dashed"
      borderColor={isDragActive ? 'gray.700' : 'gray.400'}
      rounded="md"
      {...getRootProps()}

    >
      <Stack spacing={1} textAlign="center">
        <Icon
          mx="auto"
          boxSize={12}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Icon>
        <Flex
          fontSize="sm"
          alignItems="baseline"
        >
          <Link
            cursor="pointer"
            rounded="md"
            fontSize="md"
            pos="relative"
            onClick={handleClick}
          >
            <Text>{isDragActive ? 'Drop file here' : 'Upload a file'}</Text>
            <VisuallyHidden>
              <input
                type={'file'}
                multiple={multiple}
                hidden
                accept={accept}
                {...rest}
                ref={(e) => {
                  ref(e)
                  inputRef.current = e
                }}
                {...getInputProps()}
              />
            </VisuallyHidden>
          </Link>
          <Text pl={1}>or drag and drop here</Text>
        </Flex>
        <Text
          fontSize="xs"
        >
          PNG, JPG, GIF up to 10MB
        </Text>
      </Stack>
    </Flex>
  )
}
