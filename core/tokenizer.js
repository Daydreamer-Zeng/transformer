import charCodes from "./charCodes.js";
import { TOKEN_TYPES as t } from "./types.js";
import { TABLE_ENUM, KEYWORD_TABLE, PUNCTUATOR_TABLE } from "./tables.js";

const UNICODE_IDENTIFIER_START = /\p{ID_Start}/u;
const UNICODE_IDENTIFIER_PART = /\p{ID_Continue}/u;

class Tokenizer {
  constructor(options = {}) {
    this.options = {
      plugins: new Set(options.plugins || []),
      strictMode: options.strictMode || false,
      sourceType: options.sourceType || "script"
    };
    this.tokens = [];
  }

  tokenize(input) {
    this.tokens = [];
    this.source = this.cleanSource(input);
    this.currentChar = this.source[0] || null;

    this.position = 0;
    this.line = 1;
    this.column = 0;

    while (this.currentChar !== null) {
      this.main();
    }

    return this.tokens;
  }

  cleanSource(source) {
    if (!source || typeof source !== "string") {
      return "";
    }

    let cleaned = source;

    // Remove BOM (Byte Order Mark) if present
    if (cleaned.charCodeAt(0) === 0xfeff) {
      cleaned = cleaned.slice(1);
    }

    // Remove BOM (Byte Order Mark) if present (for UTF-16LE)
    if (cleaned.charCodeAt(0) === 0xfffe) {
      cleaned = cleaned.slice(1);
    }

    // Normalize line endings to LF
    cleaned = cleaned.replace(/\r\n?/g, "\n");

    // Remove zero-width characters (U+200B, U+200C, U+200D, U+FEFF)
    cleaned = cleaned.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

    return cleaned;
  }

  main() {
    if (this.isWhitespace()) {
      this.skipWhitespace();
      return;
    }

    if (this.isStartOfComment()) {
      this.readComment();
      return;
    }

    if (this.isStartOfIdentifier()) {
      this.readIdentifier();
      return;
    }

    if (this.isStartOfNumber()) {
      this.readNumberLiteral();
      return;
    }

    if (this.isStartOfString()) {
      this.readStringLiteral();
      return;
    }

    if (this.isStartOfTemplate()) {
      this.readTemplateLiteral();
      return;
    }

    if (this.isStartOfRegExp()) {
      this.readRegExpLiteral();
      return;
    }

    if (this.isStartOfPunctuator()) {
      this.readPunctuator();
      return;
    }

    this.unexpected();
  }

  getLocation() {
    return {
      line: this.line,
      column: this.column,
      index: this.position
    };
  }

  nextChar() {
    if (this.currentChar === null) {
      return;
    }

    const code = this.currentChar.charCodeAt(0);

    if (code === charCodes.carriageReturn) {
      if (this.source.charCodeAt(this.position + 1) === charCodes.lineFeed) {
        this.position += 2;
      } else {
        this.position += 1;
      }

      this.line++;
      this.column = 0;
      this.currentChar = this.source[this.position] || null;
      return;
    }

    if (code === charCodes.lineFeed) {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }

    this.position++;
    this.currentChar = this.source[this.position] || null;
  }

  addToken(type, start, properties = {}) {
    const end = this.getLocation();

    this.tokens.push({
      type,
      start,
      end,
      ...properties
    });
  }

  unexpected(description = null, location = this.getLocation(), value = this.currentChar) {
    const line = location.line;
    const column = location.column;
    const content = this.source.split("\n")[line - 1] ?? "";
    const token = value ?? "EOF";

    let message = `Unexpected token '${token}' (${line}:${column + 1})`;

    if (content) {
      message += `\n\n${line} | ${content}`;
      message += `\n    ${" ".repeat(column)}^`;
    }

    if (description) {
      message += `\n${description}`;
    }

    throw new Error(message);
  }

  isWhitespace() {
    const code = this.currentChar.charCodeAt(0);

    // Unicode Whitespace Range
    if (code >= charCodes.enQuad && code <= charCodes.hairSpace) {
      return true;
    }

    switch (code) {
      // ASCII Whitespace
      case charCodes.space:
      case charCodes.tab:
      case charCodes.lineFeed:
      case charCodes.carriageReturn:
      case charCodes.formFeed:
      case charCodes.verticalTab:

      // Unicode Whitespace
      case charCodes.noBreakSpace:
      case charCodes.oghamSpace:
      case charCodes.zeroWidthNoBreak:
      case charCodes.lineSeparator:
      case charCodes.paragraphSeparator:
      case charCodes.narrowNoBreak:
      case charCodes.mediumMathSpace:
      case charCodes.ideographicSpace:
        return true;

      default:
        return false;
    }
  }

