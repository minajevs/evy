# Choosing rich text editing software

User need to be able to use rich text editors when inputting data, e.g.

- Descriptions
- Comments
- Notes
- etc.

## Decision drivers

- Ability to render rich text on server side (via NextJS SSR)
  - Some data, e.g. collection descriptions, is mandatory for SEO and usability, meaning that it must be rendered on the server
- Ability to customize and style editor
  - Initially only a basic rich editor functionality is needed - text style, links
  - Look and feel should be following the app

## Context

There are no existing rich text editors which provide SSR out of the box. One way how to achieve it is reading rich text from DB, then converting it to HTML and then setting it on the page.

Cal.com uses [`lexical`](https://lexical.dev/) as an editor and saves data as markdown, then uses `markdown-it` to parse markdown to HTML, sanitizes html using `sanitize-html`, [replaces some tags inline to include necessary styles](https://github.com/calcom/cal.com/blob/main/packages/lib/markdownToSafeHTML.ts), and then sets HTML directly

```jsx
<div dangerouslySetInnerHTML={{ __html: event.description }} />
```

For chakra-ui there exists ready package:

https://github.com/nikolovlazar/chakra-ui-prose

This approach makes it easier to choose an editor, because it can be anything, which can then process result into HTML

## Options

### [TipTap](https://tiptap.dev/)

Most recommended option. Seems to include a lot of unnecessary features and mostly focuses on collaborative editing.

Supports html output out of the box, but does not support markdown.

Based on prosemirror project, which other editors target as well

### [Lexical](https://lexical.dev/)

Used by cal.com. Seems to be the most modern solution, made and supported by Meta/Facebook. Supports iOS in React Native.

Might be the best solution, considering it provides a lot of stuff out-of-the-box.

### [Slatejs](https://www.slatejs.org/examples/markdown-preview)

Modern, but beta editor. Supports markdown + html very well.

Tried to implement it: Nothing comes out of the box. Slate is very powerful, but requires developing everything manually, from scratch.

## Worse options

### Editorjs

Poor html/markdown support. Lesser options for customization
