export const TOKEN_TYPES = Object.freeze({
  // Literals
  NullLiteral: "NullLiteral",
  BooleanLiteral: "BooleanLiteral",
  NumericLiteral: "NumericLiteral",
  StringLiteral: "StringLiteral",
  RegularExpressionLiteral: "RegularExpressionLiteral",

  // Template literals
  TemplateLiteralBegin: "TemplateLiteralBegin",
  TemplateLiteralEnd: "TemplateLiteralEnd",
  TemplateElement: "TemplateElement",
  TemplateExpressionStart: "TemplateExpressionStart",
  TemplateExpressionEnd: "TemplateExpressionEnd",
  // keywords
  Keyword: "Keyword",

  // Identifiers
  Identifier: "Identifier",

  // Operators
  Operator: "Operator",

  // Punctuators
  Punctuator: "Punctuator",

  // Comments
  CommentLine: "CommentLine",
  CommentBlock: "CommentBlock",

  // Others
  Whitespace: "Whitespace",
  EOF: "EOF",
});

const EOF_TOKEN = {
  type: TOKEN_TYPES.EOF,
  value: "EOF",
  start: null,
  end: null,
  loc: {
    start: {
      line: 1,
      column: 0,
      index: 0
    },
    end: {
      line: 1,
      column: 0,
      index: 0
    }
  },
};

export default class Tokenizer {
  constructor() {
    this.source = "";
    this.tokens = [];
    this.position = 0;
    this.currentChar = null;
    this.line = 1;
    this.column = 0;
  }

  static KEYWORD = new Set([
    // ECMAScript 2015 (ES6) Keywords
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    // Strict Mode Keywords
    "implements",
    "interface",
    "package",
    "private",
    "protected",
    "public",
    "static",
    // Future Reserved Keywords
    "enum",
  ]);

  static OPERATOR = new Set([
    // Arithmetic operators
    "+",
    "-",
    "*",
    "/",
    "%",
    "**",
    // Assignment operators
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "**=",
    // Equality operators
    "==",
    "===",
    "!=",
    "!==",
    // Relational operators
    "<",
    ">",
    "<=",
    ">=",
    // Logical operators
    "!",
    "&&",
    "||",
    "??",
    // Bitwise operators
    "&",
    "|",
    "^",
    "~",
    "<<",
    ">>",
    ">>>",
    // Bitwise assignment operators
    "&=",
    "|=",
    "^=",
    "<<=",
    ">>=",
    ">>>=",
    // Increment/Decrement operators
    "++",
    "--",
    // Conditional operators
    "?",
    ":",
    // Other
    "=>",
    "??=",
  ]);

  static PUNCTUATOR = new Set([
    // Spread/Rest operator
    "...",
    // Parentheses and braces
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
    // Separators
    ";",
    ",",
    // Accessors
    ".",
    "?.",
    // Other
    ":",
    "?",
  ]);

  static NUMERIC_REGEX = {
    BINARY: /^0[bB][01]+$/,
    OCTAL: /^0[oO][0-7]+$/,
    DECIMAL: /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/,
    HEXADECIMAL: /^0[xX][0-9a-fA-F]+$/,
  };

  static ASCII_WHITESPACE = new Set([" ", "\t", "\n", "\r", "\f", "\v"]);

  static ASCII_IDENTIFIER_START = new Set(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$"
  );

  static ASCII_IDENTIFIER = new Set(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$"
  );

  static REGEX_START_KEYWORD = new Set([
    "return",
    "do",
    "else",
    "case",
    "throw",
  ]);

  static REGEX_START_OPERATOR = new Set([
    "(",
    "[",
    "{",
    ",",
    ";",
    "=",
    ":",
    "=>",
    "&&",
    "||",
    "?",
    "...",
  ]);

  build(source) {
    this.source = source;
    this.tokens = [];
    this.position = 0;
    this.currentChar = this.source[0] || null;
    this.line = 1;
    this.column = 0;
  }

