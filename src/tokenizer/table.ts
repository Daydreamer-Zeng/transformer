import { TOKEN_TYPES, TOKEN_TYPES as tt } from "@/utils/types.js";

type LiteralRecord = Record<string, { type: TOKEN_TYPES; value: any }>;

export const LITERAL_TABLE: LiteralRecord = Object.assign(Object.create(null), {
  null: { type: tt.NullLiteral, value: null },
  true: { type: tt.BooleanLiteral, value: true },
  false: { type: tt.BooleanLiteral, value: false }
});

// 0x... or 1 << n
export const enum TokenFlag {
  KEYWORD = 0x001,
  STRICT_MODE = 0x002,
  OPERATOR = 0x004,
  PUNCTUATOR = 0x008,
  BEFORE_REGEX = 0x010
}

type Table = Record<string, number>;

export const KEYWORD_TABLE: Table = Object.assign(Object.create(null), {
  async: TokenFlag.KEYWORD,
  await: TokenFlag.KEYWORD,
  break: TokenFlag.KEYWORD,
  catch: TokenFlag.KEYWORD,
  class: TokenFlag.KEYWORD,
  const: TokenFlag.KEYWORD,
  continue: TokenFlag.KEYWORD,
  debugger: TokenFlag.KEYWORD,
  default: TokenFlag.KEYWORD,
  delete: TokenFlag.KEYWORD,
  enum: TokenFlag.KEYWORD,
  export: TokenFlag.KEYWORD,
  extends: TokenFlag.KEYWORD,
  finally: TokenFlag.KEYWORD,
  for: TokenFlag.KEYWORD,
  function: TokenFlag.KEYWORD,
  if: TokenFlag.KEYWORD,
  import: TokenFlag.KEYWORD,
  in: TokenFlag.KEYWORD,
  instanceof: TokenFlag.KEYWORD,
  let: TokenFlag.KEYWORD,
  new: TokenFlag.KEYWORD,
  super: TokenFlag.KEYWORD,
  switch: TokenFlag.KEYWORD,
  this: TokenFlag.KEYWORD,
  try: TokenFlag.KEYWORD,
  typeof: TokenFlag.KEYWORD,
  var: TokenFlag.KEYWORD,
  void: TokenFlag.KEYWORD,
  while: TokenFlag.KEYWORD,
  with: TokenFlag.KEYWORD,
  yield: TokenFlag.KEYWORD,

  // Keywords before regex
  return: TokenFlag.KEYWORD | TokenFlag.BEFORE_REGEX,
  do: TokenFlag.KEYWORD | TokenFlag.BEFORE_REGEX,
  else: TokenFlag.KEYWORD | TokenFlag.BEFORE_REGEX,
  case: TokenFlag.KEYWORD | TokenFlag.BEFORE_REGEX,
  throw: TokenFlag.KEYWORD | TokenFlag.BEFORE_REGEX,

  // Strict Mode
  implements: TokenFlag.STRICT_MODE,
  interface: TokenFlag.STRICT_MODE,
  package: TokenFlag.STRICT_MODE,
  private: TokenFlag.STRICT_MODE,
  protected: TokenFlag.STRICT_MODE,
  public: TokenFlag.STRICT_MODE,
  static: TokenFlag.STRICT_MODE
});

export const PUNCTUATOR_TABLE: Table = Object.assign(Object.create(null), {
  /**
   * Operators
   */
  // Arithmetic operators
  "+": TokenFlag.OPERATOR,
  "-": TokenFlag.OPERATOR,
  "*": TokenFlag.OPERATOR,
  "/": TokenFlag.OPERATOR,
  "%": TokenFlag.OPERATOR,
  "**": TokenFlag.OPERATOR,

  // Assignment operators
  "=": TokenFlag.OPERATOR | TokenFlag.BEFORE_REGEX,
  "+=": TokenFlag.OPERATOR,
  "-=": TokenFlag.OPERATOR,
  "*=": TokenFlag.OPERATOR,
  "/=": TokenFlag.OPERATOR,
  "%=": TokenFlag.OPERATOR,
  "**=": TokenFlag.OPERATOR,

  // Equality operators
  "==": TokenFlag.OPERATOR,
  "===": TokenFlag.OPERATOR,
  "!=": TokenFlag.OPERATOR,
  "!==": TokenFlag.OPERATOR,

  // Relational operators
  "<": TokenFlag.OPERATOR,
  ">": TokenFlag.OPERATOR,
  "<=": TokenFlag.OPERATOR,
  ">=": TokenFlag.OPERATOR,

  // Logical operators
  "!": TokenFlag.OPERATOR,
  "&&": TokenFlag.OPERATOR | TokenFlag.BEFORE_REGEX,
  "||": TokenFlag.OPERATOR | TokenFlag.BEFORE_REGEX,
  "??": TokenFlag.OPERATOR,

  // Bitwise operators
  "&": TokenFlag.OPERATOR,
  "|": TokenFlag.OPERATOR,
  "^": TokenFlag.OPERATOR,
  "~": TokenFlag.OPERATOR,
  "<<": TokenFlag.OPERATOR,
  ">>": TokenFlag.OPERATOR,
  ">>>": TokenFlag.OPERATOR,

  // Bitwise assignment operators
  "&=": TokenFlag.OPERATOR,
  "|=": TokenFlag.OPERATOR,
  "^=": TokenFlag.OPERATOR,
  "<<=": TokenFlag.OPERATOR,
  ">>=": TokenFlag.OPERATOR,
  ">>>=": TokenFlag.OPERATOR,

  // Increment/Decrement operators
  "++": TokenFlag.OPERATOR,
  "--": TokenFlag.OPERATOR,

  // Other
  "=>": TokenFlag.OPERATOR | TokenFlag.BEFORE_REGEX,
  "??=": TokenFlag.OPERATOR,
  "?.": TokenFlag.OPERATOR,
  "?": TokenFlag.OPERATOR | TokenFlag.BEFORE_REGEX,

  /**
   * Punctuators
   */
  // Spread/Rest operator
  "...": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX,

  // Parentheses and braces
  "(": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX,
  ")": TokenFlag.PUNCTUATOR,
  "{": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX,
  "}": TokenFlag.PUNCTUATOR,
  "[": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX,
  "]": TokenFlag.PUNCTUATOR,

  // Separators
  ";": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX,
  ",": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX,

  // Accessors
  ".": TokenFlag.PUNCTUATOR,

  // Other
  ":": TokenFlag.PUNCTUATOR | TokenFlag.BEFORE_REGEX
});
