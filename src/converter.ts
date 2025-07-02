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
import { TEMP_HTML, TEMP_MD } from './constants'

export async function convertDocxToHtml(options: Options) {
  const { workspace, pandoc, docx } = options

  if (!pandoc) {
    p.outro(c.red('pandoc not found, aborting'))
    process.exit(1)
  }

  if (!docx) {
    p.outro(c.red('docx not found, aborting'))
    process.exit(1)
  }

  if (!(await exists(resolve(workspace))))
    await mkdir(resolve(workspace))

  await execa(
    pandoc,
    [
      docx,
      '-o',
      resolve(workspace, TEMP_MD),
      `--extract-media=${resolve(workspace, 'images')}`,
      '-t',
      'markdown_strict',
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
      resolve(workspace, TEMP_MD),
      '-s',
      '-o',
      resolve(workspace, TEMP_HTML),
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
  turndownService.addRule('strong', {
    filter: ['strong', 'b'],
    replacement(content) {
      return `**${content}** `
    },
  })
  turndownService.addRule('image', {
    filter: ['img'],
    replacement(_, node) {
      const src = node.getAttribute('src')?.replace?.(`${workspace}/`, './') || ''
      const alt = node.getAttribute('alt') || ''
      const style = node.getAttribute('style') || ''

      return `<img src="${src}" alt="${alt}" style="${style};display:inline-block;">`
    },
  })

  const markdown = turndownService.turndown($.html())
  await writeFile(resolve(workspace, TEMP_MD), markdown)
}