  skipWhitespace() {
    while (this.currentChar !== null && this.isWhitespace()) {
      this.nextChar();
    }
  }

  isStartOfComment() {
    const peekCode = this.source.charCodeAt(this.position + 1);
    return (
      this.source.charCodeAt(this.position) === charCodes.slash &&
      (peekCode === charCodes.slash || peekCode === charCodes.asterisk)
    );
  }

  readComment() {
    const start = this.getLocation();
    const peekCode = this.source.charCodeAt(this.position + 1);

    if (peekCode === charCodes.slash) {
      this.nextChar();
      this.nextChar();

      while (
        this.position < this.source.length &&
        this.currentChar.charCodeAt(0) !== charCodes.lineFeed &&
        this.currentChar.charCodeAt(0) !== charCodes.carriageReturn
      ) {
        this.nextChar();
      }

      const raw = this.source.slice(start.index, this.position);
      const value = raw.slice(2);
      this.addToken(t.CommentLine, start, { value, raw });
      return;
    }

    if (peekCode === charCodes.asterisk) {
      let closed = false;

      this.nextChar();
      this.nextChar();

      while (this.position < this.source.length) {
        if (
          this.currentChar.charCodeAt(0) === charCodes.asterisk &&
          this.source.charCodeAt(this.position + 1) === charCodes.slash
        ) {
          this.nextChar();
          this.nextChar();

          closed = true;
          break;
        }

        this.nextChar();
      }

      if (!closed) {
        this.unexpected("Unterminated comment: missing closing '*/'.", start, "/*");
      }

      const raw = this.source.slice(start.index, this.position);
      const value = raw.slice(2, -2);
      this.addToken(t.CommentBlock, start, { value, raw });
      return;
    }
  }

  isStartOfIdentifier() {
    const code = this.currentChar.charCodeAt(0);

    if (
      (code >= charCodes.a && code <= charCodes.z) || // a-z
      (code >= charCodes.A && code <= charCodes.Z) || // A-Z
      code === charCodes.underscore || // _
      code === charCodes.dollar // $
    ) {
      return true;
    }

    return UNICODE_IDENTIFIER_START.test(this.currentChar);
  }

  isKeyword(value) {
    const flag = KEYWORD_TABLE[value] ?? 0;

    if ((flag & TABLE_ENUM.KEYWORD) === TABLE_ENUM.KEYWORD) {
      return true;
    }

    return this.options.strictMode && (flag & TABLE_ENUM.STRICT_MODE) === TABLE_ENUM.STRICT_MODE;
  }

  isIdentifier(char = this.currentChar) {
    const code = char.charCodeAt(0);

    if (
      (code >= charCodes.a && code <= charCodes.z) || // a-z
      (code >= charCodes.A && code <= charCodes.Z) || // A-Z
      (code >= charCodes.zero && code <= charCodes.nine) || // 0-9
      code === charCodes.underscore || // _
      code === charCodes.dollar // $
    ) {
      return true;
    }

    return UNICODE_IDENTIFIER_PART.test(char);
  }

  readIdentifier() {
    const start = this.getLocation();
    let value = "";

    while (this.position < this.source.length && this.isIdentifier()) {
      value += this.currentChar;
      this.nextChar();
    }

    if (value === "null") {
      this.addToken(t.NullLiteral, start, { value: null });
      return;
    }

    if (value === "true") {
      this.addToken(t.BooleanLiteral, start, { value: true });
      return;
    }

    if (value === "false") {
      this.addToken(t.BooleanLiteral, start, { value: false });
      return;
    }

    const type = this.isKeyword(value) ? t.Keyword : t.Identifier;
    this.addToken(type, start, { value });
    return;
  }

