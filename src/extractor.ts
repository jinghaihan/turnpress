import type { Image, Options } from './types'
import { readFile, writeFile } from 'node:fs/promises'
import * as p from '@clack/prompts'
import { nanoid } from 'nanoid'
import { dirname, extname, resolve } from 'pathe'
import { TEMP_MARKDOWN } from './constants'
import { copy } from './utils'

const generateImageName = (image: Image): string => `${image.id}${extname(image.url)}`

export async function markdownMediaExtractor(options: Options): Promise<void> {
  const { workspace } = options

  const markdownPath = resolve(workspace, TEMP_MARKDOWN)
  const targetMediaDir = resolve(workspace, './assets/media')

  p.log.step('Extracting media from Markdown')
  const markdownContent = await readFile(markdownPath, 'utf-8')
  const images = parseMarkdownImages(dirname(markdownPath), markdownContent)

  p.log.step(`Copying ${images.length} images to workspace`)
  await Promise.all(
    images.map(image => copy(image.url, resolve(targetMediaDir, generateImageName(image)))),
  )

  p.log.step('Updating Markdown image references')
  await writeFile(markdownPath, updateImageReferences(markdownContent, images))
}

function updateImageReferences(markdown: string, images: Image[]): string {
  return images.reduce((content, image) => {
    return content.replaceAll(
      image.rawUrl,
      `./assets/media/${generateImageName(image)}`,
    )
  }, markdown)
}

export function parseMarkdownImages(basePath: string, markdown: string): Image[] {
  // Match both markdown image syntax ![alt](src) and HTML <img> tags
  const imageRegex = /(!\[([^\]]*)\]\(([^)]+)\))|(<img[^>]+src=["']([^"']+)["'][^>]*>)/gi
  const images: Image[] = []

  for (const match of markdown.matchAll(imageRegex)) {
    const isMarkdownSyntax = !!match[1]
    const altText = isMarkdownSyntax ? match[2] : ''
    const imageUrl = isMarkdownSyntax ? match[3] : match[5]

    if (!imageUrl)
      continue

    images.push({
      id: nanoid(),
      name: altText,
      rawUrl: imageUrl,
      url: resolve(basePath, imageUrl),
    })
  }

  return images
}
