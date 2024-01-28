import { VStack, HStack, useColorModeValue, Box, Divider, Icon, ButtonGroup, Card, Text, IconButton, Menu, MenuButton, MenuList, Button, Flex } from "@chakra-ui/react"
import { type ItemTag, type Collection, type Item, type ItemImage, type Tag, type User } from "@evy/db"
import { ImageDisplay } from "../common/ImageDisplay"
import { Edit, ExternalLink, Image, MoreHorizontal, Share2 } from "lucide-react"
import { ShareDialog } from "../share-dialog/ShareDialog"
import { Link } from "@chakra-ui/next-js"
import { Fragment } from "react"
import { ItemTagView } from "./ItemTagView"
import { HorizontalScrollShadow } from "../common/HorizontalScrollShadow"

const imageSize = 16

type ItemProp = Item & { collection: Collection & { user: User } } & { images: ItemImage[] } & { tags: (ItemTag & { tag: Tag })[] }

type Props = {
  items: ItemProp[]
}
export const ItemTable = ({ items }: Props) => {
  const hover = useColorModeValue('gray.200', 'gray.600')
  return <Card boxShadow='md'>
    <VStack border='0' rounded="md" spacing={0} overflow='hidden'>
      {items.map((item, i) => <Fragment key={item.id}>
        <HStack width='100%' _hover={{ bg: hover }} spacing={4} role='group'>
          <Box>
            {item.images[0] !== undefined
              ? <ImageDisplay
                image={item.images[0]}
                borderRadius='full'
                boxSize={imageSize}
              />
              : <NoImage />}
          </Box>
          <Box minWidth='25%' flex={{ base: 1, md: 0 }}>
            <Text fontWeight={600} overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
              {item.name}
            </Text>
          </Box>
          <Flex
            direction='row'
            my={2}
            gap={2}
            flex={1}
            overflowX='scroll'
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
            as={HorizontalScrollShadow}
            display={{ base: 'none', md: 'flex' }}
          >
            {/* margin-left: auto on first child because "justify-items: end" breaks */}
            {item.tags.map((tag, i) => <ItemTagView flex='none' key={tag.id} tag={tag.tag} />)}
          </Flex>
          <ButtonGroup mx={4} flexShrink={0}>
            <Menu>
              <MenuButton variant='ghost' as={IconButton} icon={<Icon as={MoreHorizontal} />} />
              <MenuList p={0} minWidth='4xs'>
                <ShareDialog
                  buttonProps={{ leftIcon: <Icon as={Share2} />, variant: 'ghost', width: '100%', borderRadius: 0 }}
                  username={item.collection.user.username}
                  collectionSlug={item.collection.slug}
                  itemSlug={item.slug}
                />
                <Button
                  width='100%'
                  borderRadius={0}
                  leftIcon={<Icon as={Edit} />}
                  variant='ghost'
                  as={Link}
                  href={`/my/${item.collection.slug}/${item.slug}/edit`}>
                  Edit
                </Button>
              </MenuList>
            </Menu>
            <IconButton
              aria-label='open item'
              variant='ghost'
              icon={<Icon as={ExternalLink} />}
              as={Link}
              href={`/my/${item.collection.slug}/${item.slug}`} />
          </ButtonGroup>
        </HStack>
        {items.length - 1 !== i && <Divider m={0} />}
      </Fragment>)
      }
    </VStack >
  </Card >
}

const NoImage = () => {
  const bg = useColorModeValue('gray.200', 'gray.600')
  const ic = useColorModeValue('gray.500', 'gray.300')
  return <Box bg={bg} boxSize={imageSize} display='flex' alignItems='center' justifyContent='center'>
    <Icon color={ic} as={Image} boxSize={8} />
  </Box>
}