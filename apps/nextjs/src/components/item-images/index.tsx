import { Box, Text, type UseDisclosureReturn, useDisclosure } from "@chakra-ui/react"
import { type Item, type ItemImage } from "@evy/db"
import { useCallback, useState } from "react"
import { UploadDialog } from "./new-image/UploadDialog"
import { ImageGrid } from "./ImageGrid"
import { ImageUpdateModal } from "./image-update/ImageUpdateModal"

type LocalImage = ItemImage & { defaultItem: Item | null }

type Props = {
  itemId: string
  images: LocalImage[]
  uploadDisclosure: UseDisclosureReturn
}

export const ItemImages = ({ itemId, images, uploadDisclosure }: Props) => {
  const editImageDisclosure = useDisclosure()

  const [editImage, setEditImage] = useState<LocalImage | null>(null)
  const [localImages, setLocalImages] = useState<LocalImage[]>(images)

  const onUploaded = useCallback((image: LocalImage) => {
    setLocalImages(prev => [...prev, image])
  }, [setLocalImages])

  const onUpdated = useCallback((updatedImage: LocalImage) => {
    // Optimistically handle image being set as default (thumbnail)
    const forceThumbnail = updatedImage.defaultItem !== null
    setLocalImages(prev => prev.map(img => {
      if (img.id === updatedImage.id) return updatedImage

      if (forceThumbnail) {
        return { ...img, defaultItem: null }
      }
      return img
    }))
  }, [setLocalImages])

  const onDeleted = useCallback((image: LocalImage) => {
    setLocalImages(prev => prev.filter(x => x.id !== image.id))
  }, [setLocalImages])

  const onClick = useCallback((image: LocalImage) => {
    setEditImage(image)
    editImageDisclosure.onOpen()
  }, [setEditImage, editImageDisclosure])

  return <>
    <ImageGrid images={localImages} onClick={onClick}>
      <Box>
        <Text>No images for this item yet</Text>
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