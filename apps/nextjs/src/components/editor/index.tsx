import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { forwardRef, useEffect, useState } from 'react'
import { type EditorState } from 'lexical'
import { Textarea } from '@chakra-ui/react'
import { ToolbarPlugin } from './ToolbarPlugin'
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { CustomAutoLinkPlugin } from './AutoLinkPlugin'
import { Prose } from '@nikolovlazar/chakra-ui-prose'


import { convertFromMarkdownString, convertToMarkdownString } from './transformMarkdown'

const config: InitialConfigType = {
  namespace: 'Editor',
  theme: {},
  onError(error: Error) {
    throw error
  },
  nodes: [
    AutoLinkNode,
    LinkNode
  ]
}

const EditorCapturePlugin = forwardRef((props: any, ref: any) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    ref.current = editor;
    return () => {
      ref.current = null;
    };
  }, [editor, ref]);

  return null;
})

function OnChangePlugin({ onChange }: { onChange: (state: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState)
    })
  }, [editor, onChange])

  return null
}

EditorCapturePlugin.displayName = 'EditorCapturePlugin'

type Props = {
  name: string
  value: string
  onValueChange: (value: string) => void
}
export const Editor = forwardRef(({ name, value, onValueChange }: Props, ref) => {
  const [editorState, setEditorState] = useState<EditorState>()

  function onChange(editorState: EditorState) {
    setEditorState(editorState)
    editorState.read(() => {
      const markdown = convertToMarkdownString()
      console.log(markdown)
      onValueChange(markdown)
    })
  }

  return (
    <LexicalComposer initialConfig={{
      ...config,
      editorState: () => convertFromMarkdownString(value)
    }}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <Prose>
            <Textarea
              as={ContentEditable}
              height='auto'
              minHeight='100px'
              borderTopLeftRadius={0}
              resize='vertical'
              name={name}
              overflowY="scroll" />
          </Prose>
        }
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <EditorCapturePlugin ref={ref} />
      <LinkPlugin />
      <CustomAutoLinkPlugin />
      <HistoryPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  )
})

Editor.displayName = 'Editor'