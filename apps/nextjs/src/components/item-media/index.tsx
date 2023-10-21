import { Box, Button, HStack, Heading, SimpleGrid, Text, type UseDisclosureReturn, useDisclosure } from "@chakra-ui/react"
import { type ItemImage } from "@evy/db"
import { useCallback, useState } from "react"
import { AddIcon } from "@chakra-ui/icons"
import { UploadDialog } from "./new-media/UploadDialog"
import { ImageCard } from "./image-card"
import { ImageGrid } from "./ImageGrid"
import { ImageUpdateModal } from "./image-update/ImageUpdateModal"

type Props = {
  itemId: string
  images: ItemImage[]
  uploadDisclosure: UseDisclosureReturn
}

export const ItemMedia = ({ itemId, images, uploadDisclosure }: Props) => {
  const editImageDisclosure = useDisclosure()

  const [editImage, setEditImage] = useState<ItemImage | null>(null)
  const [localImages, setLocalImages] = useState<ItemImage[]>(images)

  const onUploaded = useCallback((image: ItemImage) => {
    setLocalImages(prev => [...prev, image])
  }, [setLocalImages])

  const onUpdated = useCallback((image: ItemImage) => {
    setLocalImages(prev => prev.map(img => img.id === image.id ? image : img))
  }, [setLocalImages])

  const onDeleted = useCallback((image: ItemImage) => {
    setLocalImages(prev => prev.filter(x => x.id !== image.id))
  }, [setLocalImages])

  const onClick = useCallback((image: ItemImage) => {
    setEditImage(image)
    editImageDisclosure.onOpen()
  }, [setEditImage, editImageDisclosure])

  return <>
    <ImageGrid images={localImages} onClick={onClick}>
      <Box>
        <Text>No media for this item yet</Text>
        <Text>{'Click "Add" to add first photo'}</Text>
      </Box>
    </ImageGrid>
    <UploadDialog
      disclosure={uploadDisclosure}
      itemId={itemId}
      onUploaded={onUploaded}
      onUpdated={onUpdated}
    />
    {
      editImage !== null
        ? <ImageUpdateModal
          image={editImage}
          disclosure={editImageDisclosure}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
        />
        : null
    }
  </>
}