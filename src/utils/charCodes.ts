const enum charCodes {
  // ASCII Whitespace
  space = 0x20, // ' '
  tab = 0x09, // \t
  lineFeed = 0x0a, // \n
  carriageReturn = 0x0d, // \r
  formFeed = 0x0c, // \f
  verticalTab = 0x0b, // \v

  // Unicode Whitespace
  noBreakSpace = 0x00a0, // No-break space
  oghamSpace = 0x1680, // Ogham space mark
  zeroWidthNoBreak = 0xfeff, // Zero width no-break space
  lineSeparator = 0x2028, // Line separator
  paragraphSeparator = 0x2029, // Paragraph separator
  narrowNoBreak = 0x202f, // Narrow no-break space
  mediumMathSpace = 0x205f, // Medium mathematical space
  ideographicSpace = 0x3000, // Ideographic space

  // Unicode Whitespace Range
  enQuad = 0x2000, // En quad
  hairSpace = 0x200a, // Hair space

  // Digits
  zero = 0x30, // 0
  one = 0x31, // 1
  seven = 0x37, // 7
  nine = 0x39, // 9

  // Letters
  a = 0x61,
  z = 0x7a,
  A = 0x41,
  Z = 0x5a,

  // lowercase
  b = 0x62,
  e = 0x65,
  f = 0x66,
  n = 0x6e,
  o = 0x6f,
  p = 0x70,
  r = 0x72,
  t = 0x74,
  u = 0x75,
  v = 0x76,
  x = 0x78,

  // uppercase
  B = 0x42,
  E = 0x45,
  F = 0x46,
  N = 0x4e,
  O = 0x4f,
  P = 0x50,
  R = 0x52,
  T = 0x54,
  U = 0x55,
  V = 0x56,
  X = 0x58,

  // Quotes and escapes
  singleQuote = 0x27, // '
  doubleQuote = 0x22, // "
  backtick = 0x60, // `
  backslash = 0x5c, // \\

  // Identifiers
  underscore = 0x5f, // _
  dollar = 0x24, // $

  // Brackets
  leftParen = 0x28, // (
  rightParen = 0x29, // )
  leftBrace = 0x7b, // {
  rightBrace = 0x7d, // }
  leftBracket = 0x5b, // [
  rightBracket = 0x5d, // ]

  // Math operators
  plus = 0x2b, // +
  minus = 0x2d, // -
  asterisk = 0x2a, // *
  slash = 0x2f, // /
  percent = 0x25, // %

  // Comparison / relational
  lessThan = 0x3c, // <
  greaterThan = 0x3e, // >
  equal = 0x3d, // =
  exclamation = 0x21, // !

  // Logical / bitwise
  ampersand = 0x26, // &
  verticalBar = 0x7c, // |
  caret = 0x5e, // ^
  tilde = 0x7e, // ~

  // Punctuation / separators / others
  dot = 0x2e, // .
  comma = 0x2c, // ,
  semicolon = 0x3b, // ;
  colon = 0x3a, // :
  question = 0x3f, // ?
  at = 0x40, // @
  hash = 0x23 // #
}

export default charCodes;
