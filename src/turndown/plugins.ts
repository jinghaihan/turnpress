import type TurndownService from 'turndown'
import { highlightedCodeBlock } from './highlighted-code-block'
import { strikethrough } from './strikethrough'
import { strong } from './strong'
import { tables } from './tables'
import { taskListItems } from './task-list-items'

export function plugins(turndownService: TurndownService) {
  turndownService.use([
    highlightedCodeBlock,
    strikethrough,
    strong,
    tables,
    taskListItems,
  ])
}
