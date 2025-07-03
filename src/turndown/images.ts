import type TurndownService from 'turndown'

export function images(turndownService: TurndownService, replacement: (content: string) => string) {
  turndownService.addRule('images', {
    filter: ['img'],
    replacement(_, node) {
      const src = node.getAttribute('src')
      const alt = node.getAttribute('alt') || ''
      const style = node.getAttribute('style') || ''

      const srcText = replacement ? replacement(src) : src
      const styleText = style ? `style="${style};display:inline-block;"` : `style="display:inline-block;"`

      return `<img src="${srcText}" alt="${alt}" style="${styleText}">`
    },
  })
}
