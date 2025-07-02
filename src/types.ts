import type { MODE_CHOICES } from './constants'

export type RangeMode = typeof MODE_CHOICES[number]

export type ResolvedOptions = Required<CommandOptions>

export interface CommonOptions {
  mode?: RangeMode
  cwd?: string
  /**
   * whether to clean up the output directory
   * @default true
   */
  clean?: boolean
}

export interface CommandOptions extends CommonOptions {
  /**
   * Specify path to Pandoc executable
   * @default auto-detect
   */
  pandoc?: string
  /**
   * Path to source DOCX file
   */
  docx?: string
  /**
   * Directory for generated files
   * @default './turnpress'
   */
  workspace?: string
}

export interface HeadingNode {
  level: number
  rawTitle: string
  title: string
  content: string
  children: HeadingNode[]
}
