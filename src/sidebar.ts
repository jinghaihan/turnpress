import type { ConvertOptions, HeadingNode } from './types'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { OUTPUT_DIR } from './constants'

export async function generateSidebar(headings: HeadingNode[], options: ConvertOptions) {
  const { cwd = process.cwd(), outputDir = OUTPUT_DIR } = options

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

  await writeFile(path.join(cwd, outputDir, 'sidebar.json'), JSON.stringify(sidebar, null, 2))
}
