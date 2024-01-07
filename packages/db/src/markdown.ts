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
  if ('target' in node) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

marked.use({
  breaks: false,
})

export const markdownToSafeHTML = (value: string) => {
  const html = marked.parse(value, {
    async: false,
  }) as string
  const sanitizedHtml = purify.sanitize(html)

  return sanitizedHtml
}
