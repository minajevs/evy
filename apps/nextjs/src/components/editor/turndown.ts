import TurndownService from 'turndown'

const service = new TurndownService()

service.addRule('shiftEnter', {
  filter: function (node) {
    return node.nodeName === 'BR' && !!isShiftEnter(node)
  },
  replacement: function () {
    return '<br>'
  },
})

service.addRule('enter', {
  filter: function (node) {
    return node.nodeName === 'BR' && !isShiftEnter(node)
  },
  replacement: function () {
    return '<p><br></p>'
  },
})

// ignore em because it cannot be mixed with strong
service.addRule('ignoreEmphasized', {
  filter: 'em',
  replacement: function (content) {
    return content
  },
})

export const turndown = (html: string) => {
  const result = service.turndown(html)

  return result
}

function isShiftEnter(node: HTMLElement) {
  let currentNode: HTMLElement | null | ParentNode = node

  while (currentNode != null && currentNode.nodeType !== 1) {
    currentNode = currentNode.parentElement || currentNode.parentNode
  }

  return (
    currentNode &&
    currentNode.nodeType === 1 &&
    currentNode.parentElement &&
    currentNode.parentElement.childNodes.length !== 1 // normal enter is <p><br><p> (p has exactly one childNode)
  )
}

export default turndown