  isStartOfNumber() {
    const code = this.currentChar.charCodeAt(0);

    if (code >= charCodes.zero && code <= charCodes.nine) {
      return true;
    }

    if (code === charCodes.dot) {
      const peekCode = this.source.charCodeAt(this.position + 1);
      return peekCode >= charCodes.zero && peekCode <= charCodes.nine;
    }

    return false;
  }

  isValidDigit(code, radix) {
    if (radix === 10) {
      return code >= charCodes.zero && code <= charCodes.nine;
    }

    if (radix === 16) {
      return (
        (code >= charCodes.zero && code <= charCodes.nine) || // 0-9
        (code >= charCodes.A && code <= charCodes.F) || // A-F
        (code >= charCodes.a && code <= charCodes.f) // a-f
      );
    }

    if (radix === 8) {
      return code >= charCodes.zero && code <= charCodes.seven;
    }

    if (radix === 2) {
      return code >= charCodes.zero && code <= charCodes.one;
    }

    return false;
  }

  readInt(radix, length) {
    while (this.position < this.source.length) {
      const code = this.currentChar.charCodeAt(0);

      if (code === charCodes.underscore) {
        const prevCode = this.source.charCodeAt(this.position - 1);
        const afterCode = this.source.charCodeAt(this.position + 1);

        if (!this.isValidDigit(prevCode, radix) || !this.isValidDigit(afterCode, radix)) {
          this.unexpected("Invalid numeric separator: separators must appear between two digits.", this.getLocation(), this.currentChar);
        }

        this.nextChar();
        continue;
      }

      if (!this.isValidDigit(code, radix)) {
        break;
      }

      this.nextChar();

      if (length !== void 0 && --length <= 0) {
        break;
      }
    }
  }

  readRadixNumber(radix) {
    let hasExponent = false;
    let hasFraction = false;
    this.readInt(radix);

    if (radix === 16) {
      if (this.currentChar.charCodeAt(0) === charCodes.dot) {
        hasFraction = true;
        this.nextChar();
        this.readInt(radix);
      }

      if (this.currentChar.charCodeAt(0) === charCodes.p || this.currentChar.charCodeAt(0) === charCodes.P) {
        hasExponent = true;
        this.nextChar();

        if (this.currentChar.charCodeAt(0) === charCodes.plus || this.currentChar.charCodeAt(0) === charCodes.minus) {
          this.nextChar();
        }

        this.readInt(10);
      }
    }

    if (this.currentChar.charCodeAt(0) === charCodes.n) {
      if (hasExponent || hasFraction) {
        this.unexpected("Invalid bigInt literal: radix literals cannot contain decimal points or exponents.", this.getLocation(), this.currentChar);
      }

      this.nextChar();

      return true;
    }
  }

  getRadixFromPrefix() {
    if (this.position + 1 >= this.source.length) {
      return null;
    }

    const peekCode = this.source.charCodeAt(this.position + 1);

    if (peekCode === charCodes.b || peekCode === charCodes.B) {
      return 2;
    }

    if (peekCode === charCodes.o || peekCode === charCodes.O) {
      return 8;
    }

    if (peekCode === charCodes.x || peekCode === charCodes.X) {
      return 16;
    }

    return null;
  }

  readNumberLiteral() {
    const start = this.getLocation();
    let isBigInt = false;
    let hasFraction = false;
    let hasExponent = false;

    if (this.currentChar.charCodeAt(0) === charCodes.zero) {
      const radix = this.getRadixFromPrefix();

      if (radix) {
        this.nextChar();
        this.nextChar();

        const flag = this.readRadixNumber(radix);
        const raw = this.source.slice(start.index, this.position);

        if (flag) {
          const value = raw.slice(0, -1);
          this.addToken(t.BigIntLiteral, start, { value, raw });
        } else {
          const value = Number(raw.replace(/_/g, ""));
          this.addToken(t.NumericLiteral, start, { value, raw });
        }

        return;
      }
    }

    this.readInt(10);

    if (this.currentChar.charCodeAt(0) === charCodes.dot) {
      this.nextChar();
      this.readInt(10);

      if (this.currentChar.charCodeAt(0) === charCodes.dot) {
        this.unexpected("Invalid numeric literal: A number cannot contain two decimal points.", this.getLocation(), this.currentChar);
      }

      hasFraction = true;
    }

    if (this.currentChar.charCodeAt(0) === charCodes.e || this.currentChar.charCodeAt(0) === charCodes.E) {
      this.nextChar();

      if (this.currentChar.charCodeAt(0) === charCodes.plus || this.currentChar.charCodeAt(0) === charCodes.minus) {
        this.nextChar();
      }

      this.readInt(10);

      if (this.currentChar.charCodeAt(0) === charCodes.dot) {
        this.unexpected("Invalid numeric literal: A number cannot contain two decimal points.", this.getLocation(), this.currentChar);
      }

      hasExponent = true;
    }

    if (this.currentChar.charCodeAt(0) === charCodes.n) {
      if (hasFraction || hasExponent || this.isIdentifier(this.source.charAt(this.position + 1))) {
        this.unexpected("Invalid bigInt literal: the suffix 'n' cannot be attached to decimal or exponent notation.", this.getLocation(), this.currentChar);
      }

      this.nextChar();

      isBigInt = true;
    }

    const raw = this.source.slice(start.index, this.position);

    if (isBigInt) {
      const value = raw.slice(0, -1);
      this.addToken(t.BigIntLiteral, start, { value, raw });
    } else {
      const value = Number(raw.replace(/_/g, ""));
      this.addToken(t.NumericLiteral, start, { value, raw });
    }
  }

