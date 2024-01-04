import { VStack, HStack, useColorModeValue, Box, Divider, Icon, ButtonGroup, Button, Card, Text } from "@chakra-ui/react"
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
  const hover = useColorModeValue('gray.100', 'gray.600')
  return <Card boxShadow='sm'>
    <VStack border='0' rounded="md" spacing={0} overflow='hidden'>
      {items.map((item, i) => <Fragment key={item.id}>
        <HStack width='100%' _hover={{ bg: hover }} spacing={4} >
          <Box>
            {item.images[0] !== undefined
              ? <ImageDisplay
                image={item.images[0]}
                borderRadius='full'
                boxSize={imageSize}
              />
              : <NoImage />}
          </Box>
          <Box flex={1}>
            <Text fontWeight={600}>
              {item.name}
            </Text>
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
  </Card>
}

const NoImage = () => {
  const bg = useColorModeValue('gray.200', 'gray.600')
  const ic = useColorModeValue('gray.500', 'gray.300')
  return <Box bg={bg} boxSize={imageSize} display='flex' alignItems='center' justifyContent='center'>
    <Icon color={ic} as={FiImage} boxSize={8} />
  </Box>
}