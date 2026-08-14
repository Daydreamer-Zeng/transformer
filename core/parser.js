import Tokenizer from "./tokenizer.js";
import { NODE_TYPES as NODE, TOKEN_TYPES as TYPE } from "./types.js";

class Parser {
  constructor(options = {}) {
    this.options = {
      plugins: new Set(options.plugins || []),
      strictMode: options.strictMode || false,
      sourceType: options.sourceType || "script"
    };

    this.tokenizer = new Tokenizer({
      plugins: Array.from(this.options.plugins),
      strictMode: this.options.strictMode,
      sourceType: this.options.sourceType
    });
  }

  parse(input) {
    this.tokens = this.tokenizer.tokenize(input);
    this.currentToken = this.tokens[0] || null;

    this.position = 0;
    this.line = 1;
    this.column = 0;

    this.state = {
      inForInit: false
    };
    this.comments = [];
    this.pendingComments = [];

    this.program = this.parseProgram();
    return this.program;
  }

  createNode(type, start, end, properties = {}) {
    const node = {
      type,
      start,
      end,
      ...properties
    };

    this.attachComments(node);
    return node;
  }

  next() {
    this.position++;
    this.currentToken = this.tokens[this.position] || null;

    this.parseComments();
  }

  peek(index = 1) {
    return this.tokens[this.position + index] || null;
  }

  setIndex(index) {
    this.position = index;
    this.currentToken = this.tokens[this.position] || null;
  }

  match(type, value) {
    const t = this.currentToken;
    return t && t.type === type && (value === void 0 || t.value === value);
  }

  unexpected() {
    const t = this.currentToken;
    throw new SyntaxError(`Unexpected token: ${t.value} at line ${t.start.line}, column ${t.start.column}`);
  }

  consume(type, value) {
    const t = this.currentToken;
    if (t && t.type === type && (value === void 0 || t.value === value)) {
      this.next();
      return t;
    }

    this.unexpected();
  }

  tryConsume(type, value) {
    const t = this.currentToken;
    if (t && t.type === type && (value === void 0 || t.value === value)) {
      this.next();
      return t;
    }

    return void 0;
  }

  parseProgram() {
    const body = [];

    this.parseComments();

    while (this.position < this.tokens.length) {
      const statement = this.parseStatement();

      if (statement) {
        this.attachComments(statement);
        body.push(statement);
      }
    }

    let start, end;
    if (this.tokens && this.tokens.length > 0) {
      start = this.tokens[0].start;
      end = this.tokens[this.tokens.length - 1].end;
    }

    return this.createNode(NODE.Program, start, end, {
      body,
      sourceType: this.options.sourceType,
      comments: this.comments
    });
  }

  parseComments() {
    const comments = [];

    while (
      this.currentToken &&
      (this.currentToken.type === TYPE.CommentLine || this.currentToken.type === TYPE.CommentBlock)
    ) {
      const token = this.currentToken;
      this.next();

      comments.push({
        type: token.type,
        value: token.value,
        raw: token.raw,
        start: token.start,
        end: token.end
      });
    }

    this.comments.push(...comments);
    this.pendingComments.push(...comments);

    return comments;
  }

  attachComments(node) {
    if (!node) {
      return node;
    }

    const leading = this.getLeadingComments(node);
    if (leading.length) {
      node.leadingComments = leading;
    }

    const inner = this.getInnerComments(node);
    if (inner.length) {
      node.innerComments = inner;
    }

    const trailing = this.getTrailingComments(node);
    if (trailing.length) {
      node.trailingComments = trailing;
    }

    return node;
  }

  getLeadingComments(node) {
    const leading = [];
    const remaining = [];

    for (const comment of this.pendingComments) {
      if (comment.end.index <= node.start.index) {
        leading.push(comment);
      } else {
        remaining.push(comment);
      }
    }

    this.pendingComments = remaining;

    return leading;
  }

  getInnerComments(node) {
    const inner = [];
    const remaining = [];

    for (const comment of this.pendingComments) {
      if (comment.start.index >= node.start.index && comment.end.index <= node.end.index) {
        inner.push(comment);
      } else {
        remaining.push(comment);
      }
    }

    this.pendingComments = remaining;

    return inner;
  }

  getTrailingComments(node) {
    const trailing = [];
    const remaining = [];

    for (const comment of this.pendingComments) {
      if (comment.start.index >= node.end.index && comment.start.line === node.end.line) {
        trailing.push(comment);
      } else {
        remaining.push(comment);
      }
    }

    this.pendingComments = remaining;

    return trailing;
  }

  parseStatement() {
    const t = this.currentToken;

    if (t.type === TYPE.Keyword) {
      switch (t.value) {
        case "var":
        case "let":
        case "const":
          return this.parseVariableDeclaration();

        case "function":
          return this.parseFunctionDeclaration();

        case "async":
          return this.parseAsyncDeclaration();

        case "if":
          return this.parseIfStatement();

        case "switch":
          return this.parseSwitchStatement();

        case "for":
          return this.parseForStatement();

        case "while":
          return this.parseWhileStatement();

        case "do":
          return this.parseDoWhileStatement();

        case "return":
          return this.parseReturnStatement();

        case "break":
          return this.parseBreakStatement();

        case "continue":
          return this.parseContinueStatement();

        case "yield":
          return this.parseYieldExpression();

        case "throw":
          return this.parseThrowStatement();

        case "try":
          return this.parseTryStatement();

        case "class":
          return this.parseClassDeclaration();

        case "import":
          return this.parseImportDeclaration();

        case "export":
          return this.parseExportDeclaration();

        case "debugger":
          return this.parseDebuggerStatement();

        default:
          const peek = this.peek() || {};
          if (peek.type === TYPE.Punctuator && peek.value === ":") {
            return this.parseLabeledStatement();
          }

          return this.parseExpressionStatement();
      }
    }

    if (t.type === TYPE.Punctuator) {
      if (t.value === "{") {
        return this.parseBlockStatement();
      }

      if (t.value === ";") {
        return this.parseEmptyStatement();
      }

      return this.parseExpressionStatement();
    }

    const peek = this.peek() || {};
    if (t.type === TYPE.Identifier && peek.type === TYPE.Punctuator && peek.value === ":") {
      return this.parseLabeledStatement();
    }

    return this.parseExpressionStatement();
  }

  parseVariableDeclaration(eatSemi = true) {
    const kind = this.consume(TYPE.Keyword);
    const declarations = [];
    const usedNames = new Set();

    do {
      const declarator = this.parseVariableDeclarator(kind.value);

      // Check for duplicate variable names in the same declaration
      if (declarator.id.type === NODE.Identifier) {
        if (usedNames.has(declarator.id.name)) {
          throw new SyntaxError(
            `Duplicate variable name '${declarator.id.name}' in the same declaration at line ${declarator.id.start.line}, column ${declarator.id.start.column}`
          );
        }

        usedNames.add(declarator.id.name);
      }

      declarations.push(declarator);
    } while (this.tryConsume(TYPE.Punctuator, ","));

    let ending = declarations[declarations.length - 1] || this.currentToken;

    if (eatSemi) {
      ending = this.tryConsume(TYPE.Punctuator, ";") ?? ending;
    }

    return this.createNode(NODE.VariableDeclaration, kind.start, ending.end, {
      kind: kind.value,
      declarations
    });
  }

  parseVariableDeclarator(kind) {
    const id = this.parseBindingAtom();
    let init = null;
    let ending = id;

    if (this.tryConsume(TYPE.Operator, "=")) {
      init = this.parseExpression();
      ending = init;
    }

    if (kind === "const" && !init) {
      throw new SyntaxError(
        `Missing initializer in const declaration at line ${id.start.line}, column ${id.start.column}`
      );
    }

    return this.createNode(NODE.VariableDeclarator, id.start, ending.end, {
      id,
      init
    });
  }

  parseFunctionDeclaration(start = this.currentToken.start, isAsync = false) {
    this.consume(TYPE.Keyword, "function");

    const isGenerator = !!this.tryConsume(TYPE.Operator, "*");
    const id = this.parseIdentifier();
    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();

    return this.createNode(NODE.FunctionDeclaration, start, body.end, {
      id,
      params,
      body,
      generator: isGenerator,
      async: isAsync
    });
  }

  parseAsyncDeclaration() {
    const index = this.position;
    const keyword = this.consume(TYPE.Keyword, "async");

    if (this.match(TYPE.Keyword, "function")) {
      if (keyword.start.line === this.currentToken.start.line) {
        return this.parseFunctionDeclaration(keyword.start, true);
      }
    }

    this.setIndex(index);
    return this.parseExpressionStatement();
  }

