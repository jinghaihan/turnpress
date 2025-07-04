import type { Image, Options } from './types'
import { readFile, writeFile } from 'node:fs/promises'
import * as p from '@clack/prompts'
import { basename, dirname, extname, resolve } from 'pathe'
import { TEMP_MARKDOWN } from './constants'
import { copy } from './utils'

export async function markdownMediaExtractor(options: Options): Promise<void> {
  const { workspace } = options

  const markdownPath = resolve(workspace, TEMP_MARKDOWN)
  const targetMediaDir = resolve(workspace, './assets/media')

  p.log.step('Extracting media from Markdown')
  const markdownContent = await readFile(markdownPath, 'utf-8')
  const images = parseMarkdownImages(dirname(markdownPath), markdownContent)

  p.log.step(`Copying ${images.length} images to workspace`)
  await Promise.all(
    images.map(image => copy(image.path, resolve(targetMediaDir, image.name))),
  )

  p.log.step('Updating Markdown image references')
  await writeFile(markdownPath, updateImageReferences(markdownContent, images))
}

function updateImageReferences(markdown: string, images: Image[]): string {
  return images.reduce((content, image) => {
    return content.replaceAll(
      image.url,
      `./assets/media/${image.name}`,
    )
  }, markdown)
}

export function parseMarkdownImages(basePath: string, markdown: string): Image[] {
  // Match both markdown image syntax ![alt](src) and HTML <img> tags
  const imageRegex = /(!\[([^\]]*)\]\(([^)]+)\))|(<img[^>]+src=["']([^"']+)["'][^>]*>)/gi
  const images: Image[] = []

  const cache = new Set()
  const counter = new Map<string, number>()

  const getImageName = (name: string) => {
    const count = counter.get(name)!
    if (count === 1)
      return name

    const ext = extname(name)
    return `${name.slice(0, -ext.length)}-${count}${ext}`
  }

  for (const match of markdown.matchAll(imageRegex)) {
    const isMarkdownSyntax = !!match[1]
    const altText = isMarkdownSyntax ? match[2] : ''
    const imageUrl = isMarkdownSyntax ? match[3] : match[5]

    if (!imageUrl)
      continue

    // skip duplicates
    if (cache.has(imageUrl))
      continue
    cache.add(imageUrl)

    const name = basename(imageUrl)
    if (counter.has(name))
      counter.set(name, counter.get(name)! + 1)
    else
      counter.set(name, 1)

    images.push({
      name: getImageName(name),
      url: imageUrl,
      path: resolve(basePath, imageUrl),
      alt: altText,
    })
  }

  return images
}
