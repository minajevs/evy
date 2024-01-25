import { Button, Flex, Icon, Input, Popover, PopoverAnchor, PopoverBody, PopoverContent, Tag, TagCloseButton, TagLabel, TagLeftIcon, useBoolean } from "@chakra-ui/react"
import { Check, TagIcon } from "lucide-react"
import { useOutsideClick } from '@chakra-ui/react'
import { useRef, useState } from "react"
import useTextWidth from "~/utils/useTextWidth"
import { type Tag as DbTag } from "@evy/db"

function onlyUnique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

export type NewItemTag = Pick<DbTag, 'text' | 'id'>

type Props = {
  tags: (DbTag | NewItemTag)[]
  collectionTags: DbTag[]
  onSave: (tag: NewItemTag) => void
}
export const ItemTagInput = ({ collectionTags, tags, onSave }: Props) => {
  const ref = useRef(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputText, setInputText] = useState('')
  const [valid, setValid] = useState(false)
  const width = useTextWidth({ ref: inputRef, text: inputText })
  const [hasFocus, { on, off }] = useBoolean(false)

  const onClose = () => {
    setInputText('')
    setValid(false)
  }

  const validate = (value: string) => value.length > 0 && tags.every(tag => tag.text !== value)

  const onChange = (value: string) => {
    setInputText(value)
    setValid(validate(value))
  }

  const onSelect = (value: string) => {
    if (!validate(value)) return
    // Save mock tag with mock ID. Will be populated on save in backend
    onSave({ text: value, id: Date.now().toString() })
    onClose()
  }

  const onKeyDown = (code: string) => {
    if (code === 'Enter') handleSave()
    if (code === 'Escape') onClose()
  }

  useOutsideClick({
    ref: ref,
    handler: onClose,
  })

  const handleSave = () => {
    if (!valid) return
    // Save mock tag with mock ID. Will be populated on save in backend
    onSave({ text: inputText, id: Date.now().toString() })
    onClose()
  }

  const minWidth = 75
  // width = textWidth * 0.922 + 8
  // 0.922 is a magic constant to fix incorrectly calculted text width
  // 4 is "padding-right: 2"
  const calculatedWidth = isNaN(width) ? minWidth : Math.max(width * 0.923 + 8, minWidth)


  const maxOptions = 5
  const collectionOptions = collectionTags
    .filter(tag => !tags.some(x => x.text === tag.text))
    .filter(tag => tag.text.includes(inputText))
    .slice(0, maxOptions)
  const existingOptions = inputText.length > 0 ? tags.filter(tag => tag.text.startsWith(inputText)) : []

  return <Tag ref={ref} variant='outline' colorScheme='secondary' height='unset'>
    <TagLeftIcon as={TagIcon} />
    <Popover
      isOpen={hasFocus && (existingOptions.length > 0 || collectionOptions.length > 0)}
      initialFocusRef={inputRef}
    >
      <PopoverAnchor>
        <Input
          placeholder="new tag"
          variant='unstyled'
          width={`${calculatedWidth}px`}
          ref={inputRef}
          value={inputText}
          onChange={e => onChange(e.currentTarget.value)}
          onSubmit={handleSave}
          onKeyDown={e => onKeyDown(e.code)}
          isInvalid={!valid}
          onFocus={on}
          onBlur={off}
        />
      </PopoverAnchor>
      <PopoverContent maxW='100%' w="full" maxWidth='90vw'>
        <PopoverBody as={Flex} gap={2} flexWrap='wrap'>
          {existingOptions.map(tag => (
            <Tag key={tag.id} height='unset' colorScheme='secondary'>
              <TagLeftIcon as={TagIcon} />
              <TagLabel>{tag.text}</TagLabel>
            </Tag>
          ))}
          {
            collectionOptions.map(tag => (
              <Tag key={tag.id} height='unset' as={Button} colorScheme='secondary' variant='outline' onClick={() => {
                onSelect(tag.text)
              }}>
                <TagLeftIcon as={TagIcon} />
                <TagLabel>{tag.text}</TagLabel>
              </Tag>
            ))
          }
        </PopoverBody>
      </PopoverContent>
    </Popover>

    <TagCloseButton mr={1} height='unset' boxSize={4} onClick={handleSave} visibility={valid ? 'visible' : 'hidden'}><Icon as={Check} boxSize={4} /></TagCloseButton>
  </Tag>
}