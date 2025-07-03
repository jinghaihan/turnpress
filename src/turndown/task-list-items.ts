import type TurndownService from 'turndown'

export function taskListItems(turndownService: TurndownService) {
  turndownService.addRule('taskListItems', {
    filter(node) {
      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI'
    },
    replacement(content, node) {
      return `${node.checked ? '[x]' : '[ ]'} `
    },
  })
}