  parseIfStatement() {
    const keyword = this.consume(TYPE.Keyword, "if");
    const test = this.parseParenthesizedExpression();
    const consequent = this.parseBlockStatement();
    let alternate = null;
    let ending = consequent;

    if (this.tryConsume(TYPE.Keyword, "else")) {
      if (this.match(TYPE.Keyword, "if")) {
        alternate = this.parseIfStatement();
      } else {
        alternate = this.parseBlockStatement();
      }

      ending = alternate;
    }

    return this.createNode(NODE.IfStatement, keyword.start, ending.end, {
      test,
      consequent,
      alternate
    });
  }

  parseSwitchStatement() {
    const keyword = this.consume(TYPE.Keyword, "switch");
    const discriminant = this.parseParenthesizedExpression();
    const cases = [];

    this.consume(TYPE.Punctuator, "{");

    while (!this.match(TYPE.Punctuator, "}")) {
      cases.push(this.parseSwitchCase());
    }

    const closing = this.consume(TYPE.Punctuator, "}");

    return this.createNode(NODE.SwitchStatement, keyword.start, closing.end, {
      discriminant,
      cases
    });
  }

  parseSwitchCase() {
    let keyword = this.tryConsume(TYPE.Keyword, "case");
    const test = keyword ? this.parseExpression() : null;

    if (!test) {
      keyword = this.tryConsume(TYPE.Keyword, "default");
    }

    const colon = this.consume(TYPE.Operator, ":");
    const consequent = [];

    while (!this.match(TYPE.Keyword, "case") && !this.match(TYPE.Keyword, "default")) {
      if (this.match(TYPE.Keyword, "break")) {
        consequent.push(this.parseBreakStatement());
        break;
      }

      if (this.match(TYPE.Keyword, "return")) {
        consequent.push(this.parseReturnStatement());
        break;
      }

      const statement = this.parseStatement();
      if (statement) {
        consequent.push(statement);
      }
    }

    const ending = consequent.length > 0 ? consequent[consequent.length - 1] : colon;

    return this.createNode(NODE.SwitchCase, keyword.start, ending.end, {
      test,
      consequent
    });
  }

  parseForStatement() {
    this.state.inForInit = true;
    const keyword = this.consume(TYPE.Keyword, "for");
    let isAwait = false;

    if (this.tryConsume(TYPE.Keyword, "await")) {
      isAwait = true;
    }

    this.consume(TYPE.Punctuator, "(");

    let init = null;
    if (!this.match(TYPE.Punctuator, ";")) {
      if (this.match(TYPE.Keyword, "var") || this.match(TYPE.Keyword, "let") || this.match(TYPE.Keyword, "const")) {
        init = this.parseVariableDeclaration(false);
      } else {
        init = this.parseExpression();
      }
    }

    this.state.inForInit = false;

    // for...in
    if (this.match(TYPE.Keyword, "in")) {
      if (isAwait) {
        return this.unexpected();
      }

      this.validateForInOfLeft(init, "in");
      this.consume(TYPE.Keyword, "in");

      const right = this.parseMaybeAssign();

      this.consume(TYPE.Punctuator, ")");

      const body = this.parseBlockStatement();

      return this.createNode(NODE.ForInStatement, keyword.start, body.end, {
        left: init,
        right,
        body
      });
    }

    // for...of/for await...of
    if (this.match(TYPE.Keyword, "of")) {
      this.validateForInOfLeft(init, "of");
      this.consume(TYPE.Keyword, "of");

      const right = this.parseMaybeAssign();

      this.consume(TYPE.Punctuator, ")");

      const body = this.parseBlockStatement();

      return this.createNode(NODE.ForOfStatement, keyword.start, body.end, {
        await: isAwait,
        left: init,
        right,
        body
      });
    }

    // traditional for loop
    this.consume(TYPE.Punctuator, ";");

    let test = null;
    if (!this.match(TYPE.Punctuator, ";")) {
      test = this.parseExpression();
    }

    this.consume(TYPE.Punctuator, ";");

    let update = null;
    if (!this.match(TYPE.Punctuator, ")")) {
      update = this.parseExpression();
    }

    this.consume(TYPE.Punctuator, ")");

    const body = this.parseBlockStatement();

    return this.createNode(NODE.ForStatement, keyword.start, body.end, {
      init,
      test,
      update,
      body
    });
  }

  validateForInLeft(node) {
    if (!node) {
      return false;
    }

    switch (node.type) {
      case NODE.VariableDeclaration:
        return node.declarations.length === 1 && !node.declarations[0].init;

      case NODE.Identifier:
        return true;

      case NODE.MemberExpression:
        return true;

      case NODE.ObjectPattern:
      case NODE.ArrayPattern:
        return true;

      default:
        return false;
    }
  }

  validateForInOfLeft(init, keyword) {
    if (!init) {
      const token = this.currentToken;
      throw new SyntaxError(
        `Missing left-hand side in for-${keyword} statement at line ${token.start.line}, column ${token.start.column}`
      );
    }

    if (init.type === NODE.VariableDeclaration) {
      if (init.declarations.length !== 1) {
        throw new SyntaxError(
          `Invalid variable declaration in for-${keyword} statement at line ${init.start.line}, column ${init.start.column}`
        );
      }

      if (init.declarations[0].init) {
        throw new SyntaxError(
          `Variable declaration in for-${keyword} statement cannot have an initializer at line ${init.start.line}, column ${init.start.column}`
        );
      }
    }
  }

  parseDoWhileStatement() {
    const keyword = this.consume(TYPE.Keyword, "do");
    const body = this.parseBlockStatement();

    this.consume(TYPE.Keyword, "while");

    const test = this.parseParenthesizedExpression();
    const ending = this.tryConsume(TYPE.Punctuator, ";") || test;

    return this.createNode(NODE.DoWhileStatement, keyword.start, ending.end, {
      body,
      test
    });
  }

  parseReturnStatement() {
    const keyword = this.consume(TYPE.Keyword, "return");
    let argument = null;

    if (!this.match(TYPE.Punctuator, ";") && !this.match(TYPE.EOF)) {
      argument = this.parseExpression();
    }

    const ending = this.tryConsume(TYPE.Punctuator, ";") || argument || keyword;

    return this.createNode(NODE.ReturnStatement, keyword.start, ending.end, {
      argument
    });
  }

  parseBreakStatement() {
    const keyword = this.consume(TYPE.Keyword, "break");
    const identifier = this.tryConsume(TYPE.Identifier);
    const semi = this.tryConsume(TYPE.Punctuator, ";");

    let label = null;
    if (identifier) {
      label = this.parseIdentifier(identifier);
    }

    const ending = semi || identifier || keyword;

    return this.createNode(NODE.BreakStatement, keyword.start, ending.end, {
      label
    });
  }

  parseContinueStatement() {
    const keyword = this.consume(TYPE.Keyword, "continue");
    const identifier = this.tryConsume(TYPE.Identifier);
    const semi = this.tryConsume(TYPE.Punctuator, ";");

    let label = null;
    if (identifier) {
      label = this.parseIdentifier(identifier);
    }

    const ending = semi || identifier || keyword;

    return this.createNode(NODE.ContinueStatement, keyword.start, ending.end, {
      label
    });
  }

  parseYieldExpression() {
    const keyword = this.consume(TYPE.Keyword, "yield");
    let argument = null;

    if (!this.match(TYPE.Punctuator, ";") && !this.match(TYPE.EOF)) {
      argument = this.parseExpression();
    }

    const ending = this.tryConsume(TYPE.Punctuator, ";") || argument || keyword;

    return this.createNode(NODE.YieldExpression, keyword.start, ending.end, {
      argument,
      delegate: false
    });
  }

  parseThrowStatement() {
    const keyword = this.consume(TYPE.Keyword, "throw");
    const token = this.currentToken;
    if (token.type !== TYPE.EOF && keyword.start.line !== token.start.line) {
      throw new SyntaxError(
        `Illegal newline after throw at line ${keyword.start.line}, column ${keyword.start.column}`
      );
    }

    const argument = this.parseExpression();
    const ending = this.tryConsume(TYPE.Punctuator, ";") || argument;

    return this.createNode(NODE.ThrowStatement, keyword.start, ending.end, {
      argument
    });
  }

  parseTryStatement() {
    const keyword = this.consume(TYPE.Keyword, "try");
    const block = this.parseBlockStatement();

    let handler = null;
    let finalizer = null;

    if (this.match(TYPE.Keyword, "catch")) {
      handler = this.parseCatchClause();
    }

    if (this.tryConsume(TYPE.Keyword, "finally")) {
      finalizer = this.parseBlockStatement();
    }

    if (!handler && !finalizer) {
      throw new SyntaxError(
        `Missing catch or finally after try at line ${keyword.start.line}, column ${keyword.start.column}`
      );
    }

    const ending = finalizer || handler || block;

    return this.createNode(NODE.TryStatement, keyword.start, ending.end, {
      block,
      handler,
      finalizer
    });
  }

