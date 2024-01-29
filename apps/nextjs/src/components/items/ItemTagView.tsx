import { Button, Tag, TagLabel, TagLeftIcon, useColorModeValue, type TagProps } from "@chakra-ui/react"
import { HashIcon } from "lucide-react"
import { type MouseEventHandler } from "react"

type TagLike = {
  id: string
  text: string
}
type Props = {
  tag: TagLike
  onClick: MouseEventHandler<HTMLSpanElement>
} & TagProps
export const ItemTagView = ({ tag, children, onClick, ...rest }: Props) => {
  // TODO: whiteAlpha is incorrect here. Should be transparentize(secondary.300), but transparentize is deprecated in this release :(
  const hoverTag = useColorModeValue('secondary.200', 'whiteAlpha.400')
  const activeTag = useColorModeValue('secondary.300', 'whiteAlpha.500')

  return <Tag
    key={tag.id}
    colorScheme='secondary'
    as={Button}
    _hover={{ bg: hoverTag }}
    _active={{ bg: activeTag }}
    height='unset'
    onClick={onClick}
    {...rest}
  >
    <TagLeftIcon as={HashIcon} />
    <TagLabel>{tag.text}</TagLabel>
    {children}
  </Tag>
}