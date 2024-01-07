import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'

if (typeof window !== 'undefined') {
  // Markdown parser and sanitizer are expensive functions
  // and hopefully should only be used on serverside (SSR)
  throw Error('`markdownToSafeHTML` should not be imported on the client side.')
}

// TODO: consider moving markdown stuff out of DB package

const jsdomWindow = new JSDOM('').window
const purify = createDOMPurify(jsdomWindow)

// Add target='_blank' rel='noopener noreferrer' to
purify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

marked.use({
  breaks: true,
})

export const markdownToSafeHTML = (value: string) => {
  console.log(value)
  const html = marked.parse(value.replaceAll(/\n(?=\n)/g, '<p><br></p>'), {
    async: false,
  }) as string
  const sanitizedHtml = purify.sanitize(html)

  return sanitizedHtml.replaceAll('<p><br></p><br>', '<p><br></p>')
}
