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
