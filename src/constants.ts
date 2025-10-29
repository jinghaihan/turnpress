import type { CommandOptions } from './types'
import process from 'node:process'
import pkgJson from '../package.json'

export const NAME = pkgJson.name

export const VERSION = pkgJson.version

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

export const DEFAULT_PROJECT_NAME = 'vitepress'
export const DEFAULT_PROJECT_TITLE = 'turnpress'
export const DEFAULT_SIDEBAR_PATH = 'guide'
