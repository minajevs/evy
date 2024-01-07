import {
  $convertFromMarkdownString,
  TRANSFORMERS,
  type ElementTransformer,
} from '@lexical/markdown'
import { $createParagraphNode, ParagraphNode } from 'lexical'

export const LINE_BREAK_FIX: ElementTransformer = {
  dependencies: [ParagraphNode],
  export: (node) => {
    return null
  },
  regExp: /^$/,
  replace: (textNode, nodes, _, isImport) => {
    if (isImport && nodes.length === 1) {
      nodes[0]!.replace($createParagraphNode())
    }
  },
  type: 'element',
}

const transformers = [LINE_BREAK_FIX, ...TRANSFORMERS]

export const convertFromMarkdownString = (value: string) => {
  return $convertFromMarkdownString(value, transformers)
}
