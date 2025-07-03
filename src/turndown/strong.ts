import type TurndownService from 'turndown'

export function strong(turndownService: TurndownService) {
  turndownService.addRule('strong', {
    filter: ['strong', 'b'],
    replacement(content) {
      return `**${content}** `
    },
  })
}
