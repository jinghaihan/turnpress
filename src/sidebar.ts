import type { HeadingNode, Options } from './types'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'pathe'

export async function generateSidebar(headings: HeadingNode[], options: Options) {
  const { workspace } = options

  const sidebar = headings.map((item) => {
    const items = item.children.map((child) => {
      return {
        text: child.title,
        link: child.title,
      }
    })
    return {
      text: item.title,
      link: item.children.length ? undefined : item.title,
      items: items.length ? items : undefined,
      collapsed: items.length ? false : undefined,
    }
  })

  await writeFile(resolve(workspace, 'sidebar.json'), JSON.stringify(sidebar, null, 2))
}
