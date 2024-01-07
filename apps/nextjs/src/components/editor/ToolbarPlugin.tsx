import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { mergeRegister } from "@lexical/utils"
import { $generateNodesFromDOM } from "@lexical/html"
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, FORMAT_TEXT_COMMAND, $getRoot, $insertNodes } from "lexical"
import { useCallback, useEffect, useState } from "react"
import { ButtonGroup, type ButtonProps, Icon, IconButton, useColorModeValue } from "@chakra-ui/react"
import { FiBold, FiItalic, FiLink } from "react-icons/fi"
import { LOW_PRIORITY, getSelectedNode } from "./utils"
import { createPortal } from "react-dom"
import { FloatingLinkEditor } from "./FloatingLinkEditor"
import { type IconType } from "react-icons"

type Props = {
  value: string
}
export const ToolbarPlugin = ({ value }: Props) => {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isLink, setIsLink] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar()
          return false
        },
        LOW_PRIORITY
      )
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser()
      const dom = parser.parseFromString(value, "text/html")

      const nodes = $generateNodesFromDOM(editor, dom);

      $getRoot().clear().select()
      $insertNodes(nodes)
    })
  }, [editor, value])

  const insertLink = useCallback(() => {
    console.log('link!')
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink])

  return <ButtonGroup isAttached variant='outline'>
    <ToolbarButton
      label="bold"
      isActive={isBold}
      icon={FiBold}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      borderBottomLeftRadius={0}
    />
    <ToolbarButton
      label="italic"
      isActive={isItalic}
      icon={FiItalic}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
    />
    <ToolbarButton
      label="link"
      isActive={isLink}
      icon={FiLink}
      onClick={insertLink}
      borderBottomRightRadius={0}
    />
    {isLink ? createPortal(<FloatingLinkEditor editor={editor} />, document.body) : null}
  </ButtonGroup>
}

type ToolbarButtonProps = {
  label: string
  isActive: boolean
  onClick: () => void
  icon: IconType
} & ButtonProps
const ToolbarButton = ({ label, isActive, onClick, icon, ...rest }: ToolbarButtonProps) => (
  <IconButton
    boxSizing="content-box"
    borderBottom={0}
    aria-label={label}
    isActive={isActive}
    icon={<Icon as={icon} />}
    onClick={onClick}
    _hover={{
      bg: useColorModeValue('gray.200', 'whiteAlpha.300')
    }}
    {...rest}
  />
)
