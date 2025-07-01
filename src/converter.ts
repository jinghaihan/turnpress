import type { ConvertOptions } from './types'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import * as cheerio from 'cheerio'
import { execa } from 'execa'
import { exists } from 'fs-extra'
import TurndownService from 'turndown'
import { OUTPUT_DIR } from './constants'

export async function convertDocxToHtml(options: ConvertOptions) {
  const {
    cwd = process.cwd(),
    pandoc,
    docx,
    outputDir = OUTPUT_DIR,
  } = options

  if (!pandoc) {
    p.outro(c.red('pandoc not found, aborting'))
    process.exit(1)
  }

  if (!docx) {
    p.outro(c.red('docx not found, aborting'))
    process.exit(1)
  }

  if (!(await exists(path.join(cwd, outputDir)))) {
    await mkdir(path.join(cwd, outputDir))
  }

  await execa(
    pandoc,
    [
      docx,
      '-o',
      `./${outputDir}/index.md`,
      `--extract-media=./${outputDir}/images`,
      '-t',
      'markdown_strict',
      '--wrap=preserve',
    ],
    {
      stdio: 'inherit',
      cwd,
    },
  )

  await execa(
    pandoc,
    [
      `./${outputDir}/index.md`,
      '-s',
      '-o',
      `./${outputDir}/index.html`,
    ],
    {
      stdio: 'inherit',
      cwd,
    },
  )
}

export async function convertHtmlToMarkdown(options: ConvertOptions) {
  const { cwd = process.cwd(), outputDir = OUTPUT_DIR } = options

  const html = await readFile(path.join(cwd, outputDir, 'index.html'), 'utf-8')

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
    replacement(content, node) {
      const src = node.getAttribute('src')?.replace?.(`./${outputDir}/`, './') || ''
      const alt = node.getAttribute('alt') || ''
      const style = node.getAttribute('style') || ''

      return `<img src="${src}" alt="${alt}" style="${style};display:inline-block;">`
    },
  })

  const content = turndownService.turndown($.html())

  await writeFile(path.join(cwd, outputDir, 'index.md'), content)
}
