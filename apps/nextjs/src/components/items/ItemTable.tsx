import { VStack, HStack, useColorModeValue, Box, Divider, Heading, Icon } from "@chakra-ui/react"
import { type Collection, type Item, type ItemImage } from "@evy/db"
import { Fragment } from "react"
import { ImageDisplay } from "../common/ImageDisplay"
import { FiImage } from "react-icons/fi"

const imageSize = 16

type ItemProp = Item & { collection: Collection } & { images: ItemImage[] }

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
        <Box>
          <Heading fontSize='lg'>
            {item.name}
          </Heading>
        </Box>
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