  tokenize(source) {
    this.build(source);

    while (this.currentChar !== null) {
      if (this.isWhitespace()) {
        this.skipWhitespace();
        continue;
      }

      if (
        this.currentChar === "/" &&
        (this.peekChar() === "/" || this.peekChar() === "*")
      ) {
        this.readComment();
        continue;
      }

      if (Tokenizer.ASCII_IDENTIFIER_START.has(this.currentChar)) {
        this.readIdentifier();
        continue;
      }

      if (this.isNumeric()) {
        this.readNumberLiteral();
        continue;
      }

      if (this.currentChar === '"' || this.currentChar === "'") {
        this.readStringLiteral();
        continue;
      }

      if (this.currentChar === "`") {
        this.readTemplateLiteral();
        continue;
      }

      if (
        Tokenizer.OPERATOR.has(this.currentChar) ||
        Tokenizer.PUNCTUATOR.has(this.currentChar)
      ) {
        this.readOperatorOrPunctuator();
        continue;
      }

      throw new Error(
        `Unexpected token: ${this.currentChar} at line ${this.line}, column ${this.column}`
      );
    }

    let eof = EOF_TOKEN;
    if (this.tokens.length > 0) {
      const end = this.tokens[this.tokens.length - 1]
      eof.loc = end.loc;
      eof.start = end.start;
      eof.end = end.end;
    }
    this.tokens.push(eof);

    return this.tokens;
  }

  nextChar() {
    if (this.currentChar === null) {
      return
    }

    this.position++;

    if (this.currentChar === "\n") {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }

    this.currentChar = this.source[this.position] || null;
  }

  peekChar(offset = 1) {
    return this.source[this.position + offset] || null;
  }

  getLocation() {
    return {
      line: this.line,
      column: this.column,
      index: this.position,
    };
  }

  createExtra(raw, value) {
    return {
      raw,
      value,
    };
  }

  createToken(type, value, startLoc, extra) {
    const endLoc = this.getLocation();

    return {
      type,
      value,
      loc: {
        start: startLoc,
        end: endLoc,
      },
      start: startLoc.index,
      end: endLoc.index,
      extra,
    };
  }

  addToken(type, value, startLoc, extra) {
    const token = this.createToken(type, value, startLoc, extra);
    this.tokens.push(token);
  }

  isWhitespace() {
    // ASCII whitespace
    if (Tokenizer.ASCII_WHITESPACE.has(this.currentChar)) {
      return true;
    }

    // Unicode whitespace
    const code = this.currentChar.charCodeAt(0);
    return (
      code === 0x00a0 || // No-break space
      code === 0x1680 || // Ogham space mark
      code === 0xfeff || // Zero width no-break space
      code === 0x2028 || // Line separator
      code === 0x2029 || // Paragraph separator
      code === 0x202f || // Narrow no-break space
      code === 0x205f || // Medium mathematical space
      code === 0x3000 || // Ideographic space
      (code >= 0x2000 && code <= 0x200a) // Various spaces
    );
  }

  // readWhitespace() {
  //   const loc = this.getLocation();
  //   let whitespace = "";

  //   while (this.currentChar !== null && this.isWhitespace()) {
  //     whitespace += this.currentChar;
  //     this.nextChar();
  //   }

  //   if (whitespace) {
  //     this.addToken(TOKEN_TYPES.Whitespace, whitespace, loc);
  //   }

  //   return whitespace;
  // }

  skipWhitespace() {
    while (this.currentChar !== null && this.isWhitespace()) {
      this.nextChar();
    }
  }

  readIdentifier() {
    const loc = this.getLocation();
    let value = "";

    while (
      this.currentChar !== null &&
      Tokenizer.ASCII_IDENTIFIER.has(this.currentChar)
    ) {
      value += this.currentChar;
      this.nextChar();
    }

    if (!value) {
      return;
    }

    switch (value) {
      case "null":
        this.addToken(TOKEN_TYPES.NullLiteral, value, loc);
        break;

      case "true":
        this.addToken(TOKEN_TYPES.BooleanLiteral, true, loc);
        break;

      case "false":
        this.addToken(TOKEN_TYPES.BooleanLiteral, false, loc);
        break;

      default:
        const type = Tokenizer.KEYWORD.has(value)
          ? TOKEN_TYPES.Keyword
          : TOKEN_TYPES.Identifier;
        this.addToken(type, value, loc);
        break;
    }
  }

  isNumeric(currentChar = this.currentChar) {
    if (Tokenizer.NUMERIC_REGEX.DECIMAL.test(currentChar)) {
      return true;
    }

    const nextChar = this.peekChar();
    if (
      (currentChar === "0" && /^[bBoOxX]$/.test(nextChar)) ||
      /^0[bBoOxX]$/.test(currentChar) ||
      Tokenizer.NUMERIC_REGEX.BINARY.test(currentChar) ||
      Tokenizer.NUMERIC_REGEX.OCTAL.test(currentChar) ||
      Tokenizer.NUMERIC_REGEX.HEXADECIMAL.test(currentChar)
    ) {
      return true;
    }

    const twoChars = currentChar + nextChar;
    return (
      Tokenizer.NUMERIC_REGEX.DECIMAL.test(twoChars) ||
      Tokenizer.NUMERIC_REGEX.DECIMAL.test(twoChars + this.peekChar(2))
    );
  }