  isStartOfString() {
    const code = this.currentChar.charCodeAt(0);
    return code === charCodes.singleQuote || code === charCodes.doubleQuote;
  }

  readStringLiteral() {
    const start = this.getLocation();
    const quoteCode = this.currentChar.charCodeAt(0);
    let value = "";

    this.nextChar();

    while (this.position < this.source.length) {
      const code = this.currentChar.charCodeAt(0);

      if (code === quoteCode) {
        this.nextChar();
        const raw = this.source.slice(start.index, this.position);
        this.addToken(t.StringLiteral, start, { value, raw });
        return;
      }

      if (code === charCodes.backslash) {
        this.nextChar();

        if (this.currentChar) {
          value += this.parseEscapeSequence();
          continue;
        }

        this.unexpected("Unterminated string literal: missing closing quote.", start, quoteCode === charCodes.singleQuote ? "'" : '"');
      }

      value += this.currentChar;
      this.nextChar();
    }

    this.unexpected("Unterminated string literal: missing closing quote.", start, quoteCode === charCodes.singleQuote ? "'" : '"');
  }

  parseEscapeSequence() {
    const code = this.currentChar.charCodeAt(0);
    if (Number.isNaN(code)) {
      return "";
    }

    switch (code) {
      case charCodes.n: {
        this.nextChar();
        return "\n";
      }

      case charCodes.r: {
        this.nextChar();
        return "\r";
      }

      case charCodes.t: {
        this.nextChar();
        return "\t";
      }

      case charCodes.b: {
        this.nextChar();
        return "\b";
      }

      case charCodes.f: {
        this.nextChar();
        return "\f";
      }

      case charCodes.v: {
        this.nextChar();
        return "\v";
      }

      case charCodes.zero: {
        this.nextChar();
        return "\0";
      }

      case charCodes.singleQuote: {
        this.nextChar();
        return "'";
      }

      case charCodes.doubleQuote: {
        this.nextChar();
        return '"';
      }

      case charCodes.backslash: {
        this.nextChar();
        return "\\";
      }

      case charCodes.x: {
        const hex1 = this.source.charCodeAt(this.position + 1);
        const hex2 = this.source.charCodeAt(this.position + 2);

        if (this.isValidDigit(hex1, 16) || this.isValidDigit(hex2, 16)) {
          const value = this.source.slice(this.position + 1, this.position + 3);
          this.nextChar();
          this.nextChar();
          this.nextChar();
          return String.fromCharCode(parseInt(value, 16));
        }

        this.nextChar();
        return "x";
      }

      case charCodes.u: {
        if (this.source.charCodeAt(this.position + 1) === charCodes.leftBrace) {
          let codePoint = "";
          this.nextChar();
          this.nextChar();

          while (this.currentChar && this.isValidDigit(this.currentChar.charCodeAt(0), 16)) {
            codePoint += this.currentChar;
            this.nextChar();
          }

          if (!codePoint) {
            this.unexpected("Invalid Unicode escape sequence: expected one or more hexadecimal digits inside the braces.", this.getLocation(), this.currentChar);
          }

          if (!this.currentChar || this.currentChar.charCodeAt(0) !== charCodes.rightBrace) {
            this.unexpected("Unterminated Unicode escape sequence: missing closing '}'.", this.getLocation(), this.currentChar ?? "}");
          }

          const value = parseInt(codePoint, 16);

          if (Number.isNaN(value) || value < 0 || value > 0x10ffff || (value >= 0xd800 && value <= 0xdfff)) {
            this.unexpected("Invalid Unicode code point: must be between U+0000 and U+10FFFF, excluding surrogate halves.", this.getLocation(), this.currentChar);
          }

          this.nextChar();
          return String.fromCodePoint(value);
        }

        const hex1 = this.source.charCodeAt(this.position + 1);
        const hex2 = this.source.charCodeAt(this.position + 2);
        const hex3 = this.source.charCodeAt(this.position + 3);
        const hex4 = this.source.charCodeAt(this.position + 4);

        if (
          this.isValidDigit(hex1, 16) &&
          this.isValidDigit(hex2, 16) &&
          this.isValidDigit(hex3, 16) &&
          this.isValidDigit(hex4, 16)
        ) {
          const value = this.source.slice(this.position + 1, this.position + 5);
          this.nextChar();
          this.nextChar();
          this.nextChar();
          this.nextChar();
          this.nextChar();
          return String.fromCodePoint(parseInt(value, 16));
        }

        this.nextChar();
        return "u";
      }

      default: {
        const char = this.currentChar;
        this.nextChar();
        return char;
      }
    }
  }

