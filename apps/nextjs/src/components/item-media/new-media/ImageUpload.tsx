import { Box, Flex, Icon, Link, Stack, Text, VStack, VisuallyHidden } from "@chakra-ui/react"
import { type ReactNode, useRef } from "react"
import { useDropzone } from 'react-dropzone'

type FileUploadProps = {
  multiple?: boolean
  children?: ReactNode
  onDrop: (acceptedFiles: File[]) => void
}

const accept = 'image/*'

export const ImageUpload = ({ onDrop, multiple = false }: FileUploadProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  })
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  return (
    <Flex
      justify="center"
      px={6}
      py={6}
      borderWidth={2}
      borderStyle="dashed"
      borderColor={isDragActive ? 'gray.700' : 'gray.400'}
      rounded="lg"
      {...getRootProps()}

    >
      <Stack spacing={1} direction='column' textAlign="center" justifyContent='center'>
        <Box>
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
        </Box>
        <VStack
          fontSize="sm"
          spacing={0}
          mb={4}
        >
          <Link
            cursor="pointer"
            rounded="md"
            fontSize="md"
            pos="relative"
            onClick={handleClick}
          >
            <Text width='full'>Browse the files</Text>
            <VisuallyHidden>
              <input
                type={'file'}
                multiple={multiple}
                hidden
                accept={accept}
                {...getInputProps()}
              />
            </VisuallyHidden>
          </Link>
          <Text pl={1}>{isDragActive ? 'or drop file here' : 'or drag and drop here'}</Text>
        </VStack>
        <Box>
          <Text
            fontSize="xs"
          >
            PNG, JPG, GIF up to 10MB
          </Text>
        </Box>
      </Stack>
    </Flex>
  )
}
