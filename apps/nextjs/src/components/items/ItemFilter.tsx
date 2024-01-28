import { Circle, FormControl, FormLabel, Icon, IconButton, type IconButtonProps, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Portal, useColorModeValue } from '@chakra-ui/react'
import { ListFilter } from 'lucide-react'
import { useRef, useState } from 'react'
import { type TagLike, TagsSelect } from './TagsSelect'

type Props = {
  filter: TagLike[] | null
  tags: TagLike[]
  onTagsChange: (tags: TagLike[] | null) => void
} & Omit<IconButtonProps, 'filter' | 'aria-label'>
export const ItemFilter = ({ filter, tags, onTagsChange, ...rest }: Props) => {
  const [tagsFilter, setTagsFilter] = useState<TagLike[] | null>(filter)
  const popoverRef = useRef(null)

  const onChange = (tags: TagLike[] | null) => {
    setTagsFilter(tags)
    onTagsChange(tags)
  }

  const badgeBg = useColorModeValue('primary.500', 'priamry.200')

  return <Popover>
    <PopoverTrigger>
      <IconButton
        {...rest}
        aria-label='item filter'
        icon={<>
          <Icon as={ListFilter} />
          {
            tagsFilter !== null
              ? <Circle
                as='span'
                size={4}
                color='white'
                position='absolute'
                top={0}
                right={0}
                fontSize='0.8rem'
                bg={badgeBg}
                borderRadius='full'
                p={1}
              >
                {tagsFilter.length}
              </Circle>
              : null
          }
        </>
        }
      />
    </PopoverTrigger>
    <Portal>
      <PopoverContent width={{ base: 'sm', md: 'md' }}>
        <PopoverCloseButton />
        <PopoverBody ref={popoverRef}>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <TagsSelect filter={tagsFilter} tags={tags} onTagsChange={onChange} />
          </FormControl>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
}