  isStartOfTemplate() {
    return this.currentChar.charCodeAt(0) === charCodes.backtick;
  }

  readTemplateLiteral() {
    const start = this.getLocation();
    let value = "";
    let inTemplateExpr = false;

    this.nextChar();
    this.addToken(t.TemplateLiteralBegin, start, { value: "`", raw: "`" });

    let elStartLoc = this.getLocation();

    while (this.position < this.source.length) {
      if (inTemplateExpr) {
        let braceCount = 1;

        while (this.position < this.source.length && braceCount > 0) {
          const code = this.currentChar.charCodeAt(0);

          if (code === charCodes.leftBrace) {
            braceCount++;
            const loc = this.getLocation();
            this.nextChar();
            this.addToken(t.Punctuator, loc, { value: "{", raw: "{" });
            continue;
          }

          if (code === charCodes.rightBrace) {
            braceCount--;

            if (braceCount === 0) {
              const loc = this.getLocation();
              this.nextChar();
              this.addToken(t.TemplateExpressionEnd, loc, { value: "}", raw: "}" });
              elStartLoc = this.getLocation();
              break;
            }

            const loc = this.getLocation();
            this.nextChar();
            this.addToken(t.Punctuator, loc, { value: "}", raw: "}" });
            continue;
          }

          this.main();
        }

        inTemplateExpr = false;
      }

      const code = this.currentChar.charCodeAt(0);

      if (code === charCodes.backtick) {
        const raw = this.source.slice(elStartLoc.index, this.position);
        this.addToken(t.TemplateElement, elStartLoc, { value, raw, tail: true });

        elStartLoc = this.getLocation();
        this.nextChar();
        this.addToken(t.TemplateLiteralEnd, elStartLoc, { value: "`", raw: "`" });
        return;
      }

      if (code === charCodes.dollar && this.source.charCodeAt(this.position + 1) === charCodes.leftBrace) {
        const raw = this.source.slice(elStartLoc.index, this.position);
        this.addToken(t.TemplateElement, elStartLoc, { value, raw, tail: false });

        value = "";
        elStartLoc = this.getLocation();
        this.nextChar();
        this.nextChar();
        this.addToken(t.TemplateExpressionStart, elStartLoc, { value: "${", raw: "${" });
        inTemplateExpr = true;
        continue;
      }

      if (code === charCodes.backslash) {
        this.nextChar();

        if (this.currentChar) {
          value += this.parseEscapeSequence();
          continue;
        }

        this.unexpected("Unterminated template literal: missing closing backtick.", start, "`");
      }

      value += this.currentChar;
      this.nextChar();
    }

    this.unexpected("Unterminated template literal: missing closing backtick.", start, "`");
  }

