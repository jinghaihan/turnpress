import type TurndownService from 'turndown'

export function strikethrough(turndownService: TurndownService) {
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement(content) {
      return `~${content}~`
    },
  })
}
