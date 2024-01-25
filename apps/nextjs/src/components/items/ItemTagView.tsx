import { Tag, TagLabel, TagLeftIcon, type TagProps } from "@chakra-ui/react"
import { HashIcon } from "lucide-react"

type TagLike = {
  id: string
  text: string
}
type Props = {
  tag: TagLike
} & TagProps
export const ItemTagView = ({ tag, ...rest }: Props) => {
  return <Tag key={tag.id} colorScheme='secondary' {...rest}>
    <TagLeftIcon as={HashIcon} />
    <TagLabel>{tag.text}</TagLabel>
  </Tag>
}