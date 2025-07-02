import type { ResolvedOptions } from './types'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import * as cheerio from 'cheerio'
import { execa } from 'execa'
import { exists } from 'fs-extra'
import TurndownService from 'turndown'

export async function convertDocxToHtml(options: ResolvedOptions) {
  const { cwd, workspace, pandoc, docx } = options

  if (!pandoc) {
    p.outro(c.red('pandoc not found, aborting'))
    process.exit(1)
  }

  if (!docx) {
    p.outro(c.red('docx not found, aborting'))
    process.exit(1)
  }

  if (!(await exists(path.join(cwd, workspace))))
    await mkdir(path.join(cwd, workspace))

  await execa(
    pandoc,
    [
      docx,
      '-o',
      `./${workspace}/index.md`,
      `--extract-media=./${workspace}/images`,
      '-t',
      'markdown_strict',
      '--wrap=preserve',
    ],
    {
      shell: true,
      stdio: 'inherit',
      cwd,
    },
  )

  await execa(
    pandoc,
    [
      `./${workspace}/index.md`,
      '-s',
      '-o',
      `./${workspace}/index.html`,
    ],
    {
      shell: true,
      stdio: 'inherit',
      cwd,
    },
  )
}

export async function convertHtmlToMarkdown(options: ResolvedOptions) {
  const { cwd, workspace } = options

  const html = await readFile(path.join(cwd, workspace, 'index.html'), 'utf-8')

  const $ = cheerio.load(html)
  $('title').remove()
  $('style').remove()

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
      const src = node.getAttribute('src')?.replace?.(`./${workspace}/`, './') || ''
      const alt = node.getAttribute('alt') || ''
      const style = node.getAttribute('style') || ''

      return `<img src="${src}" alt="${alt}" style="${style};display:inline-block;">`
    },
  })

  const content = turndownService.turndown($.html())

  await writeFile(path.join(cwd, workspace, 'index.md'), content)
}
