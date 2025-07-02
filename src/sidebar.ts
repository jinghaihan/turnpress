import type { HeadingNode, ResolvedOptions } from './types'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function generateSidebar(headings: HeadingNode[], options: ResolvedOptions) {
  const { cwd, workspace } = options

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

  await writeFile(path.join(cwd, workspace, 'sidebar.json'), JSON.stringify(sidebar, null, 2))
}