  isStartOfRegExp() {
    if (this.currentChar.charCodeAt(0) !== charCodes.slash) {
      return false;
    }

    let index = this.tokens.length - 1;
    while (
      index >= 0 &&
      (this.tokens[index].type === t.Whitespace ||
        this.tokens[index].type === t.CommentLine ||
        this.tokens[index].type === t.CommentBlock)
    ) {
      index -= 1;
    }

    const currentToken = this.tokens[index];
    if (!currentToken) {
      return true;
    }

    if (currentToken.type === t.Keyword) {
      const flag = KEYWORD_TABLE[currentToken.value] ?? 0;
      return (flag & TABLE_ENUM.BEFORE_REGEX) === TABLE_ENUM.BEFORE_REGEX;
    }

    if (currentToken.type === t.Operator || currentToken.type === t.Punctuator) {
      const flag = PUNCTUATOR_TABLE[currentToken.value] ?? 0;
      return (flag & TABLE_ENUM.BEFORE_REGEX) === TABLE_ENUM.BEFORE_REGEX;
    }

    return false;
  }

  readRegExpLiteral() {
    const start = this.getLocation();
    let inClass = false;

    this.nextChar();

    while (this.position < this.source.length) {
      const code = this.currentChar.charCodeAt(0);

      if (code === charCodes.slash && !inClass) {
        this.nextChar();

        if (!this.currentChar) {
          break;
        }

        this.nextChar();
        continue;
      }

      if (code === charCodes.leftBracket) {
        inClass = true;
        this.nextChar();

        while (this.currentChar) {
          const classCode = this.currentChar.charCodeAt(0);

          if (classCode === charCodes.backslash) {
            this.nextChar();

            if (!this.currentChar) {
              this.unexpected("Unterminated character class in regular expression: missing closing ']'.", start, "[");
            }

            this.nextChar();
            continue;
          }

          if (classCode === charCodes.rightBracket) {
            inClass = false;
            this.nextChar();
            break;
          }

          this.nextChar();
        }

        if (inClass) {
          this.unexpected("Unterminated character class in regular expression: missing closing ']'.", start, "[");
        }

        continue;
      }

      if (code === charCodes.slash && !inClass) {
        this.nextChar();

        let flags = "";
        while (this.currentChar && this.isIdentifier()) {
          flags += this.currentChar;
          this.nextChar();
        }

        const raw = this.source.slice(start.index, this.position);
        const pattern = this.source.slice(start.index + 1, this.position - flags.length - 1);
        this.addToken(t.RegExpLiteral, start, { pattern, raw, flags });
        return;
      }

      if (
        code === charCodes.lineFeed ||
        code === charCodes.carriageReturn ||
        code === charCodes.lineSeparator ||
        code === charCodes.paragraphSeparator
      ) {
        break;
      }

      this.nextChar();
    }

    this.unexpected("Unterminated regular expression literal: missing closing '/'.", start, "/");
  }

  isStartOfPunctuator() {
    const flag = PUNCTUATOR_TABLE[this.currentChar] ?? 0;

    return (
      (flag & TABLE_ENUM.OPERATOR) === TABLE_ENUM.OPERATOR || (flag & TABLE_ENUM.PUNCTUATOR) === TABLE_ENUM.PUNCTUATOR
    );
  }

  readPunctuator() {
    const code = this.currentChar.charCodeAt(0);

    switch (code) {
      case charCodes.dot:
      case charCodes.leftParen:
      case charCodes.rightParen:
      case charCodes.leftBrace:
      case charCodes.rightBrace:
      case charCodes.leftBracket:
      case charCodes.rightBracket:
      case charCodes.colon:
      case charCodes.comma:
      case charCodes.semicolon:
        this.readPunctuation();
        break;

      case charCodes.equal:
        this.readEqual();
        break;

      case charCodes.plus:
        this.readPlus();
        break;

      case charCodes.minus:
        this.readMinus();
        break;

      case charCodes.asterisk:
        this.readAsterisk();
        break;

      case charCodes.slash:
        this.readSlash();
        break;

      case charCodes.percent:
        this.readPercent();
        break;

      case charCodes.lessThan:
        this.readLessThan();
        break;

      case charCodes.greaterThan:
        this.readGreaterThan();
        break;

      case charCodes.exclamation:
        this.readExclamation();
        break;

      case charCodes.ampersand:
        this.readAmpersand();
        break;

      case charCodes.verticalBar:
        this.readVerticalBar();
        break;

      case charCodes.caret:
        this.readCaret();
        break;

      case charCodes.tilde:
        this.readTilde();
        break;

      case charCodes.question:
        this.readQuestion();
        break;

      default:
        this.unexpected();
        break;
    }
  }

