import { EditableInput, type EditableInputProps, Editable, EditablePreview, useEditableState } from "@chakra-ui/react"
import { useEffect } from "react"

type Props = {
  edit: boolean
  defaultValue: string
  inputProps?: EditableInputProps
}

export const EditText = ({ edit, defaultValue }: Props) => {
  const { onEdit, onSubmit } = useEditableState()
  useEffect(() => edit ? onEdit() : onSubmit(), [edit, onEdit, onSubmit])

  return <Editable value={defaultValue} isPreviewFocusable={false} startWithEditView={edit}>
    <EditablePreview />
    <EditableInput />
  </Editable>
}