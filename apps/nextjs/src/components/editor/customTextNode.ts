import {
  TextNode,
  $createTextNode,
  type LexicalEditor,
  type SerializedTextNode,
} from 'lexical'

function wrapElementWith(element: HTMLElement, tag: string) {
  const el = document.createElement(tag)
  el.appendChild(element)
  return el
}

export class CustomTextNode extends TextNode {
  static getType() {
    return 'custom-text'
  }
  static clone(node: TextNode) {
    return new CustomTextNode(node.__text)
  }

  static importJSON(serializedNode: SerializedTextNode) {
    const node = $createTextNode(serializedNode.text)
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  exportJSON() {
    return {
      detail: this.getDetail(),
      format: this.getFormat(),
      mode: this.getMode(),
      style: this.getStyle(),
      text: this.getTextContent(),
      type: 'custom-text',
      version: 1,
    }
  }

  // This improves Lexical's basic text output in copy+paste plus
  // for headless mode where people might use Lexical to generate
  // HTML content and not have the ability to use CSS classes.
  exportDOM(editor: LexicalEditor) {
    let element = super.createDOM(editor._config)

    // This is the only way to properly add support for most clients,
    // even if it's semantically incorrect to have to resort to using
    // <b>, <u>, <s>, <i> elements.

    //element.removeAttribute('class')

    if (element !== null) {
      if (this.hasFormat('strikethrough')) {
        element = wrapElementWith(element, 's')
      }
      if (this.hasFormat('underline')) {
        element = wrapElementWith(element, 'u')
      }
      if (this.hasFormat('italic')) {
        element = wrapElementWith(element, 'i')
      }
    }

    return {
      element,
    }
  }
}
