import type { CommandOptions } from './types'
import process from 'node:process'

export const __dirname = new URL('.', import.meta.url).pathname

export const FILE_TYPE_CHOICES = ['docx', 'md'] as const

export const MODE_CHOICES = ['convert', 'create'] as const

export const DEFAULT_OPTIONS: CommandOptions = {
  mode: 'convert',
  cwd: process.cwd(),
  clean: true,
  pandoc: 'pandoc',
  workspace: './turnpress',
}

export const TEMP_MARKDOWN = '__temp.md'
export const TEMP_HTML = '__temp.html'
export const TEMP_FILES = [TEMP_MARKDOWN, TEMP_HTML]

export const DEFAULT_PROJECT_NAME = 'docs'
export const DEFAULT_PROJECT_TITLE = 'vitepress'
export const DEFAULT_SIDEBAR_PATH = 'guide'
