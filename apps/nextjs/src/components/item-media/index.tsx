import { Button, HStack, Heading, SimpleGrid, useDisclosure } from "@chakra-ui/react"
import { type ItemImage } from "@evy/db"
import { useCallback, useState } from "react"
import { AddIcon } from "@chakra-ui/icons"
import { UploadDialog } from "./new-media/UploadDialog"
import { ItemCard } from "./item-card"
import { ImageUpdate } from "./image-update"

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

  const onClick = useCallback((image: ItemImage) => {
    setEditImage(image)
    editImageDisclosure.onOpen()
  }, [setEditImage, editImageDisclosure])

  return <>
    <HStack width='100%' justifyContent='space-between' mb={2}>
      <Heading size='md'>Media</Heading>
      <Button leftIcon={<AddIcon />} variant='solid' onClick={uploadImageDisclosure.onOpen}>
        Add
      </Button>
    </HStack>
    <SimpleGrid columns={{ xl: 4, md: 3, sm: 2, base: 1 }} spacing='3'>
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
    />
    {
      editImage !== null
        ? <ImageUpdate image={editImage} disclosure={editImageDisclosure} />
        : null
    }
  </>
}