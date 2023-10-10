import { Box, Button, HStack, Heading, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react"
import { type ItemImage } from "@evy/db"
import { useCallback, useState } from "react"
import { AddIcon } from "@chakra-ui/icons"
import { UploadDialog } from "./new-media/UploadDialog"
import { ItemCard } from "./item-card"
import { ImageModal } from "./image-update/ImageModal"

type Props = {
  itemId: string
  images: ItemImage[]
}

export const ItemMedia = ({ itemId, images }: Props) => {
  const uploadImageDisclosure = useDisclosure()
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

  const noItems = <Box>
    <Text>No media for this item yet</Text>
    <Text>Click "Add" to add first photo</Text>
  </Box>

  return <>
    <HStack width='100%' justifyContent='space-between' mb={2}>
      <Heading size='md'>Media</Heading>
      <Button leftIcon={<AddIcon />} variant='solid' onClick={uploadImageDisclosure.onOpen}>
        Add
      </Button>
    </HStack>
    <SimpleGrid columns={{ xl: 4, md: 3, sm: 2, base: 1 }} spacing='3'>
      {localImages.length === 0
        ? noItems
        : null}
      {localImages.map(image => <ItemCard
        key={image.id}
        image={image}
        onClick={() => onClick(image)}
      />)}
    </SimpleGrid>
    <UploadDialog
      disclosure={uploadImageDisclosure}
      itemId={itemId}
      onUploaded={onUploaded}
      onUpdated={onUpdated}
    />
    {
      editImage !== null
        ? <ImageModal
          image={editImage}
          disclosure={editImageDisclosure}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
        />
        : null
    }
  </>
}