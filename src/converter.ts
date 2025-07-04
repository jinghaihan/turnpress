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
import { plugins } from './turndown/plugins'

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

export async function convertHtmlToMarkdown(options: Options) {
  const { workspace } = options

  const html = await readFile(resolve(workspace, TEMP_HTML), 'utf-8')
  const $ = cheerio.load(html)
  $('title, style').remove()

  const turndownService = new TurndownService({
    headingStyle: 'atx',
  })
  turndownService.use(plugins)
  turndownService.use((turndownService: TurndownService) => {
    images(turndownService, (src: string) => src.replace(workspace, '.'))
  })

  const markdown = turndownService.turndown($.html())
  await writeFile(resolve(workspace, TEMP_MARKDOWN), markdown)
}
