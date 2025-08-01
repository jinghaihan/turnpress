import type { HeadingNode, Options } from './types'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'pathe'
import { TEMP_MARKDOWN } from './constants'

export async function splitMarkdown(options: Options) {
  const { workspace } = options

  const mdText = await readFile(resolve(workspace, TEMP_MARKDOWN), 'utf-8')

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
      // eslint-disable-next-line regexp/optimal-quantifier-concatenation
      const title = rawTitle.replace(/^([\d.\\]+)\.?\s+/, '')
        .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold **text**
        .replace(/\*(.*?)\*/g, '$1') // remove italic *text*
        .replace(/~~(.*?)~~/g, '$1') // remove strikethrough ~~text~~
        .replace(/`(.*?)`/g, '$1') // remove inline code `text`
        .replace(/_{1,2}(.*?)_{1,2}/g, '$1') // remove underline _text_ or __text__
        .trim()

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

  const nested = generateNested(headings)
  await generateArticle(nested, options)

  return nested
}

async function generateArticle(headings: HeadingNode[], options: Options) {
  const { workspace } = options

  const write = async (title: string, content: string) => {
    await writeFile(resolve(workspace, `${title}.md`), `# ${title}\n\n${content}`)
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

function generateNested(flatHeadings: HeadingNode[]): HeadingNode[] {
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
