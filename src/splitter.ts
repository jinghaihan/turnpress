import type { ConvertOptions, HeadingNode } from './types'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { OUTPUT_DIR } from './constants'

export async function splitMarkdown(options: ConvertOptions) {
  const { cwd = process.cwd(), outputDir = OUTPUT_DIR } = options

  const mdText = await readFile(path.join(cwd, outputDir, 'index.md'), 'utf-8')

  const lines = mdText.split('\n')
  const headings: HeadingNode[] = []

  let currentHeading: HeadingNode | null = null
  let contentBuffer: string[] = []

  for (const line of lines) {
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const match = line.match(/^(#{1,6})\s+(.*)$/)

    if (match) {
      if (currentHeading) {
        currentHeading.content = contentBuffer.join('\n').trim()
        headings.push(currentHeading)
        contentBuffer = []
      }

      const level = match[1]!.length
      const rawTitle = match[2]!.trim()
      const title = rawTitle.replace(/^\d+(?:\.\d+)*\.?\s+/, '')

      currentHeading = {
        level,
        rawTitle,
        title,
        content: '',
        children: [],
      }
    }
    else {
      contentBuffer.push(line)
    }
  }

  if (currentHeading) {
    currentHeading.content = contentBuffer.join('\n').trim()
    headings.push(currentHeading)
  }

  const resolved = nested(headings)
  await generateArticle(resolved, options)

  return resolved
}

async function generateArticle(headings: HeadingNode[], options: ConvertOptions) {
  const { cwd = process.cwd(), outputDir = OUTPUT_DIR } = options

  const write = async (title: string, content: string) => {
    const _content = `# ${title}\n\n${content}`
    await writeFile(path.join(cwd, outputDir, `${title}.md`), _content)
  }

  const traverse = (node: HeadingNode): string => {
    return `${node.content}\n${node.children.map((item) => {
      return `\n${'#'.repeat(item.level - 1)} ${item.title}\n${traverse(item)}`
    }).join('')}`
  }

  for (const item of headings) {
    if (!item.children.length) {
      await write(item.title, item.content)
      continue
    }

    for (const child of item.children) {
      const content = child.children.length
        ? traverse(child).trim()
        : child.content
      await write(child.title, content)
    }
  }
}

function nested(flatHeadings: HeadingNode[]): HeadingNode[] {
  const root: HeadingNode[] = []
  const stack: HeadingNode[] = []

  for (const heading of flatHeadings) {
    const node: HeadingNode = { ...heading, children: [] }

    while (stack.length > 0 && stack[stack.length - 1]!.level >= node.level)
      stack.pop()

    if (stack.length === 0)
      root.push(node)
    else
      stack[stack.length - 1]!.children.push(node)

    stack.push(node)
  }

  return root
}
