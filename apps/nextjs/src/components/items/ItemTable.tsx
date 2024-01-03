import { VStack, HStack, useColorModeValue, Box, Divider, Heading, Icon, ButtonGroup, Button } from "@chakra-ui/react"
import { type User, type Collection, type Item, type ItemImage } from "@evy/db"
import { Fragment } from "react"
import { ImageDisplay } from "../common/ImageDisplay"
import { FiEdit, FiImage, FiShare2 } from "react-icons/fi"
import { ShareDialog } from "../share-dialog/ShareDialog"
import { Link } from "@chakra-ui/next-js"

const imageSize = 16

type ItemProp = Item & { collection: Collection & { user: User } } & { images: ItemImage[] }

type Props = {
  items: ItemProp[]
}
export const ItemTable = ({ items }: Props) => {
  const hover = useColorModeValue('gray.200', 'gray.700')
  return <VStack border="1px solid" borderColor="gray.400" rounded="md" spacing={0} overflow='hidden' boxShadow='sm'>
    {items.map((item, i) => <Fragment key={item.id}>
      <HStack width='100%' _hover={{ bg: hover }} spacing={4}>
        <Box borderRight='1px solid' borderColor="gray.400">
          {item.images[0] !== undefined
            ? <ImageDisplay
              image={item.images[0]}
              borderRadius='full'
              boxSize={imageSize}
            />
            : <NoImage />}
        </Box>
        <Box flex={1}>
          <Heading fontSize='lg'>
            {item.name}
          </Heading>
        </Box>
        <ButtonGroup mx={4}>
          <ShareDialog
            buttonProps={{ leftIcon: <Icon as={FiShare2} />, variant: 'ghost' }}
            username={item.collection.user.username}
            collectionSlug={item.collection.slug}
            itemSlug={item.slug}
          />
          <Button leftIcon={<Icon as={FiEdit} />} variant='ghost' as={Link} href={`/my/${item.collection.slug}/${item.slug}/edit`}>
            Edit
          </Button>
        </ButtonGroup>
      </HStack>
      {items.length - 1 !== i && <Divider m={0} />}
    </Fragment>)}
  </VStack>
}

const NoImage = () => {
  const bg = useColorModeValue('gray.300', 'gray.600')
  return <Box bg={bg} boxSize={imageSize} display='flex' alignItems='center' justifyContent='center'>
    <Icon as={FiImage} boxSize={8} />
  </Box>
}