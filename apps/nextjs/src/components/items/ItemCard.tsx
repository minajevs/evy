import { Box, Card, CardBody, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import type { Collection, Item, ItemImage } from "@evy/db"
import Link from "next/link"
import { ImageDisplay } from "../common/ImageDisplay"
import { Image } from "lucide-react"

type Props = {
  linkPrefix?: string
  item: Item & { collection: Collection } & { images: ItemImage[] }
}
export const ItemCard = ({ linkPrefix, item }: Props) => {
  console.log(item.images)
  {/* width - full, heigh - full, paddingTop - 100% to achieve square */ }
  {/* set paddingTop to change dimensions, eg. w = 100px, paddingTop = 33% => h == 33px  */ }
  const image = item.images[0] !== undefined
    ? <ImageDisplay
      image={item.images[0]}
      width='full'
      height='full'
      paddingTop='50%'
    />
    : <NoImage />
  return <Link href={`/${linkPrefix ?? 'my'}/${item.collection.slug}/${item.slug}`}>
    <Card
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        transitionDuration: '0.1s',
        transitionTimingFunction: "ease-in-out"
      }}
      _active={{
        transform: 'translateY(2px)',
        transitionDuration: '0.1s',
      }}
      cursor='pointer'
      overflow='hidden'
    >
      <Stack>
        {image}
        <CardBody>
          <Text fontWeight={600}>{item.name}</Text>
        </CardBody>
      </Stack>
    </Card>
  </Link>
}

const NoImage = () => {
  const bg = useColorModeValue('gray.200', 'gray.600')
  const ic = useColorModeValue('gray.500', 'gray.300')
  return <Box
    width='full'
    height='full'
    background={bg}
  >
    <Box
      pos='relative'
      width='full'
      height='full'
      paddingTop='50%'
    >
      <Icon
        color={ic}
        as={Image}
        left="50%"
        top="50%"
        transform='translate(-50%, -1.25rem)'
        boxSize={10}
        position='absolute'
      />
    </Box>
  </Box>
}