  finish(type, size) {
    const start = this.getLocation();
    const value = this.source.slice(this.position, this.position + size);
    this.position += size;
    this.column += size;
    this.currentChar = this.source[this.position] || null;
    this.addToken(type, start, { value });
  }

  readEqual() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.equal) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.equal) {
        return this.finish(t.Operator, 3); // ===
      }

      return this.finish(t.Operator, 2); // ==
    }

    if (c1 === charCodes.greaterThan) {
      return this.finish(t.Operator, 2); // =>
    }

    return this.finish(t.Operator, 1); // =
  }

  readPlus() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // +=
    }

    if (c1 === charCodes.plus) {
      return this.finish(t.Operator, 2); // ++
    }

    return this.finish(t.Operator, 1); // +
  }

  readMinus() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // -=
    }

    if (c1 === charCodes.minus) {
      return this.finish(t.Operator, 2); // --
    }

    return this.finish(t.Operator, 1); // -
  }

  readAsterisk() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.asterisk) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.equal) {
        return this.finish(t.Operator, 3); // **=
      }

      return this.finish(t.Operator, 2); // **
    }

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // *=
    }

    return this.finish(t.Operator, 1); // *
  }

  readSlash() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 == charCodes.equal) {
      return this.finish(t.Operator, 2); // /=
    }

    return this.finish(t.Operator, 1); // /
  }

  readPercent() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 == charCodes.equal) {
      return this.finish(t.Operator, 2); // %=
    }

    return this.finish(t.Operator, 1); // %
  }

  readPunctuation() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.dot) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.dot) {
        return this.finish(t.Punctuator, 3); // ...
      }

      return this.unexpected();
    }

    return this.finish(t.Punctuator, 1); // . ( ) { } [ ] : , ;
  }

  readLessThan() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.lessThan) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.equal) {
        return this.finish(t.Operator, 3); // <<=
      }

      return this.finish(t.Operator, 2); // <<
    }

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // <=
    }

    return this.finish(t.Operator, 1); // <
  }

  readGreaterThan() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.greaterThan) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.greaterThan) {
        const c3 = this.source.charCodeAt(this.position + 3);

        if (c3 === charCodes.equal) {
          return this.finish(t.Operator, 4); // >>>=
        }

        return this.finish(t.Operator, 3); // >>>
      }

      if (c2 === charCodes.equal) {
        return this.finish(t.Operator, 3); // >>=
      }

      return this.finish(t.Operator, 2); // >>
    }

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // >=
    }

    return this.finish(t.Operator, 1); // >
  }

  readExclamation() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.equal) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.equal) {
        return this.finish(t.Operator, 3); // !==
      }

      return this.finish(t.Operator, 2); // !=
    }

    return this.finish(t.Operator, 1); // !
  }

  readAmpersand() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.ampersand) {
      return this.finish(t.Operator, 2); // &&
    }

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // &=
    }

    return this.finish(t.Operator, 1); // &
  }

  readVerticalBar() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.verticalBar) {
      return this.finish(t.Operator, 2); // ||
    }

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // |=
    }

    return this.finish(t.Operator, 1); // |
  }

  readCaret() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.equal) {
      return this.finish(t.Operator, 2); // ^=
    }

    return this.finish(t.Operator, 1); // ^
  }

  readTilde() {
    return this.finish(t.Operator, 1); // ~
  }

  readQuestion() {
    const c1 = this.source.charCodeAt(this.position + 1);

    if (c1 === charCodes.question) {
      const c2 = this.source.charCodeAt(this.position + 2);

      if (c2 === charCodes.equal) {
        return this.finish(t.Operator, 3); // ??=
      }

      return this.finish(t.Operator, 2); // ??
    }

    if (c1 === charCodes.dot) {
      return this.finish(t.Operator, 2); // ?.
    }

    return this.finish(t.Operator, 1); // ?
  }
}

export default Tokenizer;