  readNumberLiteral() {
    const loc = this.getLocation();
    let value = "";

    while (
      this.currentChar !== null &&
      this.isNumeric(value + this.currentChar)
    ) {
      value += this.currentChar;
      this.nextChar();
    }

    if (!value) {
      return;
    }

    const { DECIMAL, BINARY, OCTAL, HEXADECIMAL } = Tokenizer.NUMERIC_REGEX;
    if (
      DECIMAL.test(value) ||
      BINARY.test(value) ||
      OCTAL.test(value) ||
      HEXADECIMAL.test(value)
    ) {
      const numeric = Number(value);
      this.addToken(
        TOKEN_TYPES.NumericLiteral,
        numeric,
        loc,
        this.createExtra(value, numeric)
      );
    } else {
      throw new Error(
        `Invalid numeric literal: ${value} at line ${loc.line}, column ${loc.column}`
      );
    }
  }

  readStringLiteral() {
    const loc = this.getLocation();
    const quote = this.currentChar;
    let value = "";

    this.nextChar();

    while (this.currentChar !== null) {
      if (this.currentChar === quote) {
        this.nextChar();
        break;
      }

      if (this.currentChar === "\\") {
        value += this.currentChar;
        this.nextChar();

        if (this.currentChar !== null) {
          value += this.parseEscape();
          this.nextChar();
        }
      } else {
        value += this.currentChar;
        this.nextChar();
      }
    }

    this.addToken(TOKEN_TYPES.StringLiteral, value, loc, this.createExtra(quote + value + quote, value));
  }

  parseEscape() {
    switch (this.currentChar) {
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "v":
        return "\v";
      case "0":
        return "\0";
      case "'":
        return "'";
      case '"':
        return '"';
      case "\\":
        return "\\";
      case "x":
        return this.parseHexEscape();
      case "u":
        return this.parseUnicodeEscape();
      default:
        return this.currentChar;
    }
  }

  parseHexEscape() {
    if (this.position + 2 < this.source.length) {
      const hex = this.source.substring(this.position + 1, this.position + 3);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        this.position += 2;
        return String.fromCharCode(parseInt(hex, 16));
      }
    }

