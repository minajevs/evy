import { Box, Flex, Progress, SimpleGrid, Wrap, useStatStyles } from "@chakra-ui/react"
import { ImageUpload } from "./ImageUpload"
import { type UploadProgressEvent, imageSrc, uploadImage, validateFiles, getThumbhash, getDataFromThumbhash } from "@evy/images"
import { api } from "~/utils/api"
import { type ItemImage } from "@evy/db"
import { Image } from "@chakra-ui/next-js"
import { useCallback, useState } from "react"

type Props = {
  itemId: string
  images: ItemImage[]
}

export const ItemMedia = ({ itemId, images }: Props) => {
  const directUploadMutation = api.image.getDirectUploadUrl.useMutation()
  const imageCreateMutation = api.image.saveUploadResult.useMutation()

  const [uploading, setUploading] = useState<boolean>(false)
  const [localImages, setLocalImages] = useState(images)

  const handleFiles = async (files: File[]) => {
    const validationResult = validateFiles(files)
    if (validationResult !== true) {
      // TODO: Show error to user?
      console.error(validationResult)
      return
    }

    setUploading(true)

    const data = await directUploadMutation.mutateAsync({ itemId })

    await uploadImage({ file: files[0]!, directUpload: data.result })

    const thumbhash = await getThumbhash(files[0]!)

    const createdImage = await imageCreateMutation.mutateAsync({ itemId, externalImageId: data.result.id, thumbhash })
    setUploading(false)
    setLocalImages(state => [...state, createdImage])
  }

  return <>
    {uploading ? <Progress size='xs' isIndeterminate /> : null}
    <SimpleGrid columns={{ xl: 4, md: 3, sm: 2, base: 1 }} spacing='3'>
      {localImages.map(image => <Box
        key={image.id}
        role='group'
        zIndex={1}>
        <Box
          pos='relative'
          height='25vh'
          // _after={{
          //   content: '""',
          //   w: 'full',
          //   h: 'full',
          //   pos: 'absolute',
          //   top: 5,
          //   left: 0,
          //   backgroundImage: getDataFromThumbhash(image.thumbhash),
          //   backgroundSize: 'cover',
          //   zIndex: -1,
          //   filter: 'blur(15px)',
          // }}
          key={image.id}>
          <Image
            src={imageSrc(image.externalImageId)}
            alt='img'
            fill={true}
            objectFit="cover"
            placeholder="blur"
            blurDataURL={getDataFromThumbhash(image.thumbhash)}
          />
        </Box>
      </Box>)}
      <ImageUpload
        multiple
        onDrop={handleFiles}
      />
    </SimpleGrid>
  </>
}