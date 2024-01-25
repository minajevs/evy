import { Button, ButtonGroup, Flex, type FlexProps, Icon, Tag, TagCloseButton, TagLabel, TagLeftIcon, useBoolean } from "@chakra-ui/react"
import { type Tag as DbTag } from "@evy/db"
import { Edit, HashIcon, Save, X } from "lucide-react"
import { useState } from "react"
import { ItemTagInput, type NewItemTag } from "./ItemTagInput"
import { api } from "~/utils/api"
import { useAutoAnimate } from "@formkit/auto-animate/react"


type LocalTag = (DbTag | NewItemTag)

type Props = {
  itemId: string
  tags: (DbTag)[]
  collectionTags: DbTag[]
} & FlexProps
export const ItemTags = ({ itemId, collectionTags, tags, ...rest }: Props) => {
  const [localTags, setLocalTags] = useState<LocalTag[]>(tags)
  const [lastSaveTags, setLastSaveTags] = useState<LocalTag[]>(tags)
  const [editMode, { on, off }] = useBoolean()
  const [parent] = useAutoAnimate({ easing: 'ease-in-out', duration: 100 })


  const updateTagsMutation = api.item.updateTags.useMutation()

  const onAddTag = (tag: NewItemTag) => {
    // Add mock tag to local tags. Real data will be populated by backend
    setLocalTags(prev => [...prev, tag])
  }

  const onRemoveTag = (tagId: string) => {
    setLocalTags(prev => prev.filter(x => x.id !== tagId))
  }

  const onCancel = () => {
    off()
    setLocalTags(lastSaveTags)
  }

  const onSave = async () => {
    off()
    const savedTags = await updateTagsMutation.mutateAsync({
      itemId,
      tags: localTags
    })
    setLocalTags(savedTags.map(x => x.tag))
    setLastSaveTags(savedTags.map(x => x.tag))
  }

  if (editMode) return (
    <Flex gap={2} flexWrap='wrap' width='full' ref={parent} {...rest}>
      {localTags.map((tag, i) => <Tag key={i} colorScheme='secondary' textOverflow='clip'>
        <TagLeftIcon as={HashIcon} />
        <TagLabel overflow='unset' whiteSpace='nowrap' textOverflow='unset'>{tag.text}</TagLabel>
        <TagCloseButton height='unset' boxSize={4} onClick={() => onRemoveTag(tag.id)}><Icon as={X} boxSize={4} color="red" /></TagCloseButton>
      </Tag>
      )}
      <ItemTagInput collectionTags={collectionTags} tags={localTags} onSave={onAddTag} />
      <ButtonGroup isAttached>
        <Tag variant='ghost' colorScheme='secondary' height='unset' as={Button} justifyContent='left' onClick={onSave}>
          <TagLeftIcon as={Save} />
          <TagLabel mr={1}>save</TagLabel>
        </Tag>
        <Tag variant='ghost' colorScheme='secondary' height='unset' as={Button} justifyContent='left' onClick={onCancel}>
          <TagLeftIcon as={X} />
          <TagLabel mr={1}>cancel</TagLabel>
        </Tag>
      </ButtonGroup>
    </Flex>
  )

  return (<Flex gap={2} flexWrap='wrap' width='full' ref={parent} {...rest}>
    {/* Warning: Tags are defined inline here, and not in a separate component, 
      because this way auto-animation can animate change to edit mode
    */}
    {localTags.map((tag, i) => <Tag key={i} colorScheme='secondary'>
      <TagLeftIcon as={HashIcon} />
      <TagLabel overflow='unset' whiteSpace='nowrap' textOverflow='unset'>{tag.text}</TagLabel>
    </Tag>
    )}
    <Tag variant='ghost' colorScheme='secondary' height='unset' as={Button} justifyContent='left' onClick={on} color='gray.500'>
      <TagLeftIcon as={Edit} />
      <TagLabel mr={1}>edit tags</TagLabel>
    </Tag>
  </Flex>)
}