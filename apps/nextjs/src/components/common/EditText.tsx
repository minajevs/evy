import { Input, type InputProps, Text, EditableInput, type EditableInputProps, Editable, EditablePreview, useEditableState, useEditable } from "@chakra-ui/react"
import { useEffect } from "react"

type Props = {
  edit: boolean
  defaultValue: string
  inputProps?: EditableInputProps
}

export const EditText = ({ edit, defaultValue, inputProps = {} }: Props) => {
  const { onEdit, onSubmit } = useEditableState()
  useEffect(() => edit ? onEdit() : onSubmit(), [edit])

  return <Editable value={defaultValue} isPreviewFocusable={false} startWithEditView={edit}>
    <EditablePreview />
    <EditableInput />
  </Editable>
}