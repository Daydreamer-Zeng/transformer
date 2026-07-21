export const TOKEN_TYPES = Object.freeze({
  // Literals
  NullLiteral: "NullLiteral",
  BooleanLiteral: "BooleanLiteral",
  NumericLiteral: "NumericLiteral",
  StringLiteral: "StringLiteral",
  RegExpLiteral: "RegExpLiteral",

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
  PrivateIdentifier: "PrivateIdentifier",

  // Operators
  Operator: "Operator",

  // Punctuators
  Punctuator: "Punctuator",

  // Comments
  CommentLine: "CommentLine",
  CommentBlock: "CommentBlock",

  // Others
  Whitespace: "Whitespace",
  EOF: "EOF"
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
  }
};

export default class Tokenizer {
  constructor() {
    this.build("");
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
    "enum"
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
    "??="
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
    "?"
  ]);

  static NUMERIC_REGEX = {
    BINARY: /^0[bB][01]+$/,
    OCTAL: /^0[oO][0-7]+$/,
    DECIMAL: /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/,
    HEXADECIMAL: /^0[xX][0-9a-fA-F]+$/
  };

  static ASCII_WHITESPACE = new Set([" ", "\t", "\n", "\r", "\f", "\v"]);

  static ASCII_IDENTIFIER_START = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$");

  static ASCII_IDENTIFIER = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$");

  static REGEX_START_KEYWORD = new Set(["return", "do", "else", "case", "throw"]);

  static REGEX_START_OPERATOR = new Set(["(", "[", "{", ",", ";", "=", ":", "=>", "&&", "||", "?", "..."]);

  build(source) {
    this.source = source;
    this.tokens = [];
    this.position = 0;
    this.currentChar = source[0] || null;
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

      if (this.currentChar === "/" && (this.peekChar() === "/" || this.peekChar() === "*")) {
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

      if (Tokenizer.OPERATOR.has(this.currentChar) || Tokenizer.PUNCTUATOR.has(this.currentChar)) {
        this.readOperatorOrPunctuator();
        continue;
      }

      if (this.currentChar === "#") {
        this.readPrivateIdentifier();
        continue;
      }

      throw new Error(`Unexpected token: ${this.currentChar} at line ${this.line}, column ${this.column}`);
    }

    let eof = EOF_TOKEN;
    if (this.tokens.length > 0) {
      const end = this.tokens[this.tokens.length - 1];
      eof.loc = end.loc;
      eof.start = end.start;
      eof.end = end.end;
    }
    this.tokens.push(eof);

    return this.tokens;
  }

  nextChar() {
    if (this.currentChar === null) {
      return;
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
      index: this.position
    };
  }

  createExtra(raw, value, additional = {}) {
    return {
      raw,
      value,
      ...additional
    };
  }

  createToken(type, value, startLoc, extra) {
    const endLoc = this.getLocation();

    return {
      type,
      value,
      loc: {
        start: startLoc,
        end: endLoc
      },
      start: startLoc.index,
      end: endLoc.index,
      extra
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

    while (this.currentChar !== null && Tokenizer.ASCII_IDENTIFIER.has(this.currentChar)) {
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
        const type = Tokenizer.KEYWORD.has(value) ? TOKEN_TYPES.Keyword : TOKEN_TYPES.Identifier;
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

    while (this.currentChar !== null && this.isNumeric(value + this.currentChar)) {
      value += this.currentChar;
      this.nextChar();
    }

    if (!value) {
      return;
    }

    const { DECIMAL, BINARY, OCTAL, HEXADECIMAL } = Tokenizer.NUMERIC_REGEX;
    if (DECIMAL.test(value) || BINARY.test(value) || OCTAL.test(value) || HEXADECIMAL.test(value)) {
      const numeric = Number(value);
      this.addToken(TOKEN_TYPES.NumericLiteral, numeric, loc, this.createExtra(value, numeric));
    } else {
      throw new Error(`Invalid numeric literal: ${value} at line ${loc.line}, column ${loc.column}`);
    }
  }

  readStringLiteral() {
    const loc = this.getLocation();
    const quote = this.currentChar;
    let raw = "";
    let cooked = "";

    // include opening quote in raw
    raw += quote;
    this.nextChar();

    while (this.currentChar !== null) {
      if (this.currentChar === quote) {
        raw += quote;
        this.nextChar();
        break;
      }

      if (this.currentChar === "\\") {
        raw += "\\";
        // move to escape char
        this.nextChar();

        if (this.currentChar !== null) {
          const { raw: escRaw, cooked: escCooked } = this.parseEscapeSequence();
          raw += escRaw;
          cooked += escCooked;
          continue;
        } else {
          // lone backslash at EOF inside string
          break;
        }
      }

      raw += this.currentChar;
      cooked += this.currentChar;
      this.nextChar();
    }

    this.addToken(TOKEN_TYPES.StringLiteral, cooked, loc, this.createExtra(raw, cooked));
  }
  // Parse an escape sequence where `this.currentChar` is the first char AFTER the backslash
  // Consumes the escape sequence and returns an object { raw, cooked }
  parseEscapeSequence() {
    const ch = this.currentChar;
    if (ch === null) {
      return { raw: "", cooked: "" };
    }

    switch (ch) {
      case "n":
        this.nextChar();
        return { raw: "n", cooked: "\n" };
      case "r":
        this.nextChar();
        return { raw: "r", cooked: "\r" };
      case "t":
        this.nextChar();
        return { raw: "t", cooked: "\t" };
      case "b":
        this.nextChar();
        return { raw: "b", cooked: "\b" };
      case "f":
        this.nextChar();
        return { raw: "f", cooked: "\f" };
      case "v":
        this.nextChar();
        return { raw: "v", cooked: "\v" };
      case "0":
        this.nextChar();
        return { raw: "0", cooked: "\0" };
      case "'":
        this.nextChar();
        return { raw: "'", cooked: "'" };
      case '"':
        this.nextChar();
        return { raw: '"', cooked: '"' };
      case "\\":
        this.nextChar();
        return { raw: "\\", cooked: "\\" };
      case "x": {
        const d1 = this.peekChar(1);
        const d2 = this.peekChar(2);
        if (d1 !== null && d2 !== null && /^[0-9A-Fa-f]$/.test(d1) && /^[0-9A-Fa-f]$/.test(d2)) {
          // consume 'x' then two hex digits
          this.nextChar(); // move to first hex digit
          const h1 = this.currentChar;
          this.nextChar(); // move to second hex digit
          const h2 = this.currentChar;
          this.nextChar(); // move past second hex digit
          return { raw: `x${h1}${h2}`, cooked: String.fromCharCode(parseInt(h1 + h2, 16)) };
        }

        // invalid escape, consume 'x' and return literal 'x'
        this.nextChar();
        return { raw: "x", cooked: "x" };
      }
      case "u": {
        const a = this.peekChar(1);
        const b = this.peekChar(2);
        const c = this.peekChar(3);
        const d = this.peekChar(4);
        if (
          a !== null &&
          b !== null &&
          c !== null &&
          d !== null &&
          /^[0-9A-Fa-f]$/.test(a) &&
          /^[0-9A-Fa-f]$/.test(b) &&
          /^[0-9A-Fa-f]$/.test(c) &&
          /^[0-9A-Fa-f]$/.test(d)
        ) {
          // consume 'u' then four hex digits
          this.nextChar();
          const h1 = this.currentChar;
          this.nextChar();
          const h2 = this.currentChar;
          this.nextChar();
          const h3 = this.currentChar;
          this.nextChar();
          const h4 = this.currentChar;
          this.nextChar();
          return { raw: `u${h1}${h2}${h3}${h4}`, cooked: String.fromCharCode(parseInt(h1 + h2 + h3 + h4, 16)) };
        }

        // invalid unicode escape, consume 'u'
        this.nextChar();
        return { raw: "u", cooked: "u" };
      }
      default: {
        const literal = ch;
        this.nextChar();
        return { raw: literal, cooked: literal };
      }
    }
  }

  readTemplateLiteral() {
    const loc = this.getLocation();
    let raw = "";
    let cooked = "";
    let inTemplateExpression = false;

    this.nextChar();

    this.addToken(TOKEN_TYPES.TemplateLiteralBegin, "`", loc);

    let startLoc = this.getLocation();

    while (this.currentChar !== null) {
      if (inTemplateExpression) {
        let braceDepth = 1;

        while (this.currentChar !== null && braceDepth > 0) {
          if (this.currentChar === "{") {
            braceDepth++;
            startLoc = this.getLocation()
            this.nextChar();
            this.addToken(TOKEN_TYPES.Punctuator, "{", startLoc);
            continue;
          }

          if (this.currentChar === "}") {
            braceDepth--;

            if (braceDepth === 0) {
              // close of the template expression
              this.addToken(TOKEN_TYPES.TemplateExpressionEnd, "}", this.getLocation());
              this.nextChar();
              startLoc = this.getLocation();
              break;
            } else {
              startLoc = this.getLocation();
              this.nextChar();
              this.addToken(TOKEN_TYPES.Punctuator, "}", startLoc);
              continue;
            }
          }

          if (this.isWhitespace()) {
            this.skipWhitespace();
            continue;
          }

          if (this.currentChar === "/" && (this.peekChar() === "/" || this.peekChar() === "*")) {
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

          if (Tokenizer.OPERATOR.has(this.currentChar) || Tokenizer.PUNCTUATOR.has(this.currentChar)) {
            this.readOperatorOrPunctuator();
            continue;
          }

          if (this.currentChar === "#") {
            this.readPrivateIdentifier();
            continue;
          }

          throw new Error(`Unexpected token: ${this.currentChar} at line ${this.line}, column ${this.column}`);
        }

        inTemplateExpression = false;
      }

      if (this.currentChar === "`") {
        this.addToken(TOKEN_TYPES.TemplateElement, { raw, cooked, tail: true }, startLoc);
        startLoc = this.getLocation();

        this.nextChar();
        this.addToken(TOKEN_TYPES.TemplateLiteralEnd, "`", startLoc);
        break;
      }

      if (this.currentChar === "$" && this.peekChar() === "{") {
        inTemplateExpression = true;
        // startLoc = this.getLocation();

        this.addToken(TOKEN_TYPES.TemplateElement, { raw, cooked, tail: false }, startLoc);
        startLoc = this.getLocation();
        raw = "";
        cooked = "";

        this.nextChar();
        this.nextChar();
        this.addToken(TOKEN_TYPES.TemplateExpressionStart, "${", startLoc);
        continue;
      }

      if (this.currentChar === "\\") {
        // handle escape sequences inside template
        raw += "\\";
        this.nextChar();
        if (this.currentChar !== null) {
          const { raw: escRaw, cooked: escCooked } = this.parseEscapeSequence();
          raw += escRaw;
          cooked += escCooked;
        } else {
          raw += "\\";
        }

        continue;
      }

      raw += this.currentChar;
      cooked += this.currentChar;
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

    if (Tokenizer.OPERATOR.has(current.value) || Tokenizer.PUNCTUATOR.has(current.value)) {
      return Tokenizer.REGEX_START_OPERATOR.has(current.value);
    }

    return false;
  }

  readRegExpLiteral() {
    const loc = this.getLocation();
    let value = "";
    let inCharClass = false;

    this.nextChar();

    while (this.currentChar !== null) {
      const char = this.currentChar;

      if (char === "\\" && !inCharClass) {
        value += char;
        this.nextChar();

        if (this.currentChar === null) {
          throw new Error(`Unterminated regular expression literal at line ${loc.line}, column ${loc.column}`);
        }

        value += this.currentChar;
        this.nextChar();
        continue;
      }

      if (char === "[") {
        inCharClass = true;
        value += char;
        this.nextChar();

        while (this.currentChar !== null) {
          const classChar = this.currentChar;

          if (classChar === "\\") {
            value += classChar;
            this.nextChar();

            if (this.currentChar === null) {
              throw new Error(`Unterminated character class at line ${loc.line}, column ${loc.column}`);
            }

            value += this.currentChar;
            this.nextChar();
            continue;
          }

          if (classChar === "]") {
            inCharClass = false;
            value += classChar;
            this.nextChar();
            break;
          }

          value += classChar;
          this.nextChar();
        }

        if (inCharClass) {
          throw new Error(`Unterminated character class at line ${loc.line}, column ${loc.column}`);
        }

        continue;
      }

      if (char === "/" && !inCharClass) {
        this.nextChar();
        
        let flags = "";
        while (this.currentChar !== null && /^[a-zA-Z]$/.test(this.currentChar)) {
          flags += this.currentChar;
          this.nextChar();
        }

        this.addToken(TOKEN_TYPES.RegExpLiteral, undefined, loc, this.createExtra(`/${value}/${flags}`, undefined, { pattern: value, flags }));
        return;
      }

      if (char === "\n" || char === "\r" || char === "\u2028" || char === "\u2029") {
        throw new Error(`Unterminated regular expression literal at line ${loc.line}, column ${loc.column}`);
      }

      value += char;
      this.nextChar();
    }

    throw new Error(`Unterminated regular expression literal at line ${loc.line}, column ${loc.column}`);
  }

  readOperatorOrPunctuator() {
    if (this.currentChar === "/" && this.isStartOfRegex()) {
      this.readRegExpLiteral();
      return;
    }
    const loc = this.getLocation();
    let value = "";

    const c1 = this.currentChar || "";
    const c2 = this.peekChar() || "";
    const c3 = this.peekChar(2) || "";

    const three = c1 + c2 + c3;
    const two = c1 + c2;

    if (Tokenizer.OPERATOR.has(three) || Tokenizer.PUNCTUATOR.has(three)) {
      value = three;
      for (let i = 0; i < 3; i++) this.nextChar();
    } else if (Tokenizer.OPERATOR.has(two) || Tokenizer.PUNCTUATOR.has(two)) {
      value = two;
      for (let i = 0; i < 2; i++) this.nextChar();
    } else if (Tokenizer.OPERATOR.has(c1) || Tokenizer.PUNCTUATOR.has(c1)) {
      value = c1;
      this.nextChar();
    }

    if (value) {
      const type = Tokenizer.OPERATOR.has(value) ? TOKEN_TYPES.Operator : TOKEN_TYPES.Punctuator;
      this.addToken(type, value, loc);
    } else {
      throw new Error(`Unexpected token: ${value} at line ${loc.line}, column ${loc.column}`);
    }
  }

  readPrivateIdentifier() {
    const loc = this.getLocation();
    let value = "";

    this.nextChar();

    if (!Tokenizer.ASCII_IDENTIFIER_START.has(this.currentChar)) {
      throw new Error(`Invalid private identifier at line ${loc.line}, column ${loc.column}`);
    }

    while (this.currentChar !== null && Tokenizer.ASCII_IDENTIFIER.has(this.currentChar)) {
      value += this.currentChar;
      this.nextChar();
    }

    if (!value) {
      throw new Error(`Invalid private identifier at line ${loc.line}, column ${loc.column}`);
    }

    this.addToken(TOKEN_TYPES.PrivateIdentifier, value, loc, this.createExtra(`#${value}`, value));
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

      // line comments may be empty
      this.addToken(type, value, loc);
      return;
    }

    if (this.currentChar === "/" && this.peekChar() === "*") {
      type = TOKEN_TYPES.CommentBlock;
      this.nextChar();
      this.nextChar();

      let closed = false;
      while (this.currentChar !== null) {
        if (this.currentChar === "*" && this.peekChar() === "/") {
          this.nextChar();
          this.nextChar();
          closed = true;
          break;
        }

        value += this.currentChar;
        this.nextChar();
      }

      if (!closed) {
        throw new Error(`Unterminated comment at line ${loc.line}, column ${loc.column}`);
      }

      this.addToken(type, value, loc);
      return;
    }
  }
}