    return "\\x";
  }

  parseUnicodeEscape() {
    if (this.position + 4 < this.source.length) {
      const hex = this.source.substring(this.position + 1, this.position + 5);
      if (/^[0-9A-Fa-f]{4}$/.test(hex)) {
        this.position += 4;
        return String.fromCharCode(parseInt(hex, 16));
      }
    }

    return "\\u";
  }

  readTemplateLiteral() {
    const loc = this.getLocation();
    let value = "";
    let inTemplateExpression = false;

    this.nextChar();

    this.addToken(TOKEN_TYPES.TemplateLiteralBegin, "`", loc);

    while (this.currentChar !== null) {
      if (inTemplateExpression) {
        let braceDepth = 1;
        while (this.currentChar !== null && braceDepth > 0) {
          if (this.currentChar === "{") {
            braceDepth++;
            this.addToken(TOKEN_TYPES.Punctuator, "{", loc);
            this.nextChar();
            continue;
          }

          if (this.currentChar === "}") {
            braceDepth--;
            if (braceDepth === 0) {
              // close of the template expression
              this.addToken(TOKEN_TYPES.TemplateExpressionEnd, "}", loc);
              this.nextChar();
              break;
            } else {
              this.addToken(TOKEN_TYPES.Punctuator, "}", loc);
              this.nextChar();
              continue;
            }
          }

          if (this.isWhitespace()) {
            this.skipWhitespace();
            continue;
          }

          if (
            this.currentChar === "/" &&
            (this.peekChar() === "/" || this.peekChar() === "*")
          ) {
            this.readComment();
            continue;
          }

          if (Tokenizer.ASCII_IDENTIFIER_START.has(this.currentChar)) {
            this.readIdentifier();
            continue;
          }

          if (this.isNumeric()) {
            this.readNumberLiteral();
            continue;
          }

          if (this.currentChar === '"' || this.currentChar === "'") {
            this.readStringLiteral();
            continue;
          }

          if (this.currentChar === "`") {
            this.readTemplateLiteral();
            continue;
          }

          if (
            Tokenizer.OPERATOR.has(this.currentChar) ||
            Tokenizer.PUNCTUATOR.has(this.currentChar)
          ) {
            this.readOperatorOrPunctuator();
            continue;
          }

          throw new Error(
            `Unexpected token: ${this.currentChar} at line ${this.line}, column ${this.column}`
          );
        }

        inTemplateExpression = false;
      }

      if (this.currentChar === "`") {
        const endLoc = this.getLocation();
        this.nextChar();

        this.addToken(TOKEN_TYPES.TemplateElement, value, loc);
        this.addToken(TOKEN_TYPES.TemplateLiteralEnd, "`", endLoc);
        break;
      }

      if (this.currentChar === "$" && this.peekChar() === "{") {
        inTemplateExpression = true;

        this.nextChar();
        this.nextChar();

        this.addToken(TOKEN_TYPES.TemplateElement, value, loc);
        this.addToken(TOKEN_TYPES.TemplateExpressionStart, "${", loc);
        value = "";
        continue;
      }

      if (this.currentChar === "\\") {
        value += this.currentChar;
        this.nextChar();

        if (this.currentChar !== null) {
          value += this.parseEscape();
          this.nextChar();
        }

        continue;
      }

      value += this.currentChar;
      this.nextChar();
    }
  }

  isStartOfRegex() {
    let index = this.tokens.length - 1;
    while (index >= 0 && this.tokens[index].type === TOKEN_TYPES.Whitespace) {
      index--;
    }

    const current = this.tokens[index];
    if (!current) {
      return true;
    }

    if (Tokenizer.KEYWORD.has(current.value)) {
      return Tokenizer.REGEX_START_KEYWORD.has(current.value);
    }

    if (
      Tokenizer.OPERATOR.has(current.value) ||
      Tokenizer.PUNCTUATOR.has(current.value)
    ) {
      return Tokenizer.REGEX_START_OPERATOR.has(current.value);
    }

    return false;
  }

  readRegularExpressionLiteral() {
    const loc = this.getLocation();
    let value = "";

    this.nextChar();

    while (this.currentChar !== null) {
      if (this.currentChar === "/" && this.peekChar(-1) !== "\\") {
        this.nextChar();
        break;
      }

      value += this.currentChar;
      this.nextChar();
    }

    if (value) {
      this.addToken(
        TOKEN_TYPES.RegularExpressionLiteral,
        value,
        loc,
        this.createExtra(`/${value}/`, value)
      );
    } else {
      throw new Error(
        `Unterminated regular expression literal at line ${loc.line}, column ${loc.column}`
      );
    }
  }

  readOperatorOrPunctuator() {
    if (this.currentChar === "/" && this.isStartOfRegex()) {
      this.readRegularExpressionLiteral();
      return;
    }

    const loc = this.getLocation();
    let value = "";

    const twoChars = this.currentChar + (this.peekChar() || "");
    const wchar = twoChars + (this.peekChar(2) || "");
    if (Tokenizer.OPERATOR.has(wchar) || Tokenizer.PUNCTUATOR.has(wchar)) {
      value = wchar;
      if (this.peekChar() !== null) {
        this.nextChar();

        if (this.peekChar(2) !== null) {
          this.nextChar();
        }
      }

      this.nextChar();
    } else if (Tokenizer.OPERATOR.has(twoChars) || Tokenizer.PUNCTUATOR.has(twoChars)) {
      value = twoChars;
      if (this.peekChar() !== null) {
        this.nextChar();
      }
  
      this.nextChar();
    } else if (
      Tokenizer.OPERATOR.has(this.currentChar) ||
      Tokenizer.PUNCTUATOR.has(this.currentChar)
    ) {
      value = this.currentChar;
      this.nextChar();
    }

    if (value) {
      const type = Tokenizer.OPERATOR.has(value)
        ? TOKEN_TYPES.Operator
        : TOKEN_TYPES.Punctuator;
      this.addToken(type, value, loc);
    } else {
      throw new Error(
        `Unexpected token: ${value} at line ${loc.line}, column ${loc.column}`
      );
    }
  }

  readComment() {
    const loc = this.getLocation();
    let value = "";
    let type = null;

    if (this.currentChar === "/" && this.peekChar() === "/") {
      type = TOKEN_TYPES.CommentLine;
      this.nextChar();
      this.nextChar();

      while (this.currentChar !== null && this.currentChar !== "\n") {
        value += this.currentChar;
        this.nextChar();
      }
    } else if (this.currentChar === "/" && this.peekChar() === "*") {
      type = TOKEN_TYPES.CommentBlock;
      this.nextChar();
      this.nextChar();

      while (this.currentChar !== null) {
        if (this.currentChar === "*" && this.peekChar() === "/") {
          this.nextChar();
          this.nextChar();
          break;
        }

        value += this.currentChar;
        this.nextChar();
      }
    }

    if (value) {
      this.addToken(type, value, loc);
    } else {
      throw new Error(
        `Unterminated comment at line ${loc.line}, column ${loc.column}`
      );
    }
  }
};