  parseCatchClause() {
    const keyword = this.consume(TYPE.Keyword, "catch");
    let param = null;

    if (this.match(TYPE.Punctuator, "(")) {
      this.consume(TYPE.Punctuator, "(");

      param = this.parseIdentifier();

      this.consume(TYPE.Punctuator, ")");
    }

    const body = this.parseBlockStatement();
    const starting = param ? keyword : body;

    return this.createNode(NODE.CatchClause, starting.start, body.end, {
      param,
      body
    });
  }

  parseClassDeclaration(type = NODE.ClassDeclaration) {
    const keyword = this.consume(TYPE.Keyword, "class");

    let id = null;
    if (this.match(TYPE.Identifier)) {
      const identifier = this.consume(TYPE.Identifier);
      id = this.parseIdentifier(identifier);
    } else if (type === NODE.ClassDeclaration) {
      throw new SyntaxError(`Missing class name at line ${keyword.start.line}, column ${keyword.start.column}`);
    }

    let superClass = null;
    if (this.tryConsume(TYPE.Keyword, "extends")) {
      superClass = this.parseExprSubscripts();
    }

    const body = this.parseClassBody();

    return this.createNode(type, keyword.start, body.end, {
      id,
      superClass,
      body
    });
  }

  parseClassBody() {
    const opening = this.consume(TYPE.Punctuator, "{");

    const body = [];
    while (!this.match(TYPE.Punctuator, "}")) {
      body.push(this.parseClassElement());
    }

    const closing = this.consume(TYPE.Punctuator, "}");

    return this.createNode(NODE.ClassBody, opening.start, closing.end, {
      body
    });
  }

  parseClassElement() {
    const staticToken = this.tryConsume(TYPE.Keyword, "static");
    const asyncToken = this.tryConsume(TYPE.Keyword, "async");
    const generatorToken = this.tryConsume(TYPE.Operator, "*");

    // accessor
    if (this.match(TYPE.Identifier, "get") || this.match(TYPE.Identifier, "set")) {
      return this.parseAccessorMethod(staticToken, asyncToken, generatorToken);
    }

    if (this.match(TYPE.PrivateIdentifier)) {
      return this.parseClassPrivateMember(staticToken, asyncToken, generatorToken);
    }

    if (this.match(TYPE.Punctuator, "[")) {
      return this.parseClassComputedMember(staticToken, asyncToken, generatorToken);
    }

    return this.parseClassIdentifierMember(staticToken, asyncToken, generatorToken);
  }

  parseAccessorMethod(staticToken, asyncToken, generatorToken) {
    const kind = this.consume(TYPE.Identifier);

    // Accessor Private Method
    if (this.match(TYPE.PrivateIdentifier)) {
      const key = this.parseClassPrivateName();

      if (this.match(TYPE.Punctuator, "(")) {
        const params = this.parseParamsStatement();

        if (kind.value === "set" && params.length !== 1) {
          throw new SyntaxError(`A 'set' accesor must have exactly one formal parameter.`); // TODO
        }

        const body = this.parseBlockStatement();

        const starting = staticToken || kind || key;

        return this.createNode(NODE.ClassPrivateMethod, starting.start, body.end, {
          kind: kind.value,
          computed: false,
          static: !!staticToken,
          async: false,
          generator: false,
          key,
          params,
          body
        });
      }

      throw new SyntaxError(
        `Unexpected token after #: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
      );
    }

    // Accessor Computed Method
    if (this.match(TYPE.Punctuator, "[")) {
      this.consume(TYPE.Punctuator, "[");
      const key = this.parseExpression();
      this.consume(TYPE.Punctuator, "]");

      const params = this.parseParamsStatement();

      if (kind.value === "set" && params.length !== 1) {
        throw new SyntaxError(`A 'set' accesor must have exactly one formal parameter.`); // TODO
      }

      const body = this.parseBlockStatement();
      const starting = staticToken || kind || key;

      return this.createNode(NODE.ClassMethod, starting.start, body.end, {
        kind: kind.value,
        async: false,
        static: !!staticToken,
        computed: true,
        generator: false,
        key,
        params,
        body
      });
    }

    // Method
    if (this.match(TYPE.Punctuator, "(")) {
      const key = this.createNode(NODE.Identifier, kind.start, kind.end, {
        name: kind.value
      });

      return this.parseClassMethod(staticToken, asyncToken, generatorToken, key, "method", kind);
    }

    // Accessor Method
    const identifier = this.consume(TYPE.Identifier);

    if (identifier.value === "constructor") {
      throw new SyntaxError(`Class constructor may not be an accessor.`); // TODO
    }

    const key = this.parseIdentifier();
    const params = this.parseParamsStatement();

    if (kind.value === "set" && params.length !== 1) {
      throw new SyntaxError(`A 'set' accesor must have exactly one formal parameter.`); // TODO
    }

    const body = this.parseBlockStatement();
    const starting = staticToken || kind || identifier;

    return this.createNode(NODE.ClassMethod, starting.start, body.end, {
      kind: kind.value,
      async: false,
      static: !!staticToken,
      computed: false,
      generator: false,
      key,
      params,
      body
    });
  }
  parseClassPrivateName() {
    const identifier = this.consume(TYPE.PrivateIdentifier);

    if (identifier.value === "constructor") {
      throw new SyntaxError(
        `Private member cannot be named 'constructor' at line ${identifier.start.line}, column ${identifier.start.column}`
      );
    }

    const id = this.createNode(
      NODE.Identifier,
      {
        line: identifier.start.line,
        column: identifier.start.column + 1,
        index: identifier.start.index + 1
      },
      identifier.end,
      {
        name: identifier.value
      }
    );

    return this.createNode(NODE.PrivateName, identifier.start, identifier.end, { id });
  }

  parseClassPrivateMember(staticToken, asyncToken, generatorToken) {
    const key = this.parseClassPrivateName();

    // Private Method
    if (this.match(TYPE.Punctuator, "(")) {
      return this.parseClassMethod(
        staticToken,
        asyncToken,
        generatorToken,
        key,
        "method",
        key,
        false,
        NODE.ClassPrivateMethod
      );
    }

    // Private Property
    return this.parseClassProperty(staticToken, key, key, key, null, NODE.ClassPrivateProperty);
  }

  parseClassComputedMember(staticToken, asyncToken, generatorToken) {
    const opening = this.consume(TYPE.Punctuator, "[");
    const key = this.parseExpression();
    const closing = this.consume(TYPE.Punctuator, "]");

    // Computed Method
    if (this.match(TYPE.Punctuator, "(")) {
      return this.parseClassMethod(staticToken, asyncToken, generatorToken, key, "method", opening, true);
    }

    // Computed Property
    return this.parseClassProperty(staticToken, key, opening, closing, true);
  }

  parseClassIdentifierMember(staticToken, asyncToken, generatorToken) {
    const identifier = this.consume(TYPE.Identifier);
    const key = this.parseIdentifier();

    if (this.match(TYPE.Punctuator, "(")) {
      let kind = "method";

      if (key.name === "constructor") {
        if (asyncToken) {
          throw new SyntaxError(
            `Constructor can't be an async function at line ${asyncToken.start.line}, column ${asyncToken.start.column}`
          );
        }

        if (generatorToken) {
          throw new SyntaxError(
            `Constructor can't be a generator at line ${generatorToken.start.line}, column ${generatorToken.start.column}`
          );
        }

        kind = "constructor";
      }

