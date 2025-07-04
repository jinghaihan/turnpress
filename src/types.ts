import type { FILE_TYPE_CHOICES, MODE_CHOICES } from './constants'

export type RangeMode = typeof MODE_CHOICES[number]

export type FileType = typeof FILE_TYPE_CHOICES[number]

export type Options = Required<CommandOptions & { type: FileType }>

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
   * Path to source file, auto-detect file type
   */
  file?: string
  /**
   * Path to source DOCX file
   */
  docx?: string
  /**
   * Path to source Markdown file
   */
  md?: string
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

export interface Image {
  name: string
  url: string
  path: string
  alt: string
}
