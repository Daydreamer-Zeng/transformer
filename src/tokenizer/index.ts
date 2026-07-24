import { TOKEN_TYPES as tt } from "@/utils/types.js";
import charCodes from "@/utils/charCodes.js";
import { TokenizerOptions, NormalizedConfig, Token, Loc } from "@/types/index.js";
import {
  KEYWORD_TABLE as KWS_TABLE,
  PUNCTUATOR_TABLE as PUNCT_TABLE,
  TokenFlag as tf,
  LITERAL_TABLE
} from "./table.js";

function normalizeOptions(options: TokenizerOptions): NormalizedConfig {
  return {
    plugins: new Set(options.plugins || []),
    strictMode: options.strictMode || false,
    sourceType: options.sourceType || "module"
  };
}

export default function Tokenizer(options: TokenizerOptions) {
  const config = normalizeOptions(options);
  let tokens: Token[] = [];
  let source = "";
  let state = {
    pos: 0,
    line: 1,
    column: 0
  };

  function tokenize(input: string): Token[] {
    tokens = [];
    source = input;
    state = {
      pos: 0,
      line: 1,
      column: 0
    };

    while (state.pos < source.length) {
      scanToken();
    }

    return tokens;
  }

  function next() {
    if (state.pos >= source.length) {
      return;
    }

    const code = source.charCodeAt(state.pos);
    if (code === charCodes.carriageReturn) {
      state.line++;
      state.column = 0;
      state.pos++;

      if (source.charCodeAt(state.pos) === charCodes.lineFeed) {
        state.pos++;
      }

      return source[state.pos];
    }

    if (code === charCodes.lineFeed) {
      state.line++;
      state.column = 0;
      state.pos++;
      return source[state.pos];
    }

    state.column++;
    state.pos++;
    return source[state.pos];
  }

  function add(type: string, startLoc: Loc, properties: any = {}) {
    const endLoc = getLoc();

    tokens.push({
      type,
      start: startLoc,
      end: endLoc,
      ...properties
    });
  }

  function getLoc(): Loc {
    return {
      line: state.line,
      column: state.column,
      index: state.pos
    };
  }

  function scanToken() {
    if (isWhitespace()) {
      skipWhitespace();
      return;
    }

    if (isStartOfComment()) {
      readComment();
      return;
    }

    if (isStartOfIdentifier()) {
      readIdentifier();
      return;
    }

    if (isStartOfNumber()) {
      readNumberLiteral();
      return;
    }

    if (isStartOfString()) {
      readStringLiteral();
      return;
    }

    if (isStartOfTemplate()) {
      readTemplateLiteral();
      return;
    }

    if (isStartOfRegex()) {
      readRegExpLiteral();
      return;
    }

    if (isStartOfPunctuator()) {
      readPunctuator();
      return;
    }

    unexpected();
  }

  function unexpected() {
    throw new Error(`Unexpected token: ${source[state.pos]} at line ${state.line}, column ${state.column}`);
  }

  function isWhitespace(): boolean {
    const code = source.charCodeAt(state.pos);

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

  function skipWhitespace() {
    while (state.pos < source.length && isWhitespace()) {
      next();
    }
  }

  function isStartOfComment(): boolean {
    const peekCode = source.charCodeAt(state.pos + 1);
    return (
      source.charCodeAt(state.pos) === charCodes.slash &&
      (peekCode === charCodes.slash || peekCode === charCodes.asterisk)
    );
  }

  function readComment() {
    const startLoc = getLoc();
    const peekCode = source.charCodeAt(state.pos + 1);

    if (peekCode === charCodes.slash) {
      let value = "";
      next(); // skip '/'
      next(); // skip second '/'

      while (
        state.pos < source.length &&
        source.charCodeAt(state.pos) !== charCodes.lineFeed &&
        source.charCodeAt(state.pos) !== charCodes.carriageReturn
      ) {
        value += source[state.pos];
        next();
      }

      add(tt.CommentLine, startLoc, { value });
      return;
    }

    if (peekCode === charCodes.asterisk) {
      let closed = false;
      let value = "";
      next(); // skip '/'
      next(); // skip '*'

      while (state.pos < source.length) {
        if (
          source.charCodeAt(state.pos) === charCodes.asterisk &&
          source.charCodeAt(state.pos + 1) === charCodes.slash
        ) {
          next(); // skip '*'
          next(); // skip '/'
          closed = true;
          break;
        }

        value += source[state.pos];
        next();
      }

      if (!closed) {
        throw new Error(`Unterminated comment at line ${startLoc.line}, column ${startLoc.column}`);
      }

      add(tt.CommentBlock, startLoc, { value });
      return;
    }
  }

  function isStartOfIdentifier(): boolean {
    const code = source.charCodeAt(state.pos);

    if (
      (code >= charCodes.a && code <= charCodes.z) || // a-z
      (code >= charCodes.A && code <= charCodes.Z) || // A-Z
      code === charCodes.underscore || // _
      code === charCodes.dollar // $
    ) {
      return true;
    }

    return false;
  }

  function isKeyword(value: string): boolean {
    const flag = KWS_TABLE[value] ?? 0;

    if ((flag & tf.KEYWORD) === tf.KEYWORD) {
      return true;
    }

    return config.strictMode && (flag & tf.STRICT_MODE) === tf.STRICT_MODE;
  }

  function readIdentifier() {
    const startLoc = getLoc();
    let value = "";

    while (state.pos < source.length && isStartOfIdentifier()) {
      value += source[state.pos];
      next();
    }

    const t = LITERAL_TABLE[value];
    if (t !== void 0) {
      return add(t.type, startLoc, { value: t.value });
    }

    return add(isKeyword(value) ? tt.Keyword : tt.Identifier, startLoc, { value });
  }

  function isStartOfNumber(): boolean {
    const code = source.charCodeAt(state.pos);

    if (code >= charCodes.zero && code <= charCodes.nine) {
      return true;
    }

    if (code === charCodes.dot) {
      const peekCode = source.charCodeAt(state.pos + 1);
      return peekCode >= charCodes.zero && peekCode <= charCodes.nine;
    }

    return false;
  }

  function isNumericSeparator(code: number): boolean {
    return code === charCodes.underscore;
  }

  function isDecimalDigit(code: number): boolean {
    return code >= charCodes.zero && code <= charCodes.nine;
  }

  function isBinaryDigit(code?: number): boolean {
    return code === charCodes.zero || code === charCodes.one;
  }

  function isOctalDigit(code: number): boolean {
    return code >= charCodes.zero && code <= charCodes.seven;
  }

  function isHexDigit(code: number): boolean {
    return (
      (code >= charCodes.zero && code <= charCodes.nine) || // 0-9
      (code >= charCodes.A && code <= charCodes.F) || // A-F
      (code >= charCodes.a && code <= charCodes.f) // a-f
    );
  }

  function readNumberLiteral() {
    const startLoc = getLoc();
    let raw = "";
    let base = 10;
    let hasFraction = false;
    let hasExponent = false;
    let isBigInt = false;
    let hasBasePrefix = false;

    function isValidBaseDigit(code: number): boolean {
      switch (base) {
        case 2:
          return isBinaryDigit(code);
        case 8:
          return isOctalDigit(code);
        case 16:
          return isHexDigit(code);
        default:
          return isDecimalDigit(code);
      }
    }

    function readDigits(validator: (code: number) => boolean, allowEmpty = false): boolean {
      let count = 0;
      let lastSeparator = false;

      while (state.pos < source.length) {
        const code = source.charCodeAt(state.pos);

        if (isNumericSeparator(code)) {
          if (count === 0 || lastSeparator) {
            return false;
          }

          lastSeparator = true;
          raw += source[state.pos];
          next();
          continue;
        }

        if (!validator(code)) {
          break;
        }

        count += 1;
        lastSeparator = false;
        raw += source[state.pos];
        next();
      }

      if (count === 0) {
        return allowEmpty;
      }

      return !lastSeparator;
    }

    function readFraction(): boolean {
      if (source.charCodeAt(state.pos) !== charCodes.dot) {
        return true;
      }

      raw += source[state.pos];
      next();

      if (!readDigits(isValidBaseDigit, false)) {
        return false;
      }

      hasFraction = true;
      return true;
    }

    function readExponent(): boolean {
      const code = source.charCodeAt(state.pos);
      const isDecimal = base === 10;
      const isExponent = isDecimal
        ? code === charCodes.e || code === charCodes.E
        : code === charCodes.p || code === charCodes.P;

      if (!isExponent) {
        return true;
      }

      raw += source[state.pos];
      next();

      if (source.charCodeAt(state.pos) === charCodes.plus || source.charCodeAt(state.pos) === charCodes.minus) {
        raw += source[state.pos];
        next();
      }

      if (!readDigits(isDecimalDigit, false)) {
        return false;
      }

      hasExponent = true;
      return true;
    }

    function parseBaseValue(cleanRaw: string): number {
      if (base === 10) {
        return Number(cleanRaw);
      }

      const markerIndex = cleanRaw.search(/[pP]/);
      let mantissa = cleanRaw;
      let exponentValue = 0;

      if (markerIndex !== -1) {
        mantissa = cleanRaw.slice(0, markerIndex);
        exponentValue = Number(cleanRaw.slice(markerIndex + 1));
      }

      const prefix = mantissa.slice(0, 2).toLowerCase();
      let digits = mantissa;
      if (prefix === "0b" || prefix === "0o" || prefix === "0x") {
        digits = mantissa.slice(2);
      }

      const [integerPart, fractionPart = ""] = digits.split(".");
      let value = 0;

      for (let i = 0; i < integerPart.length; i += 1) {
        const char = integerPart[i];
        if (isNumericSeparator(char.charCodeAt(0))) {
          continue;
        }
        value = value * base + parseInt(char, 16);
      }

      let scale = base;
      for (const char of fractionPart) {
        if (isNumericSeparator(char.charCodeAt(0))) {
          continue;
        }
        value += parseInt(char, 16) / scale;
        scale *= base;
      }

      if (markerIndex !== -1) {
        value *= 2 ** exponentValue;
      }

      return value;
    }

    function createValue(): any {
      const cleanRaw = raw.replace(/_/g, "");
      if (isBigInt) {
        const bigintRaw = cleanRaw.slice(0, -1);
        try {
          return BigInt(bigintRaw);
        } catch (error) {
          throwNumericError();
        }
      }

      const value = base === 10 || (!hasFraction && !hasExponent) ? Number(cleanRaw) : parseBaseValue(cleanRaw);

      if (Number.isNaN(value)) {
        throwNumericError();
      }

      return value;
    }

    function throwNumericError() {
      throw new Error(`Invalid numeric literal: ${raw} at line ${startLoc.line}, column ${startLoc.column}`);
    }

    if (source.charCodeAt(state.pos) === charCodes.dot) {
      raw += source[state.pos];
      next();

      if (!readDigits(isDecimalDigit, false)) {
        throwNumericError();
      }

      if (!readExponent()) {
        throwNumericError();
      }

      const numeric = createValue();
      add(tt.NumericLiteral, startLoc, { raw, value: numeric });
      return;
    }

    const initialPos = state.pos;
    const initialChar = source[state.pos];

    if (initialChar.charCodeAt(0) === charCodes.zero && state.pos + 1 < source.length) {
      const peekCode = source.charCodeAt(state.pos + 1);

      if (
        peekCode === charCodes.b ||
        peekCode === charCodes.B ||
        peekCode === charCodes.o ||
        peekCode === charCodes.O ||
        peekCode === charCodes.x ||
        peekCode === charCodes.X
      ) {
        raw += source[state.pos];
        next();
        raw += source[state.pos];
        base =
          peekCode === charCodes.b || peekCode === charCodes.B
            ? 2
            : peekCode === charCodes.o || peekCode === charCodes.O
            ? 8
            : 16;
        hasBasePrefix = true;
        next();

        if (!readDigits(isValidBaseDigit, false)) {
          throwNumericError();
        }

        if (base === 16) {
          if (!readFraction()) {
            throwNumericError();
          }

          if (!readExponent()) {
            throwNumericError();
          }
        } else {
          const code = source.charCodeAt(state.pos);
          if (
            code === charCodes.dot ||
            code === charCodes.p ||
            code === charCodes.P ||
            code === charCodes.e ||
            code === charCodes.E
          ) {
            throwNumericError();
          }
        }

        if (source.charCodeAt(state.pos) === charCodes.n) {
          if (hasFraction || hasExponent) {
            throwNumericError();
          }
          isBigInt = true;
          raw += source[state.pos];
          next();
        }

        const numeric = createValue();
        add(tt.NumericLiteral, startLoc, { raw, value: numeric });
        return;
      }
    }

    if (!readDigits(isDecimalDigit, false)) {
      throwNumericError();
    }

    const initialPeekCode = source.charCodeAt(initialPos + 1);
    if (
      initialChar.charCodeAt(0) === charCodes.zero &&
      initialPeekCode !== void 0 &&
      initialPeekCode !== charCodes.underscore &&
      isDecimalDigit(initialPeekCode)
    ) {
      if (config.strictMode && !hasBasePrefix && !hasFraction && !hasExponent) {
        throwNumericError();
      }
    }

    if (source.charCodeAt(state.pos) === charCodes.dot) {
      raw += source[state.pos];
      next();

      if (!readDigits(isDecimalDigit, true)) {
        throwNumericError();
      }

      hasFraction = true;
    }

    if (!readExponent()) {
      throwNumericError();
    }

    if (source.charCodeAt(state.pos) === charCodes.n) {
      if (hasFraction || hasExponent) {
        throwNumericError();
      }
      isBigInt = true;
      raw += source[state.pos];
      next();
    }

    const numeric = createValue();
    add(tt.NumericLiteral, startLoc, { raw, value: numeric });
  }

  function isStartOfString(): boolean {
    const code = source.charCodeAt(state.pos);
    return code === charCodes.singleQuote || code === charCodes.doubleQuote;
  }

  function parseEscapeSequence(): { raw: string; cooked: string } {
    const code = source.charCodeAt(state.pos);
    if (Number.isNaN(code)) {
      return { raw: "", cooked: "" };
    }

    switch (code) {
      case charCodes.n:
        next();
        return { raw: "n", cooked: "\n" };
      case charCodes.r:
        next();
        return { raw: "r", cooked: "\r" };
      case charCodes.t:
        next();
        return { raw: "t", cooked: "\t" };
      case charCodes.b:
        next();
        return { raw: "b", cooked: "\b" };
      case charCodes.f:
        next();
        return { raw: "f", cooked: "\f" };
      case charCodes.v:
        next();
        return { raw: "v", cooked: "\v" };
      case charCodes.zero:
        next();
        return { raw: "0", cooked: "\0" };
      case charCodes.singleQuote:
        next();
        return { raw: "'", cooked: "'" };
      case charCodes.doubleQuote:
        next();
        return { raw: '"', cooked: '"' };
      case charCodes.backslash:
        next();
        return { raw: "\\", cooked: "\\" };
      case charCodes.x: {
        const d1 = source.charCodeAt(state.pos + 1);
        const d2 = source.charCodeAt(state.pos + 2);
        if (isHexDigit(d1) && isHexDigit(d2)) {
          next(); // move to first hex digit
          const h1 = source[state.pos];
          next(); // move to second hex digit
          const h2 = source[state.pos];
          next(); // move past second hex digit
          return { raw: `x${h1}${h2}`, cooked: String.fromCharCode(parseInt(h1 + h2, 16)) };
        }

        next();
        return { raw: "x", cooked: "x" };
      }
      case charCodes.u: {
        const a = source.charCodeAt(state.pos + 1);
        const b = source.charCodeAt(state.pos + 2);
        const c = source.charCodeAt(state.pos + 3);
        const d = source.charCodeAt(state.pos + 4);
        if (isHexDigit(a) && isHexDigit(b) && isHexDigit(c) && isHexDigit(d)) {
          next();
          const h1 = source[state.pos];
          next();
          const h2 = source[state.pos];
          next();
          const h3 = source[state.pos];
          next();
          const h4 = source[state.pos];
          next();
          return { raw: `u${h1}${h2}${h3}${h4}`, cooked: String.fromCharCode(parseInt(h1 + h2 + h3 + h4, 16)) };
        }

        next();
        return { raw: "u", cooked: "u" };
      }
      default: {
        const literal = source[state.pos];
        next();
        return { raw: literal, cooked: literal };
      }
    }
  }

  function readStringLiteral() {
    const startLoc = getLoc();
    const quote = source[state.pos];
    let raw = "";
    let cooked = "";

    raw += quote;
    next();

    while (state.pos < source.length) {
      const ch = source[state.pos];

      if (ch === quote) {
        raw += quote;
        next();
        add(tt.StringLiteral, startLoc, { raw, value: cooked });
        return;
      }

      if (ch === "\\") {
        raw += "\\";
        next(); // move to escape char

        if (state.pos < source.length) {
          const esc = parseEscapeSequence();
          raw += esc.raw;
          cooked += esc.cooked;
          continue;
        }

        throw new Error(`Unterminated string literal at line ${startLoc.line}, column ${startLoc.column}`);
      }

      raw += ch;
      cooked += ch;
      next();
    }

    throw new Error(`Unterminated string literal at line ${startLoc.line}, column ${startLoc.column}`);
  }

  function isStartOfTemplate(): boolean {
    return source.charCodeAt(state.pos) === charCodes.backtick;
  }

  function readTemplateLiteral() {
    const startLoc = getLoc();
    let raw = "";
    let cooked = "";
    let inTemplateExpression = false;

    // consume opening backtick
    next();

    add(tt.TemplateLiteralBegin, startLoc, { value: "`" });

    let elementStartLoc = getLoc();

    while (state.pos < source.length) {
      if (inTemplateExpression) {
        let braceDepth = 1;

        while (state.pos < source.length && braceDepth > 0) {
          const code = source.charCodeAt(state.pos);

          if (code === charCodes.leftBrace) {
            braceDepth++;
            const loc = getLoc();
            next();
            add(tt.Punctuator, loc, { value: "{" });
            continue;
          }

          if (code === charCodes.rightBrace) {
            braceDepth--;

            if (braceDepth === 0) {
              add(tt.TemplateExpressionEnd, getLoc(), { value: "}" });
              next();
              elementStartLoc = getLoc();
              break;
            } else {
              const loc = getLoc();
              next();
              add(tt.Punctuator, loc, { value: "}" });
              continue;
            }
          }

          scanToken();
        }

        inTemplateExpression = false;
      }

      if (state.pos >= source.length) {
        break;
      }

      const ch = source[state.pos];

      if (ch === "`") {
        add(tt.TemplateElement, elementStartLoc, { raw, cooked, tail: true });
        elementStartLoc = getLoc();

        next();
        add(tt.TemplateLiteralEnd, elementStartLoc, { value: "`" });
        return;
      }

      if (ch === "$" && source[state.pos + 1] === "{") {
        inTemplateExpression = true;

        add(tt.TemplateElement, elementStartLoc, { raw, cooked, tail: false });
        elementStartLoc = getLoc();
        raw = "";
        cooked = "";

        next(); // consume '$'
        next(); // consume '{'
        add(tt.TemplateExpressionStart, elementStartLoc, { value: "${" });
        continue;
      }

      if (ch === "\\") {
        raw += "\\";
        next();
        if (state.pos < source.length) {
          const esc = parseEscapeSequence();
          raw += esc.raw;
          cooked += esc.cooked;
        } else {
          throw new Error(`Unterminated template literal at line ${startLoc.line}, column ${startLoc.column}`);
        }

        continue;
      }

      raw += ch;
      cooked += ch;
      next();
    }

    throw new Error(`Unterminated template literal at line ${startLoc.line}, column ${startLoc.column}`);
  }

  function isStartOfRegex(): boolean {
    if (source.charCodeAt(state.pos) !== charCodes.slash) {
      return false;
    }

    let index = tokens.length - 1;
    while (
      index >= 0 &&
      (tokens[index].type === tt.Whitespace ||
        tokens[index].type === tt.CommentLine ||
        tokens[index].type === tt.CommentBlock)
    ) {
      index -= 1;
    }

    const current = tokens[index];
    if (!current) {
      return true;
    }

    if (current.type === tt.Keyword) {
      return (KWS_TABLE[current.value] ?? 0 & tf.BEFORE_REGEX) === tf.BEFORE_REGEX;
    }

    if (current.type === tt.Operator || current.type === tt.Punctuator) {
      return (PUNCT_TABLE[current.value] ?? 0 & tf.BEFORE_REGEX) === tf.BEFORE_REGEX;
    }

    return false;
  }

  function readRegExpLiteral() {
    const startLoc = getLoc();
    let value = "";
    let inCharClass = false;

    next(); // consume '/'

    while (state.pos < source.length) {
      const code = source.charCodeAt(state.pos);

      if (code === charCodes.backslash && !inCharClass) {
        value += source[state.pos];
        next();

        if (state.pos >= source.length) {
          throw new Error(
            `Unterminated regular expression literal at line ${startLoc.line}, column ${startLoc.column}`
          );
        }

        value += source[state.pos];
        next();
        continue;
      }

      if (code === charCodes.leftBracket) {
        inCharClass = true;
        value += source[state.pos];
        next();

        while (state.pos < source.length) {
          const classCode = source.charCodeAt(state.pos);

          if (classCode === charCodes.backslash) {
            value += source[state.pos];
            next();

            if (state.pos >= source.length) {
              throw new Error(`Unterminated character class at line ${startLoc.line}, column ${startLoc.column}`);
            }

            value += source[state.pos];
            next();
            continue;
          }

          if (classCode === charCodes.rightBracket) {
            inCharClass = false;
            value += source[state.pos];
            next();
            break;
          }

          value += source[state.pos];
          next();
        }

        if (inCharClass) {
          throw new Error(`Unterminated character class at line ${startLoc.line}, column ${startLoc.column}`);
        }

        continue;
      }

      if (code === charCodes.slash && !inCharClass) {
        next();

        let flags = "";
        while (state.pos < source.length && /^[a-zA-Z]$/.test(source[state.pos])) {
          flags += source[state.pos];
          next();
        }

        add(tt.RegExpLiteral, startLoc, { raw: `/${value}/${flags}`, pattern: value, flags });
        return;
      }

      if (
        code === charCodes.lineFeed ||
        code === charCodes.carriageReturn ||
        code === charCodes.lineSeparator ||
        code === charCodes.paragraphSeparator
      ) {
        throw new Error(`Unterminated regular expression literal at line ${startLoc.line}, column ${startLoc.column}`);
      }

      value += source[state.pos];
      next();
    }

    throw new Error(`Unterminated regular expression literal at line ${startLoc.line}, column ${startLoc.column}`);
  }

  function isStartOfPunctuator(): boolean {
    const char = source[state.pos];
    return (
      (PUNCT_TABLE[char] ?? 0 & tf.OPERATOR) === tf.OPERATOR ||
      (PUNCT_TABLE[char] ?? 0 & tf.PUNCTUATOR) === tf.PUNCTUATOR
    );
  }

  function readPunctuator() {
    const code = source.codePointAt(state.pos);

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
        readPunctuation();
        break;

      case charCodes.equal:
        readEqual();
        break;

      case charCodes.plus:
        readPlus();
        break;

      case charCodes.minus:
        readMinus();
        break;

      case charCodes.asterisk:
        readAsterisk();
        break;

      case charCodes.slash:
        readSlash();
        break;

      case charCodes.percent:
        readPercent();
        break;

      case charCodes.lessThan:
        readLessThan();
        break;

      case charCodes.greaterThan:
        readGreaterThan();
        break;

      case charCodes.exclamation:
        readExclamation();
        break;

      case charCodes.ampersand:
        readAmpersand();
        break;

      case charCodes.verticalBar:
        readVerticalBar();
        break;

      case charCodes.caret:
        readCaret();
        break;

      case charCodes.tilde:
        readTilde();
        break;

      case charCodes.question:
        readQuestion();
        break;

      default:
        unexpected();
        break;
    }
  }

  function finish(type: string, size: number) {
    const startLoc = getLoc();
    const value = source.slice(state.pos, state.pos + size);
    state.pos += size;
    return add(type, startLoc, { value });
  }

  function readEqual() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 === charCodes.equal) {
      const c2 = source.codePointAt(state.pos + 2);

      if (c2 === charCodes.equal) {
        return finish(tt.Operator, 3); // ===
      }

      return finish(tt.Operator, 2); // ==
    }

    if (c1 === charCodes.greaterThan) {
      return finish(tt.Operator, 2); // =>
    }

    return finish(tt.Operator, 1); // =
  }

  function readPlus() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // +=
    }

    if (c1 === charCodes.plus) {
      return finish(tt.Operator, 2); // ++
    }

    return finish(tt.Operator, 1); // +
  }

  function readMinus() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // -=
    }

    if (c1 === charCodes.minus) {
      return finish(tt.Operator, 2); // --
    }

    return finish(tt.Operator, 1); // -
  }

  function readAsterisk() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 === charCodes.asterisk) {
      const c2 = source.codePointAt(state.pos + 2);

      if (c2 === charCodes.equal) {
        return finish(tt.Operator, 3); // **=
      }

      return finish(tt.Operator, 2); // **
    }

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // *=
    }

    return finish(tt.Operator, 1); // *
  }

  function readSlash() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 == charCodes.equal) {
      return finish(tt.Operator, 2); // /=
    }

    return finish(tt.Operator, 1); // /
  }

  function readPercent() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 == charCodes.equal) {
      return finish(tt.Operator, 2); // %=
    }

    return finish(tt.Operator, 1); // %
  }

  function readPunctuation() {
    const c1 = source.codePointAt(state.pos + 1);

    if (c1 === charCodes.dot) {
      const c2 = source.codePointAt(state.pos + 2);

      if (c2 === charCodes.dot) {
        return finish(tt.Punctuator, 3); // ...
      }

      return unexpected();
    }

    return finish(tt.Punctuator, 1); // . ( ) { } [ ] : , ;
  }

  function readLessThan() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.lessThan) {
      const c2 = source.charCodeAt(state.pos + 2);

      if (c2 === charCodes.equal) {
        return finish(tt.Operator, 3); // <<=
      }

      return finish(tt.Operator, 2); // <<
    }

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // <=
    }

    return finish(tt.Operator, 1); // <
  }

  function readGreaterThan() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.greaterThan) {
      const c2 = source.charCodeAt(state.pos + 2);

      if (c2 === charCodes.greaterThan) {
        const c3 = source.charCodeAt(state.pos + 3);

        if (c3 === charCodes.equal) {
          return finish(tt.Operator, 4); // >>>=
        }

        return finish(tt.Operator, 3); // >>>
      }

      if (c2 === charCodes.equal) {
        return finish(tt.Operator, 3); // >>=
      }

      return finish(tt.Operator, 2); // >>
    }

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // >=
    }

    return finish(tt.Operator, 1); // >
  }

  function readExclamation() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.equal) {
      const c2 = source.charCodeAt(state.pos + 2);

      if (c2 === charCodes.equal) {
        return finish(tt.Operator, 3); // !==
      }

      return finish(tt.Operator, 2); // !=
    }

    return finish(tt.Operator, 1); // !
  }

  function readAmpersand() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.ampersand) {
      return finish(tt.Operator, 2); // &&
    }

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // &=
    }

    return finish(tt.Operator, 1); // &
  }

  function readVerticalBar() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.verticalBar) {
      return finish(tt.Operator, 2); // ||
    }

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // |=
    }

    return finish(tt.Operator, 1); // |
  }

  function readCaret() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.equal) {
      return finish(tt.Operator, 2); // ^=
    }

    return finish(tt.Operator, 1); // ^
  }

  function readTilde() {
    return finish(tt.Operator, 1); // ~
  }

  function readQuestion() {
    const c1 = source.charCodeAt(state.pos + 1);

    if (c1 === charCodes.question) {
      const c2 = source.charCodeAt(state.pos + 2);

      if (c2 === charCodes.equal) {
        return finish(tt.Operator, 3); // ??=
      }

      return finish(tt.Operator, 2); // ??
    }

    if (c1 === charCodes.dot) {
      return finish(tt.Operator, 2); // ?.
    }

    return finish(tt.Operator, 1); // ?
  }

  return {
    tokenize
  };
}
