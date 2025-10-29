/* eslint-disable regexp/no-dupe-disjunctions */
import type { Options } from './types'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import * as cheerio from 'cheerio'
import { execa } from 'execa'
import { exists } from 'fs-extra'
import { resolve } from 'pathe'
import TurndownService from 'turndown'
import { TEMP_HTML, TEMP_MARKDOWN } from './constants'
import { images } from './turndown/images'
import { turndownPlugins } from './turndown/plugins'

export async function convertDocxToHtml(options: Options) {
  const { workspace, pandoc, docx } = options

  if (!pandoc) {
    p.outro(c.red('Pandoc not found, aborting'))
    process.exit(1)
  }

  if (!docx) {
    p.outro(c.red('Docx not found, aborting'))
    process.exit(1)
  }

  const e = await exists(resolve(workspace))
  if (!e)
    await mkdir(resolve(workspace))

  await execa(
    pandoc,
    [
      docx,
      '-o',
      resolve(workspace, TEMP_MARKDOWN),
      `--extract-media=${resolve(workspace, 'assets')}`,
      '-t',
      'markdown+startnum',
      '--wrap=preserve',
    ],
    {
      shell: true,
      stdio: 'inherit',
    },
  )

  await execa(
    pandoc,
    [
      resolve(workspace, TEMP_MARKDOWN),
      '-s',
      '-o',
      resolve(workspace, TEMP_HTML),
      '-f',
      'markdown+startnum',
    ],
    {
      shell: true,
      stdio: 'inherit',
    },
  )
}

async function loadAndFixHtml(path: string) {
  const html = await readFile(path, 'utf-8')

  const fixed = html
    .replace(/[“”]([^“”]*)[“”]/g, (_, p) => `“${p}”`) // fix chinese double quotes

  return fixed
}

export async function convertHtmlToMarkdown(options: Options) {
  const { workspace } = options

  const html = await loadAndFixHtml(resolve(workspace, TEMP_HTML))
  const $ = cheerio.load(html)
  $('title, style, figcaption').remove()

  const turndownService = new TurndownService({ headingStyle: 'atx' })
  turndownService
    .use(turndownPlugins)
    .use((t: TurndownService) => images(t, (src: string) => src.replace(workspace, '.')))

  const markdown = turndownService.turndown($.html())

  await writeFile(resolve(workspace, TEMP_MARKDOWN), await normalizeMarkdown(markdown))
}

export async function normalizeMarkdown(markdown: string) {
  const content = markdown
    .replace(/^[ \t]+(<img[^>]*>)$/gm, '$1') // trim leading spaces for images that are on their own line
    .replace(/^[ \t]+(?![`*\-+>\d.\s]|```)/gm, '') // trim leading spaces for text lines (but preserve code blocks, lists, and blockquotes)
    .replace(/^[ \t]+(\d+、)/gm, '$1') // remove leading spaces before Chinese enumeration like "1、"
    .replace(/^(\s*)(\d+)、\s*/gm, '$1$2. ') // convert Chinese enumeration "1、" to markdown numbered list "1."
    .replace(/^(>\s*)\\?\*/gm, '$1') // remove asterisk (escaped or not) after blockquote marker

  try {
    const { default: prettier } = await import('prettier')
    return await prettier.format(content, { parser: 'markdown' })
  }
  catch {
    return content
  }
}
