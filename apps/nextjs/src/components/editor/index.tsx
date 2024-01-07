import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { forwardRef, useEffect, useState } from 'react'
import { ParagraphNode, type EditorState, type SerializedParagraphNode, $createParagraphNode, type LexicalEditor, TextNode } from 'lexical'
import { Box, Textarea } from '@chakra-ui/react'
import { ToolbarPlugin } from './ToolbarPlugin'
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { CustomAutoLinkPlugin } from './AutoLinkPlugin'
import { Prose } from '@nikolovlazar/chakra-ui-prose'
import { $generateHtmlFromNodes } from "@lexical/html"

import turndown from './turndown'
import { CustomTextNode } from './customTextNode'

export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node: ParagraphNode) {
    return new CustomParagraphNode(node.__key);
  }

  static importJSON(serializedNode: SerializedParagraphNode) {
    const node = $createParagraphNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'custom-paragraph',
      version: 1,
    };
  }

  exportDOM(editor: LexicalEditor) {
    const { element } = super.exportDOM(editor);

    return {
      element,
    };
  }
}


const config: InitialConfigType = {
  namespace: 'Editor',
  theme: {},
  onError(error: Error) {
    throw error
  },
  nodes: [
    AutoLinkNode,
    LinkNode,
    CustomTextNode,
    {
      replace: TextNode,
      with: (node) => {
        return new CustomTextNode(node.__text);
      }
    }
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

function OnChangePlugin({ onChange }: { onChange: (state: [EditorState, string]) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor).replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        onChange([editorState, html])
      })
    })
  }, [editor, onChange])

  return null
}

EditorCapturePlugin.displayName = 'EditorCapturePlugin'

type Props = {
  name: string
  value: string | null | undefined
  onValueChange: (value: string) => void
}
export const Editor = forwardRef(({ name, value, onValueChange }: Props, ref) => {
  const [editorState, setEditorState] = useState<EditorState>()

  function onChange([editorState, html]: [EditorState, string]) {
    setEditorState(editorState)
    onValueChange(turndown(html))
    console.log(turndown(html))
  }

  return (
    <LexicalComposer initialConfig={{
      ...config,
    }}>
      <ToolbarPlugin value={value ?? ''} />
      <RichTextPlugin
        contentEditable={
          <Prose>
            <Textarea
              as={ContentEditable}
              height='auto'
              minHeight='7rem'
              borderTopLeftRadius={0}
              name={name}
              overflowY="scroll"
              placeholder='Description'
            />
          </Prose>
        }
        placeholder={<Box pointerEvents='none' mt='-6.5rem' pl='1rem' pb='5rem' color='chakra-placeholder-color' opacity={0.5}>Enter some text...</Box>}
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