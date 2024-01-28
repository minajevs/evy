import { TagLeftIcon } from "@chakra-ui/react"
import { type MultiValue, type OptionBase, Select, chakraComponents } from "chakra-react-select"
import { HashIcon } from "lucide-react"
import { useEffect, useState } from "react"

export type TagLike = {
  id: string
  text: string
}
type SelectOption = { value: string, label: string } & OptionBase

const tagToOption = (tag: TagLike): SelectOption => ({ value: tag.id, label: tag.text })
const optionToTag = (option: SelectOption): TagLike => ({ id: option.value, text: option.label })

type Props = {
  filter: TagLike[] | null
  tags: TagLike[]
  onTagsChange: (tags: TagLike[] | null) => void
}
export const TagsSelect = ({ filter, tags, onTagsChange }: Props) => {
  const [tagsFilter, setTagsFilter] = useState<TagLike[] | null>(filter)
  const [state, setState] = useState<MultiValue<SelectOption>>(tagsFilter?.map(tagToOption) ?? [])

  const onChange = (options: MultiValue<SelectOption>) => {
    setState(options)
    const tags = options.map(optionToTag)
    setTagsFilter(tags.length > 0 ? tags : null)
    onTagsChange(tags.length > 0 ? tags : null)
  }

  useEffect(() => {
    setState(filter?.map(tagToOption) ?? [])
    setTagsFilter(filter)
  }, [filter])

  return <Select<SelectOption, true>
    key='tags-select'
    instanceId='select-box'
    colorScheme='secondary'
    isMulti
    onChange={onChange}
    components={{
      MultiValueContainer: ({ children, ...props }) => (
        // TODO: Replace with pure <ItemTagView /> component?
        <chakraComponents.MultiValueContainer {...props}>
          <TagLeftIcon as={HashIcon} />
          {children}
        </chakraComponents.MultiValueContainer>
      ),
      Option: ({ children, ...props }) => (
        <chakraComponents.Option {...props}>
          <TagLeftIcon as={HashIcon} />
          {children}
        </chakraComponents.Option>
      )
    }}
    value={state}
    options={tags.map(tagToOption)}
  />
}