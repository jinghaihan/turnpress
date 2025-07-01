export interface ConvertOptions {
  cwd?: string
  /**
   * whether to clean up the output directory
   * @default true
   */
  clean?: boolean
  /**
   * Path to source DOCX file
   * @default './workspace/index.docx'
   */
  docx?: string
  /**
   * Specify path to Pandoc executable
   * @default '/opt/homebrew/bin/pandoc'
   */
  pandoc?: string
  /**
   * Directory for generated files
   * @default './workspace'
   */
  outputDir?: string
}

export interface HeadingNode {
  level: number
  rawTitle: string
  title: string
  content: string
  children: HeadingNode[]
}
