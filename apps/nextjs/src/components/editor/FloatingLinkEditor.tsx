import { $getSelection, $isRangeSelection, type EditorState, type BaseSelection, type GridSelection, type NodeSelection, type RangeSelection, SELECTION_CHANGE_COMMAND, type LexicalEditor } from "lexical"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { mergeRegister } from "@lexical/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import { LOW_PRIORITY, getSelectedNode } from "./utils"
import { Box, Input } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"

type Props = {
  editor: LexicalEditor
}
export const FloatingLinkEditor = ({ editor }: Props) => {
  const editorRef = useRef<HTMLInputElement>(null)
  const mouseDownRef = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [lastSelection, setLastSelection] = useState<BaseSelection | RangeSelection | NodeSelection | GridSelection | null>(
    null
  )

  const bg = useBackgroundColor('navigation')

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl("")
      }
    }

    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection?.anchorNode || null)
    ) {
      const domRange = nativeSelection?.getRangeAt(0)
      let rect: DOMRect | undefined
      if (nativeSelection?.anchorNode === rootElement) {
        let inner: Element = rootElement
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange?.getBoundingClientRect()
      }
      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect || null)
      }

      setLastSelection(selection)
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null)
      setLastSelection(null)
      setLinkUrl("")
    }

    return true
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
        editorState.read(() => {
          updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LOW_PRIORITY
      )
    );
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    });
  }, [editor, updateLinkEditor])

  return <Box
    ref={editorRef}
    sx={{
      position: 'absolute',
      width: '100%',
      maxWidth: '300px',
      zIndex: 100
    }}
    borderWidth={1}
    bg={bg}
    borderRadius={16}
    p='6px'
    boxShadow='lg'
  >
    <Input
      sx={{
        display: 'block',
        position: 'relative'
      }}
      ref={inputRef}
      value={linkUrl}
      onChange={(event) => {
        setLinkUrl(event.target.value)
      }}
      borderRadius={10}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (lastSelection !== null) {
            if (linkUrl !== "") {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
            }
          }
        } else if (event.key === "Escape") {
          event.preventDefault()
        }
      }}
    />
  </Box>

}

function positionEditorElement(editor: HTMLInputElement, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.scrollY + 10}px`;
    editor.style.left = `${rect.left + window.scrollX - editor.offsetWidth / 2 + rect.width / 2}px`;
  }
}