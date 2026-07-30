export interface TokenizerOptions {
  plugins?: string[]
  strictMode?: boolean
  sourceType?: "script" | "module"
}

export interface NormalizedConfig {
  plugins: Set<string>
  strictMode: boolean
  sourceType: "script" | "module"
}

export interface Loc {
  line: number
  column: number
  index: number
}

export interface Token {
  type: string
  start: Loc
  end: Loc
  [key: string]: any
}