      // Method
      return this.parseClassMethod(staticToken, asyncToken, generatorToken, key, kind, identifier);
    }

    if (identifier.value === "constructor") {
      throw new SyntaxError(
        `Classes may not have a field named 'constructor' at line ${identifier.start.line}, column ${identifier.start.column}`
      );
    }

    // Property
    return this.parseClassProperty(staticToken, key, identifier, identifier);
  }

  parseClassMethod(
    staticToken,
    asyncToken,
    generatorToken,
    key,
    kind,
    startToken,
    computed = false,
    type = NODE.ClassMethod
  ) {
    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();
    this.tryConsume(TYPE.Punctuator, ";");
    const starting = staticToken || asyncToken || generatorToken || startToken;

    return this.createNode(type, starting.start, body.end, {
      kind,
      computed,
      static: !!staticToken,
      async: !!asyncToken,
      generator: !!generatorToken,
      key,
      params,
      body
    });
  }

  parseClassProperty(staticToken, key, startToken, endToken, computed = false, type = NODE.ClassProperty) {
    let value = null;

    if (this.tryConsume(TYPE.Operator, "=")) {
      value = this.parseMaybeAssign();
    }

    const starting = staticToken || startToken;
    const ending = this.tryConsume(TYPE.Punctuator, ";") || value || endToken;

    return this.createNode(type, starting.start, ending.end, {
      static: !!staticToken,
      computed,
      key,
      value
    });
  }

  parseImportDeclaration() {
    const index = this.position;
    const keyword = this.consume(TYPE.Keyword, "import");

    // Import expression
    if (this.match(TYPE.Punctuator, "(") || this.match(TYPE.Punctuator, ".")) {
      this.setIndex(index);
      return this.parseExpressionStatement();
    }

    // import "module-name";
    if (this.match(TYPE.StringLiteral)) {
      const source = this.parseLiteral(NODE.StringLiteral);
      const ending = this.tryConsume(TYPE.Punctuator, ";") || source;

      return this.createNode(NODE.ImportDeclaration, keyword.start, ending.end, {
        source
      });
    }

    let specifiers = [];

    // import defaultExport from "module-name";
    if (this.match(TYPE.Identifier)) {
      specifiers.push(this.parseImportDefaultSpecifier());

      if (this.match(TYPE.Punctuator, ",")) {
        this.consume(TYPE.Punctuator, ",");
      }
    }

    if (this.match(TYPE.Operator, "*")) {
      // import * as name from "module-name";
      specifiers.push(this.parseImportNamespaceSpecifier());
    } else if (this.match(TYPE.Punctuator, "{")) {
      // import { export1 , export2 as alias2 } from "module-name";
      specifiers = specifiers.concat(this.parseImportNamedSpecifiers());
    }

    this.consume(TYPE.Identifier, "from");

    const source = this.parseStringLiteral();
    const ending = this.tryConsume(TYPE.Punctuator, ";") || source;

    return this.createNode(NODE.ImportDeclaration, keyword.start, ending.end, {
      importKind: "value",
      specifiers,
      source
    });
  }

  parseImportDefaultSpecifier() {
    const local = this.parseIdentifier(identifier);

    return this.createNode(NODE.ImportDefaultSpecifier, local.start, local.end, {
      local
    });
  }

  parseImportNamespaceSpecifier() {
    const asterisk = this.consume(TYPE.Operator, "*");
    this.consume(TYPE.Identifier, "as");

    const identifier = this.consume(TYPE.Identifier);
    const local = this.parseIdentifier(identifier);

    return this.createNode(NODE.ImportNamespaceSpecifier, asterisk.start, local.end, {
      local
    });
  }

  parseImportNamedSpecifiers() {
    this.consume(TYPE.Punctuator, "{");

    const specifiers = [];

    while (!this.match(TYPE.Punctuator, "}")) {
      const importedIdentifier = this.consume(TYPE.Identifier);
      let localIdentifier = importedIdentifier;

      if (this.tryConsume(TYPE.Identifier, "as")) {
        localIdentifier = this.consume(TYPE.Identifier);
      }

      const imported = this.parseIdentifier(importedIdentifier);
      const local = this.parseIdentifier(localIdentifier);
      const specifier = this.createNode(NODE.ImportSpecifier, imported.start, local.end, {
        imported,
        local
      });

      specifiers.push(specifier);

      if (!this.tryConsume(TYPE.Punctuator, ",")) {
        break;
      }
    }

    this.consume(TYPE.Punctuator, "}");

    return specifiers;
  }

  isExportDecls(value) {
    return value === "const" || value === "let" || value === "var" || value === "function" || value === "class";
  }

  parseExportDeclaration() {
    if (!this.match(TYPE.Keyword, "export")) {
      throw new SyntaxError(
        `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
      );
    }

    const peek = this.peek();

    if (peek.type === TYPE.Keyword && peek.value === "default") {
      return this.parseExportDefaultDeclaration();
    }

    if (
      (peek.type === TYPE.Punctuator && peek.value === "{") ||
      (peek.type === TYPE.Operator && peek.value === "*") ||
      ((peek.type === TYPE.Identifier || peek.type === TYPE.Keyword) && !this.isExportDecls(peek.value))
    ) {
      return this.parseExportNamedDeclaration();
    }

    return this.parseExportDeclarationWithDeclaration();
  }

  parseExportDefaultDeclaration() {
    const keyword = this.consume(TYPE.Keyword, "export");
    this.consume(TYPE.Keyword, "default");

    let declaration = null;
    let ending;

    if (this.match(TYPE.Keyword, "function")) {
      declaration = this.parseFunctionExpression();
      declaration.type = NODE.FunctionDeclaration;
      ending = declaration;
    } else if (this.match(TYPE.Keyword, "class")) {
      declaration = this.parseClassDeclaration(NODE.ClassExpression);
      declaration.type = NODE.ClassDeclaration;
      ending = declaration;
    } else {
      declaration = this.parseMaybeAssign();
      ending = this.tryConsume(TYPE.Punctuator, ";") || declaration.end;
    }

    return this.createNode(NODE.ExportDefaultDeclaration, keyword.start, ending.end, {
      declaration
    });
  }

  parseExportNamedDeclaration(exportKind = "value") {
    const keyword = this.consume(TYPE.Keyword, "export");

    const specifiers = [];

    if (this.match(TYPE.Operator, "*")) {
      const asterisk = this.consume(TYPE.Operator, "*");

      // ExportAllDeclaration
      if (this.tryConsume(TYPE.Identifier, "from")) {
        const source = this.parseStringLiteral();
        const ending = this.tryConsume(TYPE.Punctuator, ";") || source;

        return this.createNode(NODE.ExportAllDeclaration, keyword.start, ending.end, {
          exportKind,
          source
        });
      }

      if (this.tryConsume(TYPE.Identifier, "as")) {
        const name = this.consume(TYPE.Identifier);
        const exported = this.parseIdentifier(name);
        const specifier = this.createNode(NODE.ExportNamespaceSpecifier, asterisk.start, exported.end, {
          exported
        });

        specifiers.push(specifier);

        if (this.tryConsume(TYPE.Punctuator, ",") && !this.match(TYPE.Punctuator, "{")) {
          throw new SyntaxError(
            `Unexpected ',' token: expected '{' after ',' at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
          );
        }
      }
    } else if (this.match(TYPE.Identifier) && !this.isExportDecls(this.currentToken.value)) {
      specifiers.push(this.parseExportDefaultSpecifier());
      this.tryConsume(TYPE.Punctuator, ",");
    }

    if (this.match(TYPE.Punctuator, "{")) {
      specifiers.push(...this.parseExportSpecifiers());
    }

    this.consume(TYPE.Identifier, "from");
    const source = this.parseStringLiteral();
    const ending = this.tryConsume(TYPE.Punctuator, ";") || source;

    return this.createNode(NODE.ExportNamedDeclaration, keyword.start, ending.end, {
      source,
      specifiers,
      exportKind
    });
  }

  parseExportDeclarationWithDeclaration(exportKind = "value") {
    const keyword = this.consume(TYPE.Keyword, "export");
    const token = this.currentToken;
    let declaration = null;

    switch (token.value) {
      case "const":
      case "let":
      case "var":
        declaration = this.parseVariableDeclaration();
        break;

      case "function":
        declaration = this.parseFunctionDeclaration();
        break;

      case "class":
        declaration = this.parseClassDeclaration();
        break;

      default:
        throw new SyntaxError(
          `Unexpected token: ${token.value} at line ${token.start.line}, column ${token.start.column}`
        );
    }

    return this.createNode(NODE.ExportNamedDeclaration, keyword.start, declaration.end, {
      declaration,
      exportKind
    });
  }

  parseExportDefaultSpecifier() {
    const exported = this.parseIdentifier();

    return this.createNode(NODE.ExportDefaultSpecifier, exported.start, exported.end, {
      exported
    });
  }

  parseExportSpecifiers() {
    this.consume(TYPE.Punctuator, "{");

    const specifiers = [];

    do {
      const identifier = this.consume(TYPE.Identifier);
      const local = this.parseIdentifier(identifier);
      let exported = local;

      if (this.tryConsume(TYPE.Identifier, "as")) {
        const exportedIdentifier = this.consume(TYPE.Identifier);
        exported = this.parseIdentifier(exportedIdentifier);
      }

      specifiers.push(
        this.createNode(NODE.ExportSpecifier, local.start, exported.end, {
          local,
          exported
        })
      );
    } while (this.tryConsume(TYPE.Punctuator, ","));

    this.consume(TYPE.Punctuator, "}");

    return specifiers;
  }

  parseDebuggerStatement() {
    const keyword = this.consume(TYPE.Keyword, "debugger");
    const semicolon = this.tryConsume(TYPE.Punctuator, ";");

    if (
      !semicolon &&
      !(this.currentToken.type === TYPE.CommentBlock || this.currentToken.type === TYPE.CommentLine) &&
      this.currentToken.type !== TYPE.EOF &&
      this.currentToken.value !== "}" &&
      keyword.start.line === this.currentToken.start.line
    ) {
      throw new SyntaxError(
        `Unexpected token: after 'debugger' statement ${keyword.value} at line ${keyword.start.line}, column ${keyword.start.column}`
      );
    }

    const ending = semicolon || keyword;

    return this.createNode(NODE.DebuggerStatement, keyword.start, ending.end);
  }

  parseEmptyStatement() {
    const semicolon = this.consume(TYPE.Punctuator, ";");
    return this.createNode(NODE.EmptyStatement, semicolon.start, semicolon.end);
  }

  parseAssignableListItem(isParam = false) {
    let node = this.parseMaybeDefault();

    if (isParam && this.match(TYPE.Operator, ":")) {
      node.typeAnnotation = this.parseTypeAnnotation();
      node.end = node.typeAnnotation.end;
    }

    return this.parseMaybeDefault(node);
  }

  parseMaybeDefault(node) {
    const left = node ?? this.parseBindingAtom();

    if (this.tryConsume(TYPE.Operator, "=")) {
      const right = this.parseMaybeAssign();

      return this.createNode(NODE.AssignmentPattern, left.start, right.end, {
        left,
        right
      });
    }

    return left;
  }

  parseBindingAtom() {
    if (this.match(TYPE.Identifier) || this.match(TYPE.Keyword)) {
      return this.parseIdentifier();
    }

    if (this.match(TYPE.Punctuator, "{")) {
      return this.parseObjectPattern();
    }

    if (this.match(TYPE.Punctuator, "[")) {
      return this.parseArrayPattern();
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
    );
  }

  parseObjectPattern() {
    const opening = this.consume(TYPE.Punctuator, "{");
    const properties = [];
    let trailingComma;

    while (!this.match(TYPE.Punctuator, "}")) {
      properties.push(this.parseObjectPatternProperty());

      if (this.tryConsume(TYPE.Punctuator, ",")) {
        if (this.match(TYPE.Punctuator, "}")) {
          trailingComma = properties[properties.length - 1].end;
          break;
        }
      } else {
        break;
      }
    }

    const closing = this.consume(TYPE.Punctuator, "}");
    const node = this.createNode(NODE.ObjectPattern, opening.start, closing.end, {
      properties
    });

    if (trailingComma) {
      node.trailingComma = trailingComma;
    }

    return node;
  }

  parseObjectPatternProperty() {
    if (this.match(TYPE.Punctuator, "...")) {
      return this.parseRestElement();
    }

    const key = this.parseObjectPropertyKey();
    let value = key;
    let shorthand = false;

    if (this.tryConsume(TYPE.Operator, ":")) {
      value = this.parseAssignableListItem();
    } else {
      if (this.match(TYPE.Operator, "=")) {
        value = this.parseMaybeDefault(value);
        shorthand = true;
      } else {
        if (key.type !== NODE.Identifier) {
          throw new SyntaxError(
            `Unexpected token in object pattern: ${key.value} at line ${key.start.line}, column ${key.start.column}`
          );
        }

        shorthand = true;
      }
    }

    return this.createNode(NODE.ObjectProperty, key.start, value.end, {
      method: false,
      shorthand,
      computed: false,
      key,
      value
    });
  }

  parseArrayPattern() {
    const opening = this.consume(TYPE.Punctuator, "[");

    const elements = [];

    while (!this.match(TYPE.Punctuator, "]")) {
      if (this.tryConsume(TYPE.Punctuator, ",")) {
        elements.push(null);
      } else if (this.match(TYPE.Punctuator, "...")) {
        let rest = this.parseRestElement();

        if (this.match(TYPE.Operator, ":")) {
          const typeAnnotation = this.parseTypeAnnotation();
          rest.typeAnnotation = typeAnnotation;
          rest.end = typeAnnotation.end;
        }

        elements.push(rest);

        if (this.match(TYPE.Punctuator, ",")) {
          throw new SyntaxError(
            `Unexpected token after rest element: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
          );
        }
      } else {
        elements.push(this.parseAssignableListItem(true));
        this.tryConsume(TYPE.Punctuator, ",");
      }
    }

    const closing = this.consume(TYPE.Punctuator, "]");

    return this.createNode(NODE.ArrayPattern, opening.start, closing.end, {
      elements
    });
  }

  parseLabeledStatement() {
    if (this.options.strictMode) {
      if (this.match(TYPE.Keyword, "let")) {
        throw new SyntaxError("'let' is not allowed as a label in strict mode");
      }

      if (this.match(TYPE.Keyword)) {
        throw new SyntaxError(`Unexpected reserved word '${this.currentToken.value}'`);
      }
    }

    const label = this.parseIdentifier();

    this.consume(TYPE.Punctuator, ":");

    const peek = this.peek();
    if (this.match(TYPE.Identifier) && peek?.type === TYPE.Punctuator && peek?.value === ":") {
      throw new SyntaxError("Label cannot be followed by another label");
    }

    const body = this.parseStatement();

    return this.createNode(NODE.LabeledStatement, label.start, body.end, {
      label,
      body
    });
  }

  parseExpressionStatement() {
    const expression = this.parseExpression();
    const ending = this.tryConsume(TYPE.Punctuator, ";") || expression;

    return this.createNode(NODE.ExpressionStatement, expression.start, ending.end, {
      expression
    });
  }

  parseExpression() {
    return this.parseMaybeAssign();
  }

  isAssign(value) {
    return (
      value === "=" ||
      // Arithmetic
      value === "+=" ||
      value === "-=" ||
      value === "*=" ||
      value === "/=" ||
      value === "%=" ||
      // Bitwise
      value === "&=" ||
      value === "^=" ||
      value === "|=" ||
      value === "<<=" ||
      value === ">>=" ||
      value === ">>>="
    );
  }

  parseMaybeAssign() {
    if (this.match(TYPE.Keyword, "async")) {
      const index = this.position;
      this.next();

      if (this.shouldParseAsyncArrow()) {
        return this.parseAsyncArrow(this.tokens[index].start);
      }

      this.setIndex(index);
    }

    let left = this.parseMaybeConditional();

    if (left.type === NODE.Identifier && this.tryConsume(TYPE.Operator, "=>")) {
      return this.parseArrowFunctionExpression(left.start, [left]);
    }

    if (this.currentToken.type === TYPE.Operator && this.isAssign(this.currentToken.value)) {
      if (left.type === NODE.ObjectExpression || left.type === NODE.ArrayExpression) {
        left = this.toAssignable(left);
      }

      const operator = this.currentToken.value;
      this.next();
      const right = this.parseMaybeAssign();

      left = this.createNode(NODE.AssignmentExpression, left.start, right.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  shouldParseAsyncArrow() {
    const idx = this.position;
    const t = this.tokens[idx];

    if (!t) {
      return false;
    }

    if (t.type === TYPE.Punctuator && t.value === "(") {
      let parenCount = 1;
      let index = idx + 1;
      const start = idx + 1;
      const lookahead = Math.min(this.tokens.length, start + 1000); // Arbitrary lookahead to prevent infinite loops in case of syntax errors

      while (parenCount > 0 && index < lookahead) {
        const token = this.tokens[index];

        if (token.type === TYPE.Punctuator && token.value === "(") {
          parenCount++;
        } else if (token.type === TYPE.Punctuator && token.value === ")") {
          parenCount--;
        } else if (token.type === TYPE.EOF) {
          return false;
        }

        index++;
      }

      if (parenCount > 0) {
        return false;
      }

      const next = this.tokens[index];

      if (!next || next.value !== "=>") {
        return false;
      }

      const parenToken = this.tokens[index - 1];

      if (parenToken.start.line !== next.start.line) {
        return false;
      }

      // TODO Annotations between parentheses and arrows

      const paramsTokens = this.tokens.slice(start, index - 1);

      // Check for invalid tokens in parameters
      if (paramsTokens.length === 0) {
        return true;
      }

      let i = 0;

      while (i < paramsTokens.length) {
        const token = paramsTokens[i];

        if (token.type === TYPE.Identifier) {
          i++;

          if (paramsTokens[i] && paramsTokens[i].type === TYPE.Operator && paramsTokens[i].value === ":") {
            i++;

            if (i < paramsTokens.length && paramsTokens[i].type === TYPE.Identifier) {
              i++;
            }
          }

          if (paramsTokens[i] && paramsTokens[i].type === TYPE.Operator && paramsTokens[i].value === "=") {
            i++;

            if (i < paramsTokens.length && paramsTokens[i].type === TYPE.Identifier) {
              i++;
            }
          }

          continue;
        }

        if (token.type === TYPE.Punctuator && token.value === ",") {
          i++;
          continue;
        }

        if (token.type === TYPE.Punctuator && token.value === "...") {
          i++;

          if (i < paramsTokens.length && paramsTokens[i].type === TYPE.Identifier) {
            i++;
            continue;
          }
        }

        if (token.type === TYPE.Punctuator && token.value === "{") {
          i++;
          let bracketCount = 1;

          while (i < paramsTokens.length && bracketCount > 0) {
            const target = paramsTokens[i];

            if (target.type === TYPE.Punctuator && target.value === "{") {
              bracketCount++;
            } else if (target.type === TYPE.Punctuator && target.value === "}") {
              bracketCount--;
            }

            i++;
          }

          if (bracketCount === 0) {
            continue;
          }
        }

        if (token.type === TYPE.Punctuator && token.value === "[") {
          i++;
          let bracketCount = 1;

          while (i < paramsTokens.length && bracketCount > 0) {
            const target = paramsTokens[i];

            if (target.type === TYPE.Punctuator && target.value === "[") {
              bracketCount++;
            } else if (target.type === TYPE.Punctuator && target.value === "]") {
              bracketCount--;
            }

            i++;
          }

          if (bracketCount === 0) {
            continue;
          }
        }

        return false;
      }

      return true;
    }

    const peek = this.tokens[idx + 1];
    if (!peek) {
      return false;
    }

    if (t.type === TYPE.Identifier) {
      if (
        (peek.type === TYPE.Keyword && peek.value === "yield") ||
        (peek.type === TYPE.Keyword && peek.value === "await")
      ) {
        return false;
      }

      return this.allowedParseAsyncArrow(t, peek);
    }

    if (
      t.value === "let" ||
      t.value === "static" ||
      t.value === "as" ||
      t.value === "from" ||
      t.value === "get" ||
      t.value === "set" ||
      t.value === "of" ||
      t.value === "implements" ||
      t.value === "interface" ||
      t.value === "package" ||
      t.value === "private" ||
      t.value === "protected" ||
      t.value === "public"
    ) {
      return this.allowedParseAsyncArrow(t, peek);
    }

    return false;
  }

  allowedParseAsyncArrow(token1, token2) {
    if (token2.type === TYPE.Operator && token2.value !== "=>") {
      return false;
    }

    if (token1.start.line !== token2.start.line || token2.type === TYPE.EOF) {
      return false;
    }

    if ((token2.value === "arguments" || token2.value === "eval") && this.options.isStrictMode) {
      return false;
    }

    return true;
  }

  parseAsyncArrow(start) {
    let params = [];

    if (this.match(TYPE.Punctuator, "(")) {
      params = this.parseParamsStatement();
    } else {
      params = [this.parseIdentifier()];
    }

    this.consume(TYPE.Operator, "=>");

    return this.parseArrowFunctionExpression(start, params, true);
  }

  toAssignable(node) {
    switch (node.type) {
      case NODE.ObjectExpression:
        node.type = NODE.ObjectPattern;
        node.properties.map((prop) => {
          if (prop.type === NODE.ObjectProperty) {
            prop.value = this.toAssignable(prop.value);
          } else if (prop.type === NODE.SpreadElement) {
            prop.type = NODE.RestElement;
            prop.argument = this.toAssignable(prop.argument);
          }

          return prop;
        });

        return node;

      case NODE.ArrayExpression:
        node.type = NODE.ArrayPattern;
        node.elements.map((element, index) => {
          if (!element) {
            return;
          }

          if (element.type === NODE.AssignmentExpression) {
            // Convert assignment expression inside array pattern to AssignmentPattern
            // keep the right hand side, make left assignable
            element.type = NODE.AssignmentPattern;
            element.left = this.toAssignable(element.left);
            node.elements[index] = element;
          } else if (element.type === NODE.SpreadElement) {
            // Convert spread in array to rest element and recurse on argument
            element.type = NODE.RestElement;
            element.argument = this.toAssignable(element.argument);
            node.elements[index] = element;
          } else {
            node.elements[index] = this.toAssignable(element);
          }

          return element;
        });

        return node;

      case NODE.Identifier:
      case NODE.MemberExpression:
      case NODE.RestElement:
      case NODE.AssignmentPattern:
        return node;

      default:
        throw new SyntaxError(
          `Invalid left-hand side in assignment at line ${node.start.line}, column ${node.start.column}`
        );
    }
  }

  parseMaybeConditional() {
    const test = this.parseExprOps();

    if (this.tryConsume(TYPE.Operator, "?")) {
      const consequent = this.parseMaybeAssign();

      this.consume(TYPE.Operator, ":");

      const alternate = this.parseMaybeAssign();

      return this.createNode(NODE.ConditionalExpression, test.start, alternate.end, {
        test,
        consequent,
        alternate
      });
    }

    return test;
  }

  parseExprOps() {
    let left = this.parseMaybeBinary();

    while (this.match(TYPE.Operator, "||") || this.match(TYPE.Operator, "&&") || this.match(TYPE.Operator, "??")) {
      const operator = this.currentToken.value;

      this.next();

      const right = this.parseMaybeBinary();

      left = this.createNode(NODE.LogicalExpression, left.start, right.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  isBinaryOps(value) {
    return (
      // Equality
      value === "==" ||
      value === "!=" ||
      value === "===" ||
      value === "!==" ||
      // Relational
      value === "<" ||
      value === ">" ||
      value === "<=" ||
      value === ">=" ||
      // Arithmetic
      value === "+" ||
      value === "-" ||
      value === "*" ||
      value === "/" ||
      value === "%" ||
      value === "**" ||
      // Bitwise
      value === "|" ||
      value === "&" ||
      value === "^" ||
      value === "<<" ||
      value === ">>" ||
      value === ">>>"
    );
  }

  parseMaybeBinary() {
    let left = this.parseMaybeUnary();

    while (
      (this.currentToken.type === TYPE.Operator && this.isBinaryOps(this.currentToken.value)) ||
      (this.currentToken.type === TYPE.Keyword &&
        (this.currentToken.value === "instanceof" || this.currentToken.value === "in"))
    ) {
      const operator = this.currentToken.value;

      if (operator === "in") {
        if (this.state.inForInit) {
          if (this.validateForInLeft(left)) {
            if (left.type === NODE.VariableDeclaration) {
              this.validateForInOfLeft(left, operator);
            }

            return left;
          }
        }

        if (!left) {
          throw new SyntaxError(
            `Invalid left-hand side in assignment at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
          );
        }

        if (left.type === NODE.PrivateName) {
          throw new SyntaxError(
            `Private identifier is not allowed as an assignment target at line ${left.start.line}, column ${left.start.column}`
          );
        }

        if (left.type === NODE.ObjectPattern || left.type === NODE.ArrayPattern) {
          throw new SyntaxError(
            `Invalid assignment target: cannot assign to a destructuring pattern here at line ${left.start.line}, column ${left.start.column}`
          );
        }
      }

      this.next();

      const right = this.parseMaybeUnary();

      left = this.createNode(NODE.BinaryExpression, left.start, right.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  parseMaybeUnary() {
    if (this.match(TYPE.Operator, "++") || this.match(TYPE.Operator, "--")) {
      const token = this.currentToken;

      this.next();

      const argument = this.parseMaybeUnary();

      return this.createNode(NODE.UpdateExpression, token.start, argument.end, {
        operator: token.value,
        argument,
        prefix: true
      });
    }

    if (
      this.match(TYPE.Operator, "+") ||
      this.match(TYPE.Operator, "-") ||
      this.match(TYPE.Operator, "!") ||
      this.match(TYPE.Operator, "~") ||
      this.match(TYPE.Keyword, "typeof") ||
      this.match(TYPE.Keyword, "void") ||
      this.match(TYPE.Keyword, "delete")
    ) {
      const token = this.currentToken;

      this.next();

      const argument = this.parseMaybeUnary();

      return this.createNode(NODE.UnaryExpression, token.start, argument.end, {
        operator: token.value,
        argument,
        prefix: true
      });
    }

    const argument = this.parseExprSubscripts();

    if (this.match(TYPE.Operator, "++") || this.match(TYPE.Operator, "--")) {
      const token = this.currentToken;

      this.next();

      if (argument.type === NODE.PrivateName) {
        throw new SyntaxError(
          `Private identifier is not allowed as an assignment target at line ${argument.start.line}, column ${argument.start.column}`
        );
      }

      if (argument.type === NODE.ObjectPattern || argument.type === NODE.ArrayPattern) {
        throw new SyntaxError(
          `Invalid assignment target: cannot assign to a destructuring pattern here at line ${argument.start.line}, column ${argument.start.column}`
        );
      }

      return this.createNode(NODE.UpdateExpression, argument.start, token.end, {
        operator: token.value,
        argument,
        prefix: false
      });
    }

    return argument;
  }

  parseExprSubscripts() {
    let object = this.parsePrimaryExpr();

    while (true) {
      if (this.match(TYPE.Punctuator, ".") || this.match(TYPE.Punctuator, "[")) {
        object = this.parseMemberExpr(object);

        if (this.match(TYPE.TemplateLiteralBegin, "`")) {
          object = this.parseTaggedTemplateExpression(object);
        }

        continue;
      }

      if (this.match(TYPE.Punctuator, "(")) {
        object = this.parseCallExpr(object);
        continue;
      }

      if (this.match(TYPE.Punctuator, "?.")) {
        object = this.parseOptionalExpr(object);
        continue;
      }

      break;
    }

    return object;
  }

  parseTaggedTemplateExpression(tag) {
    const quasi = this.parseTemplateLiteral();

    return this.createNode(NODE.TaggedTemplateExpression, tag.start, quasi.end, {
      tag,
      quasi
    });
  }

  parseMemberExpr(object) {
    if (this.tryConsume(TYPE.Punctuator, ".")) {
      let property = null;

      if (this.match(TYPE.Identifier) || this.match(TYPE.Keyword)) {
        property = this.parseIdentifier();
      } else {
        property = this.parseClassPrivateName();
      }

      return this.createNode(NODE.MemberExpression, object.start, property.end, {
        object,
        property,
        computed: false
      });
    }

    if (this.tryConsume(TYPE.Punctuator, "[")) {
      const property = this.parseExpression();
      const closing = this.consume(TYPE.Punctuator, "]");

      return this.createNode(NODE.MemberExpression, object.start, closing.end, {
        object,
        property,
        computed: true
      });
    }

    throw new SyntaxError(
      `Unexpected token after member expression at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
    );
  }

  parseCallExpr(callee) {
    this.consume(TYPE.Punctuator, "(");

    const args = [];

    if (!this.match(TYPE.Punctuator, ")")) {
      do {
        if (this.match(TYPE.Punctuator, "...")) {
          args.push(this.parseSpreadElement());

          if (this.match(TYPE.Punctuator, ",")) {
            throw new SyntaxError(
              `Rest element must be last element in argument list at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
            );
          }
        } else {
          args.push(this.parseMaybeAssign());
        }
      } while (this.tryConsume(TYPE.Punctuator, ","));
    }

    const closing = this.consume(TYPE.Punctuator, ")");

    return this.createNode(NODE.CallExpression, callee.start, closing.end, {
      callee,
      arguments: args
    });
  }

  parseOptionalExpr(object) {
    this.consume(TYPE.Punctuator, "?.");

    if (this.match(TYPE.Identifier)) {
      const property = this.parseIdentifier();

      return this.createNode(NODE.OptionalMemberExpression, object.start, property.end, {
        object,
        property,
        computed: false,
        optional: true
      });
    }

    if (this.tryConsume(TYPE.Punctuator, "[")) {
      const property = this.parseExpression();
      const closing = this.consume(TYPE.Punctuator, "]");

      return this.createNode(NODE.OptionalMemberExpression, object.start, closing.end, {
        object,
        property,
        computed: true,
        optional: true
      });
    }

    if (this.match(TYPE.Punctuator, "(")) {
      const expr = this.parseCallExpr(object);
      expr.type = NODE.OptionalCallExpression;
      expr.optional = true;
      return expr;
    }

    throw new SyntaxError(
      `Unexpected token after optional chaining operator at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
    );
  }

  parsePrimaryExpr() {
    if (this.match(TYPE.Keyword)) {
      switch (this.currentToken.value) {
        case "function":
          return this.parseFunctionExpression();

        case "this":
          return this.parseLiteral(NODE.ThisExpression);

        case "super":
          return this.parseLiteral(NODE.Super);

        case "new":
          return this.parseNewExpression();

        case "delete":
          return this.parseUnaryExpression();

        case "class":
          return this.parseClassDeclaration(NODE.ClassExpression);

        case "import":
          return this.parseImportExpression();

        case "async":
          return this.parseAsyncExpression();

        case "await":
          return this.parseAwaitExpression();

        default:
          return this.parseIdentifier();
      }
    }

    if (this.match(TYPE.NumericLiteral)) {
      return this.parseLiteral(NODE.NumericLiteral);
    }

    if (this.match(TYPE.BigIntLiteral)) {
      return this.parseLiteral(NODE.BigIntLiteral);
    }

    if (this.match(TYPE.StringLiteral)) {
      return this.parseLiteral(NODE.StringLiteral);
    }

    if (this.match(TYPE.BooleanLiteral)) {
      return this.parseLiteral(NODE.BooleanLiteral);
    }

    if (this.match(TYPE.NullLiteral)) {
      return this.parseLiteral(NODE.NullLiteral);
    }

    if (this.match(TYPE.Identifier)) {
      return this.parseIdentifier();
    }

    if (this.match(TYPE.Punctuator, "(")) {
      return this.parseParenthesizedExpression();
    }

    if (this.match(TYPE.Punctuator, "[")) {
      return this.parseArrayExpression();
    }

    if (this.match(TYPE.Punctuator, "{")) {
      return this.parseObjectExpression();
    }

    if (this.match(TYPE.TemplateLiteralBegin, "`")) {
      return this.parseTemplateLiteral();
    }

    if (this.match(TYPE.RegExpLiteral)) {
      return this.parseRegExpLiteral();
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
    );
  }

  parseRestElement() {
    const ellipsis = this.consume(TYPE.Punctuator, "...");
    const argument = this.parseIdentifier();

    return this.createNode(NODE.RestElement, ellipsis.start, argument.end, {
      argument
    });
  }

  parseSpreadElement() {
    const ellipsis = this.consume(TYPE.Punctuator, "...");
    const argument = this.parseMaybeAssign();

    return this.createNode(NODE.SpreadElement, ellipsis.start, argument.end, {
      argument
    });
  }

  parseTypeAnnotation() {
    const colon = this.consume(TYPE.Operator, ":");
    const id = this.parseIdentifier();

    return createNode(NODE.TypeAnnotation, colon.start, id.end, {
      typeAnnotation: createNode(NODE.GenericTypeAnnotation, id.start, id.end, {
        id: id,
        typeParameters: null
      })
    });
  }

  parseParamsStatement() {
    this.consume(TYPE.Punctuator, "(");
    const params = [];

    if (!this.match(TYPE.Punctuator, ")")) {
      do {
        if (this.match(TYPE.Punctuator, "...")) {
          let rest = this.parseRestElement();

          if (this.match(TYPE.Operator, ":")) {
            const typeAnnotation = this.parseTypeAnnotation();
            rest.typeAnnotation = typeAnnotation;
            rest.end = typeAnnotation.end;
          }

          params.push(rest);
          break;
        }

        params.push(this.parseAssignableListItem(true));
      } while (this.tryConsume(TYPE.Punctuator, ","));
    }

    this.consume(TYPE.Punctuator, ")");

    return params;
  }

  parseBlockStatement() {
    const body = [];
    const opening = this.consume(TYPE.Punctuator, "{");

    while (!this.match(TYPE.Punctuator, "}")) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    const closing = this.consume(TYPE.Punctuator, "}");

    return this.createNode(NODE.BlockStatement, opening.start, closing.end, {
      body
    });
  }

  parseFunctionExpression(start = this.currentToken.start, isAsync = false) {
    this.consume(TYPE.Keyword, "function");
    const isGenerator = !!this.tryConsume(TYPE.Operator, "*");

    let id = null;

    if (this.match(TYPE.Identifier) || this.match(TYPE.Keyword)) {
      id = this.parseIdentifier();
    }

    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();

    return this.createNode(NODE.FunctionExpression, start, body.end, {
      id,
      params,
      body,
      generator: isGenerator,
      async: isAsync
    });
  }

  parseAsyncExpression() {
    const keyword = this.consume(TYPE.Keyword, "async");

    if (this.shouldParseAsyncArrow()) {
      return this.parseAsyncArrow(keyword.start);
    }

    if (this.match(TYPE.Keyword, "function")) {
      return this.parseFunctionExpression(keyword.start, true);
    }

    return this.parseIdentifier(keyword);
  }

  parseAwaitExpression() {
    const token = this.currentToken;
    this.next();

    // if (!this.isAwait()) {
    //   throw new SyntaxError(
    //     `Unexpected reserved word 'await' at line ${token.start.line}, column ${token.start.column}`
    //   );
    // }

    const argument = this.parseMaybeUnary();

    return this.createNode(NODE.AwaitExpression, token.start, argument.end, {
      argument
    });
  }

  parseNewExpression() {
    const keyword = this.consume(TYPE.Keyword, "new");
    const callee = this.parseExprSubscripts();
    const args = [];
    let closing = callee;

    if (this.tryConsume(TYPE.Punctuator, "(")) {
      if (!this.match(TYPE.Punctuator, ")")) {
        do {
          if (this.match(TYPE.Punctuator, "...")) {
            args.push(this.parseSpreadElement());
            continue;
          }

          args.push(this.parseMaybeAssign());
        } while (this.tryConsume(TYPE.Punctuator, ","));
      }

      closing = this.consume(TYPE.Punctuator, ")");
    }

    return this.createNode(NODE.NewExpression, keyword.start, closing.end, {
      callee,
      typeArguments: null,
      arguments: args
    });
  }

  parseImportExpression() {
    const keyword = this.consume(TYPE.Keyword, "import");

    // Dynamic import
    if (this.match(TYPE.Punctuator, "(")) {
      return this.createNode(NODE.ImportExpression, keyword.start, keyword.end);
    }

    // Meta attribute
    if (this.tryConsume(TYPE.Punctuator, ".")) {
      const identifier = this.consume(TYPE.Identifier);

      if (identifier.value === "meta") {
        const meta = this.createNode(NODE.Identifier, keyword.start, keyword.end, {
          name: "import"
        });
        const property = this.createNode(NODE.Identifier, identifier.start, identifier.end, {
          name: "meta"
        });

        return this.createNode(NODE.MetaProperty, keyword.start, identifier.end, {
          meta,
          property
        });
      }
    }

    throw new SyntaxError(
      `Unexpected token after import: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
    );
  }

  parseLiteral(type) {
    const token = this.currentToken;
    this.next();

    return this.createNode(type, token.start, token.end, {
      value: token.value,
      raw: token.raw
    });
  }

  parseStringLiteral() {
    const token = this.consume(TYPE.StringLiteral);

    return this.createNode(NODE.StringLiteral, token.start, token.end, {
      value: token.value,
      raw: token.raw
    });
  }

  parseIdentifier(node) {
    const token = node ?? this.currentToken;

    if (!node) {
      this.next();
    }

    return this.createNode(NODE.Identifier, token.start, token.end, {
      name: token.value
    });
  }

  parseTemplateLiteral() {
    const opening = this.consume(TYPE.TemplateLiteralBegin, "`");

    let quasis = [];
    let expressions = [];

    while (!this.match(TYPE.TemplateLiteralEnd, "`")) {
      quasis.push(this.parseTemplateElement());

      if (this.tryConsume(TYPE.TemplateExpressionStart, "${")) {
        expressions.push(this.parseExpression());
        this.consume(TYPE.TemplateExpressionEnd, "}");
      }
    }

    const closing = this.consume(TYPE.TemplateLiteralEnd, "`");

    return this.createNode(NODE.TemplateLiteral, opening.start, closing.end, {
      quasis,
      expressions
    });
  }

  parseTemplateElement() {
    const token = this.consume(TYPE.TemplateElement);

    return this.createNode(NODE.TemplateElement, token.start, token.end, {
      value: token.value,
      raw: token.raw,
      tail: token.tail
    });
  }

  parseRegExpLiteral() {
    const token = this.consume(TYPE.RegExpLiteral);
    const pattern = token.pattern ?? "";
    const flags = token.flags ?? "";
    const raw = token.raw ?? `/${pattern}/${flags}`;

    return this.createNode(NODE.RegExpLiteral, token.start, token.end, {
      pattern,
      flags,
      raw
    });
  }

  parseParenthesizedExpression() {
    const start = this.currentToken.start;

    this.consume(TYPE.Punctuator, "(");

    if (this.tryConsume(TYPE.Punctuator, ")")) {
      if (this.tryConsume(TYPE.Operator, "=>")) {
        return this.parseArrowFunctionExpression(start, []);
      }

      throw new SyntaxError(
        `Unexpected token: ) at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
      );
    }

    const expr = this.parseExpression();
    if (this.match(TYPE.Punctuator, ",")) {
      const exprs = [expr];

      while (this.tryConsume(TYPE.Punctuator, ",")) {
        exprs.push(this.parseExpression());
      }

      this.consume(TYPE.Punctuator, ")");

      if (this.tryConsume(TYPE.Operator, "=>")) {
        return this.parseArrowFunctionExpression(start, exprs);
      }

      return this.createNode(NODE.SequenceExpression, expr.start, exprs[exprs.length - 1].end, {
        expressions: exprs
      });
    }

    this.consume(TYPE.Punctuator, ")");

    if (this.tryConsume(TYPE.Operator, "=>")) {
      return this.parseArrowFunctionExpression(start, [expr]);
    }

    return expr;
  }

  parseArrowFunctionExpression(start, params, isAsync = false) {
    let body;

    if (this.match(TYPE.Punctuator, "{")) {
      body = this.parseBlockStatement();
    } else {
      body = this.parseExpression();
    }

    return this.createNode(NODE.ArrowFunctionExpression, start, body.end, {
      params,
      body,
      async: isAsync,
      generator: false
    });
  }

  parseArrayExpression() {
    const opening = this.consume(TYPE.Punctuator, "[");
    const elements = [];

    if (!this.match(TYPE.Punctuator, "]")) {
      do {
        if (this.match(TYPE.Punctuator, ",")) {
          elements.push(null);
          continue;
        }

        if (this.match(TYPE.Punctuator, "...")) {
          elements.push(this.parseSpreadElement());
          continue;
        }

        elements.push(this.parseMaybeAssign());
      } while (this.tryConsume(TYPE.Punctuator, ","));
    }

    const closing = this.consume(TYPE.Punctuator, "]");

    return this.createNode(NODE.ArrayExpression, opening.start, closing.end, {
      elements
    });
  }

  parseObjectExpression() {
    const opening = this.consume(TYPE.Punctuator, "{");
    const properties = [];
    let trailingComma;

    if (!this.match(TYPE.Punctuator, "}")) {
      do {
        const property = this.parseObjectProperty();
        if (property) {
          properties.push(property);
        }

        if (this.tryConsume(TYPE.Punctuator, ",")) {
          if (this.match(TYPE.Punctuator, "}")) {
            trailingComma = properties[properties.length - 1].end;
            break;
          }
        } else {
          break;
        }
      } while (true);
    }

    const closing = this.consume(TYPE.Punctuator, "}");
    const node = this.createNode(NODE.ObjectExpression, opening.start, closing.end, {
      properties
    });

    if (trailingComma) {
      node.extra = {
        trailingComma
      };
    }

    return node;
  }

  parseObjectProperty() {
    const start = this.currentToken.start;

    if (this.match(TYPE.Punctuator, "...")) {
      return this.parseSpreadElement();
    }

    let isAsync = false;
    let isGenerator = false;
    let kind = "method";

    if (this.currentToken.value === "async" && (this.peek().type === TYPE.Identifier || this.peek().value === "*")) {
      isAsync = true;
      this.next();
    }

    if (this.currentToken.value === "*") {
      isGenerator = true;
      this.next();
    }

    if (this.currentToken.value === "get" || this.currentToken.value === "set") {
      const peek = this.peek();

      if (peek.value !== "(") {
        if (isGenerator) {
          throw new SyntaxError(
            `Generator methods cannot be getters or setters at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
          );
        }

        kind = this.currentToken.value;
        this.next();
      }
    }

    if (this.tryConsume(TYPE.Punctuator, "[")) {
      const key = this.parseMaybeAssign();
      this.consume(TYPE.Punctuator, "]");

      if (this.currentToken.value === "(") {
        return this.parseObjectMethod(key, kind, start, isAsync, isGenerator, true);
      }

      this.consume(TYPE.Operator, ":");

      const value = this.parseMaybeAssign();

      return this.createNode(NODE.ObjectProperty, start, value.end, {
        key,
        value,
        method: false,
        computed: true,
        shorthand: false
      });
    }

    const key = this.parseObjectPropertyKey();

    if (this.currentToken.value === "(") {
      return this.parseObjectMethod(key, kind, start, isAsync, isGenerator);
    }

    let value;

    if (this.tryConsume(TYPE.Operator, ":")) {
      value = this.parseMaybeAssign();
    } else {
      value = {
        ...key,
        range: key.range,
        extra: key.extra
      };
    }

    return this.createNode(NODE.ObjectProperty, start, value.end, {
      key,
      value,
      method: false,
      computed: false,
      shorthand: key.type === NODE.Identifier && value.type === NODE.Identifier && key.name === value.name
    });
  }

  parseObjectMethod(key, kind, start, isAsync = false, isGenerator = false, isComputed = false) {
    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();

    return this.createNode(NODE.ObjectMethod, start, body.end, {
      key,
      params,
      body,
      kind,
      method: true,
      async: isAsync,
      generator: isGenerator,
      computed: isComputed
    });
  }

  parseObjectPropertyKey() {
    if (
      this.currentToken.type === TYPE.Identifier ||
      this.currentToken.type === TYPE.Keyword ||
      this.currentToken.type === TYPE.NullLiteral ||
      this.currentToken.type === TYPE.BooleanLiteral
    ) {
      return this.parseIdentifier();
    }

    if (this.match(TYPE.NumericLiteral)) {
      return this.parseLiteral(NODE.NumericLiteral);
    }

    if (this.match(TYPE.StringLiteral)) {
      return this.parseLiteral(NODE.StringLiteral);
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.start.line}, column ${this.currentToken.start.column}`
    );
  }
}

export default Parser;
