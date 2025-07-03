import type TurndownService from 'turndown'

const highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/

export function highlightedCodeBlock(turndownService: TurndownService) {
  turndownService.addRule('highlightedCodeBlock', {
    filter(node) {
      const firstChild = node.firstChild
      return (
        node.nodeName === 'DIV'
        && highlightRegExp.test(node.className)
        && firstChild
        && firstChild.nodeName === 'PRE'
      )
    },
    replacement(content, node, options) {
      const className = node.className || ''
      const language = (className.match(highlightRegExp) || [null, ''])[1]

      return (
        `\n\n${options.fence}${language}\n${
          node.firstChild.textContent
        }\n${options.fence}\n\n`
      )
    },
  })
}
