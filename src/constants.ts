import type { CommandOptions } from './types'
import process from 'node:process'

export const MODE_CHOICES = ['convert', 'create'] as const

export const DEFAULT_OPTIONS: CommandOptions = {
  mode: 'convert',
  cwd: process.cwd(),
  clean: true,
  pandoc: 'pandoc',
  workspace: './turnpress',
}

export const TEMP_MD = 'temp.md'
export const TEMP_HTML = 'temp.html'
export const TEMP_FILES = [TEMP_MD, TEMP_HTML]
