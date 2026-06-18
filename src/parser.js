import { TOKEN_TYPES } from "./tokenizer.js";

export const NODE_TYPES = Object.freeze({
  File: "File",
  Program: "Program",
  ExpressionStatement: "ExpressionStatement",
  Identifier: "Identifier",
  Literal: "Literal",
  NumericLiteral: "NumericLiteral",
  StringLiteral: "StringLiteral",
  BooleanLiteral: "BooleanLiteral",
  NullLiteral: "NullLiteral",
  TemplateLiteral: "TemplateLiteral",
  TemplateElement: "TemplateElement",
  CallExpression: "CallExpression",
  NewExpression: "NewExpression",
  MemberExpression: "MemberExpression",
  OptionalMemberExpression: "OptionalMemberExpression",
  OptionalCallExpression: "OptionalCallExpression",
  BinaryExpression: "BinaryExpression",
  LogicalExpression: "LogicalExpression",
  UnaryExpression: "UnaryExpression",
  UpdateExpression: "UpdateExpression",
  AssignmentExpression: "AssignmentExpression",
  SequenceExpression: "SequenceExpression",
  ConditionalExpression: "ConditionalExpression",
  ArrayExpression: "ArrayExpression",
  ObjectExpression: "ObjectExpression",
  ObjectProperty: "ObjectProperty",
  ObjectMethod: "ObjectMethod",
  ObjectPattern: "ObjectPattern",
  ArrayPattern: "ArrayPattern",
  AssignmentPattern: "AssignmentPattern",
  FunctionDeclaration: "FunctionDeclaration",
  FunctionExpression: "FunctionExpression",
  ArrowFunctionExpression: "ArrowFunctionExpression",
  AwaitExpression: "AwaitExpression",
  VariableDeclaration: "VariableDeclaration",
  VariableDeclarator: "VariableDeclarator",
  ReturnStatement: "ReturnStatement",
  BlockStatement: "BlockStatement",
  IfStatement: "IfStatement",
  SwitchStatement: "SwitchStatement",
  SwitchCase: "SwitchCase",
  ForStatement: "ForStatement",
  ForInStatement: "ForInStatement",
  ForOfStatement: "ForOfStatement",
  WhileStatement: "WhileStatement",
  DoWhileStatement: "DoWhileStatement",
  BreakStatement: "BreakStatement",
  ContinueStatement: "ContinueStatement",
  YieldExpression: "YieldExpression",
  RestElement: "RestElement",
  SpreadElement: "SpreadElement",
  TypeAnnotation: "TypeAnnotation",
  GenericTypeAnnotation: "GenericTypeAnnotation",
  ThrowStatement: "ThrowStatement",
  TryStatement: "TryStatement",
  CatchClause: "CatchClause",
  EmptyStatement: "EmptyStatement",
  ClassDeclaration: "ClassDeclaration",
  ClassExpression: "ClassExpression",
  ClassBody: "ClassBody",
  ClassMethod: "ClassMethod",
  ClassProperty: "ClassProperty",
  PrivateName: "PrivateName",
  ClassPrivateProperty: "ClassPrivateProperty",
  ClassPrivateMethod: "ClassPrivateMethod",
  ThisExpression: "ThisExpression",
  Super: "Super",
  ImportDeclaration: "ImportDeclaration",
  ImportSpecifier: "ImportSpecifier",
  ImportDefaultSpecifier: "ImportDefaultSpecifier",
  ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
  Import: "Import",
  MetaProperty: "MetaProperty",
  ExportDefaultDeclaration: "ExportDefaultDeclaration",
  ExportNamedDeclaration: "ExportNamedDeclaration",
  ExportAllDeclaration: "ExportAllDeclaration",
  ExportDefaultSpecifier: "ExportDefaultSpecifier",
  ExportNamespaceSpecifier: "ExportNamespaceSpecifier",
  ExportSpecifier: "ExportSpecifier",
  DebuggerStatement: "DebuggerStatement"
});

export default class Parser {
  constructor(options = {}) {
    this.tokens = [];
    this.position = 0;
    this.currentToken = null;
    this.options = options;
    this.comments = [];
    this.leadingComments = [];
    this.trailingComments = [];
    this.errors = [];
  }

  // prettier-ignore
  // eslint-disable-next-line array-element-newline
  static ASSIGNMENT_OPS = new Set([
    // Simple
    "=",
    // Arithmetic
    "+=", "-=", "*=", "/=", "%=",
    // Bitwise
    "&=", "^=", "|=", "<<=", ">>=", ">>>="
  ]);

  // prettier-ignore
  // eslint-disable-next-line array-element-newline
  static BINARY_OPS = new Set([
    // Equality
    "==", "!=", "===", "!==",
    // Relational
    "<", ">", "<=", ">=",
    // Arithmetic
    "+", "-", "*", "/", "%", "**",
    // Bitwise
    "|", "&", "^", "<<", ">>", ">>>"
  ]);

  static EXPORT_DECLS = new Set(["const", "let", "var", "function", "class"]);

  parse(tokens) {
    this.tokens = tokens;
    this.position = 0;
    this.currentToken = tokens[0] || null;
    this.state = {
      isStrictMode: false,
      inFunction: false,
      inArrowFunction: false,
      inGenerator: false,
      inAsync: false,
      inClass: false,
      inForInit: false
    };
    this.comments = [];
    this.leadingComments = [];
    this.trailingComments = [];
    this.errors = [];

    this.parseComments();

    const body = [];
    while (this.currentToken.type !== TOKEN_TYPES.EOF) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    let startLoc = null;
    let endLoc = null;
    if (this.tokens.length > 0) {
      startLoc = this.tokens[0].loc.start;
      endLoc = this.tokens[this.tokens.length - 1].loc.end;
    }

    const program = this.createNode(NODE_TYPES.Program, startLoc, endLoc, {
      sourceType: this.options.sourceType,
      interpreter: null,
      body,
      directives: []
    });

    return this.createNode(NODE_TYPES.File, startLoc, endLoc, {
      program,
      comments: this.comments,
      errors: this.errors
    });
  }

  createNode(type, startLoc, endLoc, properties = {}) {
    return {
      type,
      start: startLoc.index,
      end: endLoc.index,
      loc: {
        start: startLoc,
        end: endLoc
      },
      ...properties
    };
  }

  match(type, value) {
    return this.currentToken.type === type && (value === undefined || this.currentToken.value === value);
  }

  nextToken() {
    this.position++;
    this.currentToken = this.tokens[this.position] || null;

    this.parseComments();

    return this.currentToken;
  }

  peekToken() {
    return this.tokens[this.position + 1];
  }

  consumeToken(type, value) {
    if (this.currentToken.type === type && (value === undefined || this.currentToken.value === value)) {
      const token = this.currentToken;
      this.nextToken();
      return token;
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }

  tryConsumeToken(type, value) {
    if (this.currentToken.type === type && (value === undefined || this.currentToken.value === value)) {
      const token = this.currentToken;
      this.nextToken();
      return token;
    }

    return null;
  }

  repositionToken(index) {
    if (index >= 0 && index < this.tokens.length) {
      this.position = index;
      this.currentToken = this.tokens[index];
      return true;
    }

    return false;
  }

  parseComments() {
    while (
      this.position < this.tokens.length &&
      (this.currentToken.type === TOKEN_TYPES.CommentBlock || this.currentToken.type === TOKEN_TYPES.CommentLine)
    ) {
      const node = this.createNode(this.currentToken.type, this.currentToken.loc.start, this.currentToken.loc.end, {
        value: this.currentToken.value
      });

      this.comments.push(node);
      this.position++;
      this.currentToken = this.tokens[this.position] || null;
    }
  }

  parseStatement() {
    if (this.currentToken.type === TOKEN_TYPES.Keyword) {
      switch (this.currentToken.value) {
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
          return this.parseExpressionStatement();
      }
    }

    if (this.currentToken.type === TOKEN_TYPES.Punctuator && this.currentToken.value === "{") {
      return this.parseBlockStatement();
    }

    if (this.currentToken.type === TOKEN_TYPES.Punctuator && this.currentToken.value === "(") {
      return this.parseExpressionStatement();
    }

    if (this.currentToken.type === TOKEN_TYPES.Punctuator && this.currentToken.value === ";") {
      return this.parseEmptyStatement();
    }

    return this.parseExpressionStatement();
  }

  parseVariableDeclaration(skipSemicolon = true) {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword);
    const declarations = [];
    const usedNames = new Set();

    do {
      const declarator = this.parseVariableDeclarator(keyword.value);

      // Check for duplicate variable names in the same declaration
      const id = declarator.id;

      if (id.type === NODE_TYPES.Identifier) {
        if (usedNames.has(id.name)) {
          throw new SyntaxError(
            `Duplicate variable name '${id.name}' in the same declaration at line ${id.loc.start.line}, column ${id.loc.start.column}`
          );
        }

        usedNames.add(id.name);
      }

      declarations.push(declarator);
    } while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ","));

    let ending = declarations[declarations.length - 1] || this.currentToken;

    if (skipSemicolon) {
      const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");

      if (semicolon) {
        ending = semicolon;
      }
    }

    return this.createNode(NODE_TYPES.VariableDeclaration, keyword.loc.start, ending.loc.end, {
      kind: keyword.value,
      declarations
    });
  }

  parseVariableDeclarator(kind) {
    const id = this.parseBindingAtom();
    let init = null;

    if (this.tryConsumeToken(TOKEN_TYPES.Operator, "=")) {
      init = this.parseExpression();
    }

    if (kind === "const" && !init) {
      throw new SyntaxError(
        `Missing initializer in const declaration at line ${id.loc.start.line}, column ${id.loc.start.column}`
      );
    }

    const ending = init || id;

    return this.createNode(NODE_TYPES.VariableDeclarator, id.loc.start, ending.loc.end, {
      id,
      init
    });
  }

  parseFunctionDeclaration() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "function");
    const isGenerator = !!this.tryConsumeToken(TOKEN_TYPES.Operator, "*");
    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
    const id = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
      name: identifier.value
    });
    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();

    return this.createNode(NODE_TYPES.FunctionDeclaration, keyword.loc.start, body.loc.end, {
      id,
      params,
      body,
      generator: isGenerator,
      async: false
    });
  }

  parseRestElement() {
    const ellipsis = this.consumeToken(TOKEN_TYPES.Punctuator, "...");
    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);

    return this.createNode(NODE_TYPES.RestElement, ellipsis.loc.start, identifier.loc.end, {
      argument: this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      })
    });
  }

  parseTypeAnnotation() {
    const colon = this.consumeToken(TOKEN_TYPES.Operator, ":");
    const typeName = this.consumeToken(TOKEN_TYPES.Identifier);

    return this.createNode(NODE_TYPES.TypeAnnotation, colon.loc.start, typeName.loc.end, {
      typeAnnotation: this.createNode(NODE_TYPES.GenericTypeAnnotation, typeName.loc.start, typeName.loc.end, {
        id: this.createNode(NODE_TYPES.Identifier, typeName.loc.start, typeName.loc.end, {
          name: typeName.value
        }),
        typeParameters: null
      })
    });
  }

  parseParamsStatement() {
    this.consumeToken(TOKEN_TYPES.Punctuator, "(");
    const params = [];

    if (!this.match(TOKEN_TYPES.Punctuator, ")")) {
      do {
        if (this.match(TOKEN_TYPES.Punctuator, "...")) {
          let rest = this.parseRestElement();

          if (this.match(TOKEN_TYPES.Operator, ":")) {
            const typeAnnotation = this.parseTypeAnnotation();
            rest.typeAnnotation = typeAnnotation;
            rest.end = typeAnnotation.end;
            rest.loc.end = typeAnnotation.loc.end;
          }

          params.push(rest);
          break;
        }

        params.push(this.parseAssignableListItem(true));
      } while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ","));
    }

    this.consumeToken(TOKEN_TYPES.Punctuator, ")");

    return params;
  }

  parseBlockStatement() {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "{");

    const body = [];
    while (!this.match(TOKEN_TYPES.Punctuator, "}")) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "}");

    return this.createNode(NODE_TYPES.BlockStatement, opening.loc.start, closing.loc.end, {
      body,
      directives: []
    });
  }

  parseAsyncDeclaration() {
    const startIndex = this.position;
    const starting = this.consumeToken(TOKEN_TYPES.Keyword, "async");
    const keyword = this.tryConsumeToken(TOKEN_TYPES.Keyword, "function");

    if (keyword && starting.loc.start.line === keyword.loc.start.line) {
      const isGenerator = !!this.tryConsumeToken(TOKEN_TYPES.Operator, "*");
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      const params = this.parseParamsStatement();
      const body = this.parseBlockStatement();

      return this.createNode(NODE_TYPES.FunctionDeclaration, starting.loc.start, body.loc.end, {
        id: this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
          name: identifier.value
        }),
        params,
        body,
        generator: isGenerator,
        async: true
      });
    }

    this.repositionToken(startIndex);
    return this.parseExpressionStatement();
  }

  parseAwaitExpression() {
    const token = this.currentToken;
    this.nextToken();
    const argument = this.parseMaybeUnary();

    return this.createNode(NODE_TYPES.AwaitExpression, token.loc.start, argument.loc.end, {
      argument
    });
  }

  parseIfStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "if");
    const test = this.parseParenthesizedExpression();
    const consequent = this.parseBlockStatement();
    let alternate = null;

    if (this.tryConsumeToken(TOKEN_TYPES.Keyword, "else")) {
      if (this.match(TOKEN_TYPES.Keyword, "if")) {
        alternate = this.parseIfStatement();
      } else {
        alternate = this.parseBlockStatement();
      }
    }

    const endLoc = alternate ? alternate.loc.end : consequent.loc.end;

    return this.createNode(NODE_TYPES.IfStatement, keyword.loc.start, endLoc, {
      test,
      consequent,
      alternate
    });
  }

  parseSwitchStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "switch");
    const discriminant = this.parseParenthesizedExpression();
    this.consumeToken(TOKEN_TYPES.Punctuator, "{");

    const cases = [];
    while (!this.match(TOKEN_TYPES.Punctuator, "}")) {
      cases.push(this.parseSwitchCase());
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "}");

    return this.createNode(NODE_TYPES.SwitchStatement, keyword.loc.start, closing.loc.end, {
      discriminant,
      cases
    });
  }

  parseSwitchCase() {
    let keyword = this.tryConsumeToken(TOKEN_TYPES.Keyword, "case");
    const test = keyword ? this.parseExpression() : null;

    if (!test) {
      keyword = this.tryConsumeToken(TOKEN_TYPES.Keyword, "default");
    }

    const colon = this.consumeToken(TOKEN_TYPES.Operator, ":");

    const consequent = [];
    while (!this.match(TOKEN_TYPES.Keyword, "case") && !this.match(TOKEN_TYPES.Keyword, "default")) {
      if (this.match(TOKEN_TYPES.Keyword, "break")) {
        consequent.push(this.parseBreakStatement());
        break;
      }

      if (this.match(TOKEN_TYPES.Keyword, "return")) {
        consequent.push(this.parseReturnStatement());
        break;
      }

      const statement = this.parseStatement();
      if (statement) {
        consequent.push(statement);
      }
    }

    const endLoc = consequent.length > 0 ? consequent[consequent.length - 1].loc.end : colon.loc.end;

    return this.createNode(NODE_TYPES.SwitchCase, keyword.loc.start, endLoc, {
      test,
      consequent
    });
  }

  parseForStatement() {
    this.state.inForInit = true;
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "for");

    this.consumeToken(TOKEN_TYPES.Punctuator, "(");

    let init = null;
    if (!this.match(TOKEN_TYPES.Punctuator, ";")) {
      if (
        this.match(TOKEN_TYPES.Keyword, "var") ||
        this.match(TOKEN_TYPES.Keyword, "let") ||
        this.match(TOKEN_TYPES.Keyword, "const")
      ) {
        init = this.parseVariableDeclaration(false);
      } else {
        init = this.parseExpression();
      }
    }

    this.state.inForInit = false;

    // for...in
    if (this.match(TOKEN_TYPES.Keyword, "in")) {
      this.validateForInOfLeft(init, "in");
      this.consumeToken(TOKEN_TYPES.Keyword, "in");

      const right = this.parseMaybeAssign();

      this.consumeToken(TOKEN_TYPES.Punctuator, ")");

      const body = this.parseBlockStatement();

      return this.createNode(NODE_TYPES.ForInStatement, keyword.loc.start, body.loc.end, {
        left: init,
        right,
        body
      });
    }

    // for...of
    if (this.match(TOKEN_TYPES.Keyword, "of")) {
      this.validateForInOfLeft(init, "of");
      this.consumeToken(TOKEN_TYPES.Keyword, "of");

      const right = this.parseMaybeAssign();

      this.consumeToken(TOKEN_TYPES.Punctuator, ")");

      const body = this.parseBlockStatement();

      return this.createNode(NODE_TYPES.ForOfStatement, keyword.loc.start, body.loc.end, {
        left: init,
        right,
        body
      });
    }

    // traditional for loop
    this.consumeToken(TOKEN_TYPES.Punctuator, ";");

    let test = null;
    if (!this.match(TOKEN_TYPES.Punctuator, ";")) {
      test = this.parseExpression();
    }

    this.consumeToken(TOKEN_TYPES.Punctuator, ";");

    let update = null;
    if (!this.match(TOKEN_TYPES.Punctuator, ")")) {
      update = this.parseExpression();
    }

    this.consumeToken(TOKEN_TYPES.Punctuator, ")");

    const body = this.parseBlockStatement();

    return this.createNode(NODE_TYPES.ForStatement, keyword.loc.start, body.loc.end, {
      init,
      test,
      update,
      body
    });
  }

  parseWhileStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "while");
    const test = this.parseParenthesizedExpression();
    const body = this.parseBlockStatement();

    return this.createNode(NODE_TYPES.WhileStatement, keyword.loc.start, body.loc.end, {
      test,
      body
    });
  }

  parseDoWhileStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "do");
    const body = this.parseBlockStatement();
    this.consumeToken(TOKEN_TYPES.Keyword, "while");
    const test = this.parseParenthesizedExpression();
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const endLoc = semicolon ? semicolon.loc.end : test.loc.end;

    return this.createNode(NODE_TYPES.DoWhileStatement, keyword.loc.start, endLoc, {
      body,
      test
    });
  }

  parseReturnStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "return");
    let argument = null;

    if (!this.match(TOKEN_TYPES.Punctuator, ";") && !this.match(TOKEN_TYPES.EOF)) {
      argument = this.parseExpression();
    }

    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const ending = semicolon || argument || keyword;

    return this.createNode(NODE_TYPES.ReturnStatement, keyword.loc.start, ending.loc.end, {
      argument
    });
  }

  parseBreakStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "break");
    const identifier = this.tryConsumeToken(TOKEN_TYPES.Identifier);
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");

    let label = null;
    if (identifier) {
      label = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });
    }

    const ending = semicolon || identifier || keyword;

    return this.createNode(NODE_TYPES.BreakStatement, keyword.loc.start, ending.loc.end, {
      label
    });
  }

  parseContinueStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "continue");
    const identifier = this.tryConsumeToken(TOKEN_TYPES.Identifier);
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");

    let label = null;
    if (identifier) {
      label = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });
    }

    const ending = semicolon || identifier || keyword;

    return this.createNode(NODE_TYPES.ContinueStatement, keyword.loc.start, ending.loc.end, {
      label
    });
  }

  parseYieldExpression() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "yield");
    let argument = null;

    if (!this.match(TOKEN_TYPES.Punctuator, ";") && !this.match(TOKEN_TYPES.EOF)) {
      argument = this.parseExpression();
    }

    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const ending = semicolon || argument || keyword;

    return this.createNode(NODE_TYPES.YieldExpression, keyword.loc.start, ending.loc.end, {
      argument,
      delegate: false
    });
  }

  parseThrowStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "throw");

    if (this.currentToken.type !== TOKEN_TYPES.EOF && keyword.loc.line !== this.currentToken.loc.line) {
      throw new SyntaxError(
        `Illegal newline after throw at line ${keyword.loc.start.line}, column ${keyword.loc.start.column}`
      );
    }

    const argument = this.parseExpression();
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const ending = semicolon || argument;

    return this.createNode(NODE_TYPES.ThrowStatement, keyword.loc.start, ending.loc.end, {
      argument
    });
  }

  parseTryStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "try");
    const block = this.parseBlockStatement();

    let handler = null;
    let finalizer = null;

    if (this.match(TOKEN_TYPES.Keyword, "catch")) {
      handler = this.parseCatchClause();
    }

    if (this.tryConsumeToken(TOKEN_TYPES.Keyword, "finally")) {
      finalizer = this.parseBlockStatement();
    }

    if (!handler && !finalizer) {
      throw new SyntaxError(
        `Missing catch or finally after try at line ${keyword.loc.start.line}, column ${keyword.loc.start.column}`
      );
    }

    const ending = finalizer || handler || block;

    return this.createNode(NODE_TYPES.TryStatement, keyword.loc.start, ending.loc.end, {
      block,
      handler,
      finalizer
    });
  }

  parseCatchClause() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "catch");
    let param = null;

    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      this.consumeToken(TOKEN_TYPES.Punctuator, "(");

      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      param = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });

      this.consumeToken(TOKEN_TYPES.Punctuator, ")");
    }

    const body = this.parseBlockStatement();
    const startLoc = param ? keyword.loc.start : body.loc.start;

    return this.createNode(NODE_TYPES.CatchClause, startLoc, body.loc.end, {
      param,
      body
    });
  }

  parseClassDeclaration(type = NODE_TYPES.ClassDeclaration) {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "class");

    let id = null;
    if (this.match(TOKEN_TYPES.Identifier)) {
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      id = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });
    } else if (type === NODE_TYPES.ClassDeclaration) {
      throw new SyntaxError(`Missing class name at line ${keyword.loc.start.line}, column ${keyword.loc.start.column}`);
    }

    let superClass = null;
    if (this.tryConsumeToken(TOKEN_TYPES.Keyword, "extends")) {
      superClass = this.parseExprSubscripts();
    }

    const body = this.parseClassBody();

    return this.createNode(type, keyword.loc.start, body.loc.end, {
      id,
      superClass,
      body
    });
  }

  parseClassBody() {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "{");

    const body = [];
    while (!this.match(TOKEN_TYPES.Punctuator, "}")) {
      body.push(this.parseClassElement());
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "}");

    return this.createNode(NODE_TYPES.ClassBody, opening.loc.start, closing.loc.end, {
      body
    });
  }

  parseClassElement() {
    const staticToken = this.tryConsumeToken(TOKEN_TYPES.Keyword, "static");
    const asyncToken = this.tryConsumeToken(TOKEN_TYPES.Keyword, "async");
    const generatorToken = this.tryConsumeToken(TOKEN_TYPES.Operator, "*");

    // accessor
    if (this.match(TOKEN_TYPES.Identifier, "get") || this.match(TOKEN_TYPES.Identifier, "set")) {
      return this.parseAccessorMethod(staticToken, asyncToken, generatorToken);
    }

    if (this.match(TOKEN_TYPES.PrivateIdentifier)) {
      return this.parseClassPrivateMember(staticToken, asyncToken, generatorToken);
    }

    if (this.match(TOKEN_TYPES.Punctuator, "[")) {
      return this.parseClassComputedMember(staticToken, asyncToken, generatorToken);
    }

    return this.parseClassIdentifierMember(staticToken, asyncToken, generatorToken);
  }

  parseAccessorMethod(staticToken, asyncToken, generatorToken) {
    const kind = this.consumeToken(TOKEN_TYPES.Identifier);

    // Accessor Private Method
    if (this.match(TOKEN_TYPES.PrivateIdentifier)) {
      const key = this.parseClassPrivateName();

      if (this.match(TOKEN_TYPES.Punctuator, "(")) {
        const params = this.parseParamsStatement();

        if (kind.value === "set" && params.length !== 1) {
          throw new SyntaxError(`A 'set' accesor must have exactly one formal parameter.`); // TODO
        }

        const body = this.parseBlockStatement();

        const starting = staticToken || kind || key;

        return this.createNode(NODE_TYPES.ClassPrivateMethod, starting.loc.start, body.loc.end, {
          kind: kind.value,
          id: null,
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
        `Unexpected token after #: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
      );
    }

    // Accessor Computed Method
    if (this.match(TOKEN_TYPES.Punctuator, "[")) {
      this.consumeToken(TOKEN_TYPES.Punctuator, "[");
      const key = this.parseExpression();
      this.consumeToken(TOKEN_TYPES.Punctuator, "]");

      const params = this.parseParamsStatement();

      if (kind.value === "set" && params.length !== 1) {
        throw new SyntaxError(`A 'set' accesor must have exactly one formal parameter.`); // TODO
      }

      const body = this.parseBlockStatement();
      const starting = staticToken || kind || key;

      return this.createNode(NODE_TYPES.ClassMethod, starting.loc.start, body.loc.end, {
        id: null,
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
    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      const key = this.createNode(NODE_TYPES.Identifier, kind.loc.start, kind.loc.end, {
        name: kind.value
      });

      return this.parseClassMethod(staticToken, asyncToken, generatorToken, key, "method", kind);
    }

    // Accessor Method
    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);

    if (identifier.value === "constructor") {
      throw new SyntaxError(`Class constructor may not be an accessor.`); // TODO
    }

    const key = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
      name: identifier.value
    });
    const params = this.parseParamsStatement();

    if (kind.value === "set" && params.length !== 1) {
      throw new SyntaxError(`A 'set' accesor must have exactly one formal parameter.`); // TODO
    }

    const body = this.parseBlockStatement();
    const starting = staticToken || kind || identifier;

    return this.createNode(NODE_TYPES.ClassMethod, starting.loc.start, body.loc.end, {
      id: null,
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
    const identifier = this.consumeToken(TOKEN_TYPES.PrivateIdentifier);

    if (identifier.value === "constructor") {
      throw new SyntaxError(
        `Private member cannot be named 'constructor' at line ${identifier.loc.start.line}, column ${identifier.loc.start.column}`
      );
    }

    const startLoc = identifier.loc.start;
    const id = this.createNode(
      NODE_TYPES.Identifier,
      {
        line: startLoc.line,
        column: startLoc.column + 1,
        index: startLoc.index + 1
      },
      identifier.loc.end,
      {
        name: identifier.value
      }
    );

    return this.createNode(NODE_TYPES.PrivateName, startLoc, identifier.loc.end, { id });
  }

  parseClassPrivateMember(staticToken, asyncToken, generatorToken) {
    const key = this.parseClassPrivateName();

    // Private Method
    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      return this.parseClassMethod(
        staticToken,
        asyncToken,
        generatorToken,
        key,
        "method",
        key,
        false,
        NODE_TYPES.ClassPrivateMethod
      );
    }

    // Private Property
    return this.parseClassProperty(staticToken, key, key, key, null, NODE_TYPES.ClassPrivateProperty);
  }

  parseClassComputedMember(staticToken, asyncToken, generatorToken) {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "[");
    const key = this.parseExpression();
    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "]");

    // Computed Method
    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      return this.parseClassMethod(staticToken, asyncToken, generatorToken, key, "method", opening, true);
    }

    // Computed Property
    return this.parseClassProperty(staticToken, key, opening, closing, true);
  }

  parseClassIdentifierMember(staticToken, asyncToken, generatorToken) {
    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
    const key = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
      name: identifier.value
    });

    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      let kind = "method";

      if (key.name === "constructor") {
        if (asyncToken) {
          throw new SyntaxError(
            `Constructor can't be an async function at line ${asyncToken.loc.start.line}, column ${asyncToken.loc.start.column}`
          );
        }

        if (generatorToken) {
          throw new SyntaxError(
            `Constructor can't be a generator at line ${generatorToken.loc.start.line}, column ${generatorToken.loc.start.column}`
          );
        }

        kind = "constructor";
      }

      // Method
      return this.parseClassMethod(staticToken, asyncToken, generatorToken, key, kind, identifier);
    }

    if (identifier.value === "constructor") {
      throw new SyntaxError(
        `Classes may not have a field named 'constructor' at line ${identifier.loc.start.line}, column ${identifier.loc.start.column}`
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
    startLoc,
    computed = false,
    type = NODE_TYPES.ClassMethod
  ) {
    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();
    this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const starting = staticToken || asyncToken || generatorToken || startLoc;

    return this.createNode(type, starting.loc.start, body.loc.end, {
      kind,
      id: null,
      computed,
      static: !!staticToken,
      async: !!asyncToken,
      generator: !!generatorToken,
      key,
      params,
      body
    });
  }

  parseClassProperty(staticToken, key, startLoc, endLoc, computed = false, type = NODE_TYPES.ClassProperty) {
    let value = null;

    if (this.match(TOKEN_TYPES.Operator, "=")) {
      this.consumeToken(TOKEN_TYPES.Operator, "=");
      value = this.parseMaybeAssign();
    }

    const starting = staticToken || startLoc;
    const ending = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";") || value || endLoc;

    return this.createNode(type, starting.loc.start, ending.loc.end, {
      static: !!staticToken,
      variance: null,
      computed,
      key,
      value
    });
  }

  parseImportDeclaration() {
    const index = this.position;
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "import");

    // Import expression
    if (this.match(TOKEN_TYPES.Punctuator, "(") || this.match(TOKEN_TYPES.Punctuator, ".")) {
      this.repositionToken(index);
      return this.parseExpressionStatement();
    }

    // import "module-name";
    if (this.match(TOKEN_TYPES.StringLiteral)) {
      const source = this.parseStringLiteral();
      const ending = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";") || source;

      return this.createNode(NODE_TYPES.ImportDeclaration, keyword.loc.start, ending.loc.end, {
        assertions: [],
        specifiers: [],
        source
      });
    }

    let specifiers = [];

    // import defaultExport from "module-name";
    if (this.match(TOKEN_TYPES.Identifier)) {
      specifiers.push(this.parseImportDefaultSpecifier());

      if (this.match(TOKEN_TYPES.Punctuator, ",")) {
        this.consumeToken(TOKEN_TYPES.Punctuator, ",");
      }
    }

    if (this.match(TOKEN_TYPES.Operator, "*")) {
      // import * as name from "module-name";
      specifiers.push(this.parseImportNamespaceSpecifier());
    } else if (this.match(TOKEN_TYPES.Punctuator, "{")) {
      // import { export1 , export2 as alias2 } from "module-name";
      specifiers = specifiers.concat(this.parseImportNamedSpecifiers());
    }

    this.consumeToken(TOKEN_TYPES.Identifier, "from");

    const source = this.parseStringLiteral();
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";") || source;

    return this.createNode(NODE_TYPES.ImportDeclaration, keyword.loc.start, semicolon.loc.end, {
      importKind: "value",
      assertions: [],
      specifiers,
      source
    });
  }

  parseImportDefaultSpecifier() {
    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
    const local = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
      name: identifier.value
    });

    return this.createNode(NODE_TYPES.ImportDefaultSpecifier, identifier.loc.start, identifier.loc.end, {
      local
    });
  }

  parseImportNamespaceSpecifier() {
    const asterisk = this.consumeToken(TOKEN_TYPES.Operator, "*");
    this.consumeToken(TOKEN_TYPES.Identifier, "as");

    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
    const local = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
      name: identifier.value
    });

    return this.createNode(NODE_TYPES.ImportNamespaceSpecifier, asterisk.loc.start, identifier.loc.end, {
      local
    });
  }

  parseImportNamedSpecifiers() {
    this.consumeToken(TOKEN_TYPES.Punctuator, "{");

    const specifiers = [];

    while (!this.match(TOKEN_TYPES.Punctuator, "}")) {
      const importedIdentifier = this.consumeToken(TOKEN_TYPES.Identifier);
      let localIdentifier = importedIdentifier;

      if (this.tryConsumeToken(TOKEN_TYPES.Identifier, "as")) {
        localIdentifier = this.consumeToken(TOKEN_TYPES.Identifier);
      }

      const imported = this.createNode(
        NODE_TYPES.Identifier,
        importedIdentifier.loc.start,
        importedIdentifier.loc.end,
        {
          name: importedIdentifier.value
        }
      );

      const local = this.createNode(NODE_TYPES.Identifier, localIdentifier.loc.start, localIdentifier.loc.end, {
        name: localIdentifier.value
      });

      specifiers.push(
        this.createNode(NODE_TYPES.ImportSpecifier, importedIdentifier.loc.start, localIdentifier.loc.end, {
          importKind: null,
          imported,
          local
        })
      );

      if (!this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",")) {
        break;
      }
    }

    this.consumeToken(TOKEN_TYPES.Punctuator, "}");

    return specifiers;
  }

  parseExportDeclaration() {
    if (!this.match(TOKEN_TYPES.Keyword, "export")) {
      throw new SyntaxError(
        `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
      );
    }

    const peek = this.peekToken();

    if (peek.type === TOKEN_TYPES.Keyword && peek.value === "default") {
      return this.parseExportDefaultDeclaration();
    }

    if (
      (peek.type === TOKEN_TYPES.Punctuator && peek.value === "{") ||
      (peek.type === TOKEN_TYPES.Operator && peek.value === "*") ||
      (peek.type === TOKEN_TYPES.Identifier && !Parser.EXPORT_DECLS.has(peek.value))
    ) {
      return this.parseExportNamedDeclaration();
    }

    return this.parseExportDeclarationWithDeclaration();
  }

  parseExportDefaultDeclaration() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "export");
    this.consumeToken(TOKEN_TYPES.Keyword, "default");

    let declaration = null;
    let ending;

    if (this.match(TOKEN_TYPES.Keyword, "function")) {
      declaration = this.parseFunctionExpression(false);
      declaration.type = NODE_TYPES.FunctionDeclaration;
      ending = declaration;
    } else if (this.match(TOKEN_TYPES.Keyword, "class")) {
      declaration = this.parseClassDeclaration(NODE_TYPES.ClassExpression);
      declaration.type = NODE_TYPES.ClassDeclaration;
      ending = declaration;
    } else {
      declaration = this.parseMaybeAssign();
      ending = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";") || declaration.loc.end;
    }

    return this.createNode(NODE_TYPES.ExportDefaultDeclaration, keyword.loc.start, ending.loc.end, {
      declaration
    });
  }

  parseExportNamedDeclaration(exportKind = "value") {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "export");

    const specifiers = [];

    if (this.match(TOKEN_TYPES.Operator, "*")) {
      const asterisk = this.consumeToken(TOKEN_TYPES.Operator, "*");

      // ExportAllDeclaration
      if (this.match(TOKEN_TYPES.Identifier, "from")) {
        this.consumeToken(TOKEN_TYPES.Identifier, "from");
        const source = this.parseStringLiteral();
        const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";") || source;

        return this.createNode(NODE_TYPES.ExportAllDeclaration, keyword.loc.start, semicolon.loc.end, {
          exportKind,
          source,
          assertions: []
        });
      }

      if (this.tryConsumeToken(TOKEN_TYPES.Identifier, "as")) {
        const name = this.consumeToken(TOKEN_TYPES.Identifier);
        const exported = this.createNode(NODE_TYPES.Identifier, name.loc.start, name.loc.end, {
          name: name.value
        });
        const specifier = this.createNode(NODE_TYPES.ExportNamespaceSpecifier, asterisk.loc.start, name.loc.end, {
          exported
        });

        specifiers.push(specifier);

        if (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",") && !this.match(TOKEN_TYPES.Punctuator, "{")) {
          throw new SyntaxError(
            `Unexpected ',' token: expected '{' after ',' at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
          );
        }
      }
    } else if (this.match(TOKEN_TYPES.Identifier) && !Parser.EXPORT_DECLS.has(this.currentToken.value)) {
      specifiers.push(this.parseExportDefaultSpecifier());
      this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",");
    }

    if (this.match(TOKEN_TYPES.Punctuator, "{")) {
      specifiers.push(...this.parseExportSpecifiers());
    }

    this.consumeToken(TOKEN_TYPES.Identifier, "from");
    const source = this.parseStringLiteral();
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";") || source;

    return this.createNode(NODE_TYPES.ExportNamedDeclaration, keyword.loc.start, semicolon.loc.end, {
      source,
      declaration: null,
      assertions: [],
      specifiers,
      exportKind
    });
  }

  parseExportDeclarationWithDeclaration(exportKind = "value") {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "export");
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
          `Unexpected token: ${token.value} at line ${token.loc.start.line}, column ${token.loc.start.column}`
        );
    }

    return this.createNode(NODE_TYPES.ExportNamedDeclaration, keyword.loc.start, declaration.loc.end, {
      specifiers: [],
      source: null,
      assertions: [],
      declaration,
      exportKind
    });
  }

  parseExportDefaultSpecifier() {
    const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
    const exported = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
      name: identifier.value
    });

    return this.createNode(NODE_TYPES.ExportDefaultSpecifier, identifier.loc.start, identifier.loc.end, {
      exported
    });
  }

  parseExportSpecifiers() {
    this.consumeToken(TOKEN_TYPES.Punctuator, "{");

    const specifiers = [];

    do {
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      const local = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });
      let exported = local;

      if (this.tryConsumeToken(TOKEN_TYPES.Identifier, "as")) {
        const exportedIdentifier = this.consumeToken(TOKEN_TYPES.Identifier);
        exported = this.createNode(NODE_TYPES.Identifier, exportedIdentifier.loc.start, exportedIdentifier.loc.end, {
          name: exportedIdentifier.value
        });
      }

      specifiers.push(
        this.createNode(NODE_TYPES.ExportSpecifier, local.loc.start, exported.loc.end, {
          local,
          exported
        })
      );
    } while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ","));

    this.consumeToken(TOKEN_TYPES.Punctuator, "}");

    return specifiers;
  }

  parseDebuggerStatement() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "debugger");
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");

    if (
      !semicolon &&
      !(this.currentToken.type === TOKEN_TYPES.CommentBlock || this.currentToken.type === TOKEN_TYPES.CommentLine) &&
      this.currentToken.type !== TOKEN_TYPES.EOF &&
      this.currentToken.value !== "}" &&
      keyword.loc.start.line === this.currentToken.loc.start.line
    ) {
      throw new SyntaxError(
        `Unexpected token: after 'debugger' statement ${keyword.value} at line ${keyword.loc.start.line}, column ${keyword.loc.start.column}`
      );
    }

    const ending = semicolon || keyword;

    return this.createNode(NODE_TYPES.DebuggerStatement, keyword.loc.start, ending.loc.end);
  }

  parseEmptyStatement() {
    const semicolon = this.consumeToken(TOKEN_TYPES.Punctuator, ";");
    return this.createNode(NODE_TYPES.EmptyStatement, semicolon.loc.start, semicolon.loc.end);
  }

  parseAssignableListItem(isParam = false) {
    let node = this.parseMaybeDefault();

    if (isParam && this.match(TOKEN_TYPES.Operator, ":")) {
      node.typeAnnotation = this.parseTypeAnnotation();
      node.end = node.typeAnnotation.end;
      node.loc.end = node.typeAnnotation.loc.end;
    }

    return this.parseMaybeDefault(node);
  }

  parseMaybeDefault(node) {
    const left = node ?? this.parseBindingAtom();

    if (this.tryConsumeToken(TOKEN_TYPES.Operator, "=")) {
      const right = this.parseMaybeAssign();

      return this.createNode(NODE_TYPES.AssignmentPattern, left.loc.start, right.loc.end, {
        left,
        right
      });
    }

    return left;
  }

  parseBindingAtom() {
    if (this.match(TOKEN_TYPES.Identifier)) {
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      return this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });
    }

    if (this.match(TOKEN_TYPES.Punctuator, "{")) {
      return this.parseObjectPattern();
    }

    if (this.match(TOKEN_TYPES.Punctuator, "[")) {
      return this.parseArrayPattern();
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }

  parseObjectPattern() {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "{");
    const properties = [];
    let trailingComma;

    while (!this.match(TOKEN_TYPES.Punctuator, "}")) {
      properties.push(this.parseObjectPatternProperty());

      if (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",")) {
        if (this.match(TOKEN_TYPES.Punctuator, "}")) {
          trailingComma = properties[properties.length - 1].end;
          break;
        }
      } else {
        break;
      }
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "}");
    const node = this.createNode(NODE_TYPES.ObjectPattern, opening.loc.start, closing.loc.end, {
      properties
    });

    if (trailingComma) {
      node.extra = {
        trailingComma
      };
    }

    return node;
  }

  parseObjectPatternProperty() {
    if (this.match(TOKEN_TYPES.Punctuator, "...")) {
      return this.parseRestElement();
    }

    const key = this.parseObjectPropertyKey();
    let value = key;
    let shorthand = false;

    if (this.tryConsumeToken(TOKEN_TYPES.Operator, ":")) {
      value = this.parseAssignableListItem();
    } else {
      if (this.match(TOKEN_TYPES.Operator, "=")) {
        value = this.parseMaybeDefault(value);
        shorthand = true;
      } else {
        if (key.type !== NODE_TYPES.Identifier) {
          throw new SyntaxError(
            `Unexpected token in object pattern: ${key.value} at line ${key.loc.start.line}, column ${key.loc.start.column}`
          );
        }

        value.range = key.range;
        value.extra = key.extra;
        shorthand = true;
      }
    }

    const node = this.createNode(NODE_TYPES.ObjectProperty, key.loc.start, value.loc.end, {
      method: false,
      shorthand,
      computed: false,
      key,
      value
    });

    if (shorthand) {
      node.extra = {
        shorthand
      };
    }

    return node;
  }

  parseArrayPattern() {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "[");

    const elements = [];

    while (!this.match(TOKEN_TYPES.Punctuator, "]")) {
      if (this.match(TOKEN_TYPES.Punctuator, ",")) {
        this.consumeToken(TOKEN_TYPES.Punctuator, ",");
        elements.push(null);
      } else if (this.match(TOKEN_TYPES.Punctuator, "...")) {
        let rest = this.parseRestElement();

        if (this.match(TOKEN_TYPES.Operator, ":")) {
          const typeAnnotation = this.parseTypeAnnotation();
          rest.typeAnnotation = typeAnnotation;
          rest.end = typeAnnotation.end;
          rest.loc.end = typeAnnotation.loc.end;
        }

        elements.push(rest);

        if (this.match(TOKEN_TYPES.Punctuator, ",")) {
          throw new SyntaxError(
            `Unexpected token after rest element: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
          );
        }
      } else {
        elements.push(this.parseAssignableListItem(true));
        this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",");
      }
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "]");

    return this.createNode(NODE_TYPES.ArrayPattern, opening.loc.start, closing.loc.end, {
      elements
    });
  }

  parseExpressionStatement() {
    const expression = this.parseExpression();
    const semicolon = this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const ending = semicolon || expression;

    return this.createNode(NODE_TYPES.ExpressionStatement, expression.loc.start, ending.loc.end, {
      expression
    });
  }

  parseExpression() {
    return this.parseMaybeAssign();
  }

  parseMaybeAssign() {
    const position = this.position;
    if (this.tryConsumeToken(TOKEN_TYPES.Keyword, "async")) {
      if (this.shouldParseAsyncArrow()) {
        return this.parseAsyncArrow();
      }

      this.repositionToken(position);
    }

    let left = this.parseMaybeConditional();

    if (this.currentToken.type === TOKEN_TYPES.Operator && Parser.ASSIGNMENT_OPS.has(this.currentToken.value)) {
      if (left.type === NODE_TYPES.ObjectExpression || left.type === NODE_TYPES.ArrayExpression) {
        left = this.toAssignable(left);
      }

      const operator = this.currentToken.value;
      this.nextToken();
      const right = this.parseMaybeAssign();

      left = this.createNode(NODE_TYPES.AssignmentExpression, left.loc.start, right.loc.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  shouldParseAsyncArrow() {
    if (this.tryConsumeToken(TOKEN_TYPES.Punctuator, "(")) {
      let parenCount = 1;
      let index = this.position;
      const start = this.position;
      const threshold = start + 1000; // Arbitrary threshold to prevent infinite loops in case of syntax errors

      while (parenCount > 0 && index < threshold) {
        const token = this.tokens[index];

        if (token.type === TOKEN_TYPES.Punctuator && token.value === "(") {
          parenCount++;
        } else if (token.type === TOKEN_TYPES.Punctuator && token.value === ")") {
          parenCount--;
        } else if (token.type === TOKEN_TYPES.EOF) {
          return false;
        }

        index++;
      }

      const nextToken = this.tokens[index];

      if (nextToken.value !== "=>") {
        return false;
      }

      const parenToken = this.tokens[index - 1];

      if (parenToken.loc.start.line !== nextToken.loc.start.line) {
        return false;
      }

      // TODO Annotations between parentheses and arrows

      const paramsTokens = this.tokens.slice(start, index - 1);

      // Check for invalid tokens in parameters
      if (paramsTokens.length === 0) {
        return false;
      }

      let i = 0;

      while (i < paramsTokens.length) {
        const token = paramsTokens[i];

        if (token.type === TOKEN_TYPES.Identifier) {
          i++;

          if (paramsTokens[i].type === TOKEN_TYPES.Operator && paramsTokens[i].value === ":") {
            i++;

            if (i < paramsTokens.length && paramsTokens[i].type === TOKEN_TYPES.Identifier) {
              i++;
            }
          }

          if (paramsTokens[i].type === TOKEN_TYPES.Operator && paramsTokens[i].value === "=") {
            i++;

            if (i < paramsTokens.length && paramsTokens[i].type === TOKEN_TYPES.Identifier) {
              i++;
            }
          }
          continue;
        }

        if (token.type === TOKEN_TYPES.Punctuator && token.value === ",") {
          i++;
          continue;
        }

        if (token.type === TOKEN_TYPES.Punctuator && token.value === "...") {
          i++;

          if (i < paramsTokens.length && paramsTokens[i].type === TOKEN_TYPES.Identifier) {
            i++;
            continue;
          }
        }

        return false;
      }

      return true;
    }

    if (this.currentToken.type === TOKEN_TYPES.Identifier) {
      const token = this.currentToken;
      const nextToken = this.peekToken();

      if (nextToken.value === "yield") {
        return false;
      }

      if (nextToken.value === "await") {
        return false;
      }

      if (nextToken.value !== "=>") {
        return false;
      }

      if (token.loc.start.line !== nextToken.loc.start.line) {
        return false;
      }

      if (nextToken.value === "arguments" && this.state.isStrictMode) {
        return false;
      }

      if (nextToken.value === "eval" && this.state.isStrictMode) {
        return false;
      }

      return true;
    }

    if (
      this.currentToken.value === "lef" ||
      this.currentToken.value === "static" ||
      this.currentToken.value === "as" ||
      this.currentToken.value === "from" ||
      this.currentToken.value === "get" ||
      this.currentToken.value === "set" ||
      this.currentToken.value === "of" ||
      this.currentToken.value === "implements" ||
      this.currentToken.value === "interface" ||
      this.currentToken.value === "package" ||
      this.currentToken.value === "private" ||
      this.currentToken.value === "protected" ||
      this.currentToken.value === "public"
    ) {
      const token = this.currentToken;
      const nextToken = this.peekToken();

      if (nextToken.value !== "=>") {
        return false;
      }

      if (token.loc.start.line !== nextToken.loc.start.line) {
        return false;
      }

      if (nextToken.value === "arguments" && this.state.isStrictMode) {
        return false;
      }

      if (nextToken.value === "eval" && this.state.isStrictMode) {
        return false;
      }

      return true;
    }

    if (this.currentToken.value === "_" || this.currentToken.value === "$" || this.currentToken.value === "π") {
      return this.peekToken().value === "=>";
    }

    return false;
  }

  parseAsyncArrow() {}

  toAssignable(node) {
    switch (node.type) {
      case NODE_TYPES.ObjectExpression:
        node.type = NODE_TYPES.ObjectPattern;
        node.properties.map((prop) => {
          if (prop.type === NODE_TYPES.ObjectProperty) {
            prop.value = this.toAssignable(prop.value);
          } else if (prop.type === NODE_TYPES.SpreadElement) {
            prop.type = NODE_TYPES.RestElement;
            prop.argument = this.toAssignable(prop.argument);
          }

          return prop;
        });

        return node;

      case NODE_TYPES.ArrayExpression:
        node.type = NODE_TYPES.ArrayPattern;
        node.elements.map((element, index) => {
          if (!element) {
            return;
          }

          if (element.type === NODE_TYPES.AssignmentExpression) {
            // Convert assignment expression inside array pattern to AssignmentPattern
            // keep the right hand side, make left assignable
            element.type = NODE_TYPES.AssignmentPattern;
            element.left = this.toAssignable(element.left);
            node.elements[index] = element;
          } else if (element.type === NODE_TYPES.SpreadElement) {
            // Convert spread in array to rest element and recurse on argument
            element.type = NODE_TYPES.RestElement;
            element.argument = this.toAssignable(element.argument);
            node.elements[index] = element;
          } else {
            node.elements[index] = this.toAssignable(element);
          }

          return element;
        });

        return node;

      case NODE_TYPES.Identifier:
      case NODE_TYPES.MemberExpression:
      case NODE_TYPES.RestElement:
      case NODE_TYPES.AssignmentPattern:
        return node;

      default:
        throw new SyntaxError(
          `Invalid left-hand side in assignment at line ${node.loc.start.line}, column ${node.loc.start.column}`
        );
    }
  }

  parseMaybeConditional() {
    const test = this.parseExprOps();

    if (this.tryConsumeToken(TOKEN_TYPES.Operator, "?")) {
      const consequent = this.parseMaybeAssign();

      this.consumeToken(TOKEN_TYPES.Operator, ":");

      const alternate = this.parseMaybeAssign();

      return this.createNode(NODE_TYPES.ConditionalExpression, test.loc.start, alternate.loc.end, {
        test,
        consequent,
        alternate
      });
    }

    return test;
  }

  parseExprOps() {
    let left = this.parseMaybeBinary();

    while (
      this.match(TOKEN_TYPES.Operator, "||") ||
      this.match(TOKEN_TYPES.Operator, "&&") ||
      this.match(TOKEN_TYPES.Operator, "??")
    ) {
      const operator = this.currentToken.value;

      this.nextToken();

      const right = this.parseMaybeBinary();

      left = this.createNode(NODE_TYPES.LogicalExpression, left.loc.start, right.loc.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  parseMaybeBinary() {
    let left = this.parseMaybeUnary();

    while (
      (this.currentToken.type === TOKEN_TYPES.Operator && Parser.BINARY_OPS.has(this.currentToken.value)) ||
      (this.currentToken.type === TOKEN_TYPES.Keyword &&
        (this.currentToken.value === "instanceof" || this.currentToken.value === "in"))
    ) {
      const operator = this.currentToken.value;

      if (operator === "in") {
        if (this.state.inForInit) {
          if (this.validateForInLeft(left)) {
            if (left.type === NODE_TYPES.VariableDeclaration) {
              this.validateForInOfLeft(left, operator);
            }

            return left;
          }
        }

        if (!left) {
          throw new SyntaxError(
            `Invalid left-hand side in assignment at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
          );
        }

        if (left.type === NODE_TYPES.PrivateName) {
          throw new SyntaxError(
            `Private identifier is not allowed as an assignment target at line ${left.loc.start.line}, column ${left.loc.start.column}`
          );
        }

        if (left.type === NODE_TYPES.ObjectPattern || left.type === NODE_TYPES.ArrayPattern) {
          throw new SyntaxError(
            `Invalid assignment target: cannot assign to a destructuring pattern here at line ${left.loc.start.line}, column ${left.loc.start.column}`
          );
        }
      }

      this.nextToken();

      const right = this.parseMaybeUnary();

      left = this.createNode(NODE_TYPES.BinaryExpression, left.loc.start, right.loc.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  validateForInLeft(node) {
    if (!node) {
      return false;
    }

    switch (node.type) {
      case NODE_TYPES.VariableDeclaration:
        return node.declarations.length === 1 && !node.declarations[0].init;

      case NODE_TYPES.Identifier:
        return true;

      case NODE_TYPES.MemberExpression:
        return true;

      case NODE_TYPES.ObjectPattern:
      case NODE_TYPES.ArrayPattern:
        return true;

      default:
        return false;
    }
  }

  validateForInOfLeft(init, keyword) {
    if (!init) {
      throw new SyntaxError(
        `Missing left-hand side in for-${keyword} statement at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
      );
    }

    if (init.type === NODE_TYPES.VariableDeclaration) {
      if (init.declarations.length !== 1) {
        throw new SyntaxError(
          `Invalid variable declaration in for-${keyword} statement at line ${init.loc.start.line}, column ${init.loc.start.column}`
        );
      }

      if (init.declarations[0].init) {
        throw new SyntaxError(
          `Variable declaration in for-${keyword} statement cannot have an initializer at line ${init.loc.start.line}, column ${init.loc.start.column}`
        );
      }
    }
  }

  parseMaybeUnary() {
    if (this.match(TOKEN_TYPES.Operator, "++") || this.match(TOKEN_TYPES.Operator, "--")) {
      const token = this.currentToken;

      this.nextToken();

      const argument = this.parseMaybeUnary();

      return this.createNode(NODE_TYPES.UpdateExpression, token.loc.start, argument.loc.end, {
        operator: token.value,
        argument,
        prefix: true
      });
    }

    if (
      this.match(TOKEN_TYPES.Operator, "+") ||
      this.match(TOKEN_TYPES.Operator, "-") ||
      this.match(TOKEN_TYPES.Operator, "!") ||
      this.match(TOKEN_TYPES.Operator, "~") ||
      this.match(TOKEN_TYPES.Keyword, "typeof") ||
      this.match(TOKEN_TYPES.Keyword, "void") ||
      this.match(TOKEN_TYPES.Keyword, "delete")
    ) {
      const token = this.currentToken;

      this.nextToken();

      const argument = this.parseMaybeUnary();

      return this.createNode(NODE_TYPES.UnaryExpression, token.loc.start, argument.loc.end, {
        operator: token.value,
        argument,
        prefix: true
      });
    }

    const argument = this.parseExprSubscripts();

    if (this.match(TOKEN_TYPES.Operator, "++") || this.match(TOKEN_TYPES.Operator, "--")) {
      const token = this.currentToken;

      this.nextToken();

      if (argument.type === NODE_TYPES.PrivateName) {
        throw new SyntaxError(
          `Private identifier is not allowed as an assignment target at line ${argument.loc.start.line}, column ${argument.loc.start.column}`
        );
      }

      if (argument.type === NODE_TYPES.ObjectPattern || argument.type === NODE_TYPES.ArrayPattern) {
        throw new SyntaxError(
          `Invalid assignment target: cannot assign to a destructuring pattern here at line ${argument.loc.start.line}, column ${argument.loc.start.column}`
        );
      }

      return this.createNode(NODE_TYPES.UpdateExpression, argument.loc.start, token.loc.end, {
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
      if (this.match(TOKEN_TYPES.Punctuator, ".") || this.match(TOKEN_TYPES.Punctuator, "[")) {
        object = this.parseMemberExpr(object);
        continue;
      }

      if (this.match(TOKEN_TYPES.Punctuator, "(")) {
        object = this.parseCallExpr(object);
        continue;
      }

      if (this.match(TOKEN_TYPES.Punctuator, "?.")) {
        object = this.parseOptionalExpr(object);
        continue;
      }

      break;
    }

    return object;
  }

  parseMemberExpr(object) {
    if (this.match(TOKEN_TYPES.Punctuator, ".")) {
      const dot = this.consumeToken(TOKEN_TYPES.Punctuator, ".");
      let property = null;

      if (this.match(TOKEN_TYPES.Identifier)) {
        const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
        property = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
          name: identifier.value
        });
      } else {
        property = this.parseClassPrivateName();
      }

      return this.createNode(NODE_TYPES.MemberExpression, object.loc.start, property.loc.end, {
        object,
        property,
        computed: false
      });
    }

    if (this.match(TOKEN_TYPES.Punctuator, "[")) {
      const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "[");
      const property = this.parseExpression();
      const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "]");

      return this.createNode(NODE_TYPES.MemberExpression, object.loc.start, closing.loc.end, {
        object,
        property,
        computed: true
      });
    }

    throw new SyntaxError(
      `Unexpected token after member expression at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }

  parseCallExpr(callee) {
    this.consumeToken(TOKEN_TYPES.Punctuator, "(");

    const args = [];

    if (!this.match(TOKEN_TYPES.Punctuator, ")")) {
      do {
        if (this.match(TOKEN_TYPES.Punctuator, "...")) {
          args.push(this.parseSpreadElement());

          if (this.match(TOKEN_TYPES.Punctuator, ",")) {
            throw new SyntaxError(
              `Rest element must be last element in argument list at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
            );
          }
        } else {
          args.push(this.parseMaybeAssign());
        }
      } while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ","));
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, ")");

    return this.createNode(NODE_TYPES.CallExpression, callee.loc.start, closing.loc.end, {
      callee,
      arguments: args
    });
  }

  parseOptionalExpr(object) {
    this.consumeToken(TOKEN_TYPES.Punctuator, "?.");

    if (this.match(TOKEN_TYPES.Identifier)) {
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      const property = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });

      return this.createNode(NODE_TYPES.OptionalMemberExpression, object.loc.start, property.loc.end, {
        object,
        property,
        computed: false,
        optional: true
      });
    }

    if (this.match(TOKEN_TYPES.Punctuator, "[")) {
      const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "[");
      const property = this.parseExpression();
      const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "]");

      return this.createNode(NODE_TYPES.OptionalMemberExpression, object.loc.start, closing.loc.end, {
        object,
        property,
        computed: true,
        optional: true
      });
    }

    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      const expr = this.parseCallExpr(object);
      expr.type = NODE_TYPES.OptionalCallExpression;
      expr.optional = true;
      return expr;
    }

    throw new SyntaxError(
      `Unexpected token after optional chaining operator at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }

  parsePrimaryExpr() {
    const type = this.currentToken.type;

    if (type === TOKEN_TYPES.Keyword) {
      switch (this.currentToken.value) {
        case "function":
          return this.parseFunctionExpression();

        case "this":
          const thisToken = this.consumeToken(TOKEN_TYPES.Keyword, "this");
          return this.createNode(NODE_TYPES.ThisExpression, thisToken.loc.start, thisToken.loc.end);

        case "super":
          const superToken = this.consumeToken(TOKEN_TYPES.Keyword, "super");
          return this.createNode(NODE_TYPES.Super, superToken.loc.start, superToken.loc.end);

        case "new":
          return this.parseNewExpression();

        case "delete":
          return this.parseUnaryExpression();

        case "class":
          return this.parseClassDeclaration(NODE_TYPES.ClassExpression);

        case "import":
          return this.parseImportExpression();

        default:
          return this.parseIdentifier();
      }
    }

    if (type === TOKEN_TYPES.NumericLiteral) {
      return this.parseNumericLiteral();
    }

    if (type === TOKEN_TYPES.StringLiteral) {
      return this.parseStringLiteral();
    }

    if (type === TOKEN_TYPES.BooleanLiteral) {
      const token = this.currentToken;
      this.nextToken();
      return this.createNode(NODE_TYPES.BooleanLiteral, token.loc.start, token.loc.end, {
        value: token.value
      });
    }

    if (type === TOKEN_TYPES.NullLiteral) {
      const token = this.currentToken;
      this.nextToken();
      return this.createNode(NODE_TYPES.NullLiteral, token.loc.start, token.loc.end);
    }

    if (type === TOKEN_TYPES.Identifier) {
      return this.parseIdentifier();
    }

    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      return this.parseParenthesizedExpression();
    }

    if (this.match(TOKEN_TYPES.Punctuator, "[")) {
      return this.parseArrayExpression();
    }

    if (this.match(TOKEN_TYPES.Punctuator, "{")) {
      return this.parseObjectExpression();
    }

    if (type === TOKEN_TYPES.TemplateLiteralBegin) {
      return this.parseTemplateLiteral();
    }

    if (type === TOKEN_TYPES.RegExpLiteral) {
      return this.parseRegExpLiteral();
    }

    if (type === TOKEN_TYPES.EOF) {
      throw new SyntaxError(
        `Unexpected end of input at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
      );
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }

  parseFunctionExpression(skipSemicolon = true) {
    const starting = this.tryConsumeToken(TOKEN_TYPES.Keyword, "async");
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "function");
    const isGenerator = !!this.tryConsumeToken(TOKEN_TYPES.Operator, "*");
    let id = null;

    if (this.match(TOKEN_TYPES.Identifier)) {
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);
      id = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
        name: identifier.value
      });
    }

    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();
    const semicolon = skipSemicolon && this.tryConsumeToken(TOKEN_TYPES.Punctuator, ";");
    const startLoc = starting ? starting.loc.start : keyword.loc.start;
    const endLoc = semicolon ? semicolon.loc.end : body.loc.end;

    return this.createNode(NODE_TYPES.FunctionExpression, startLoc, endLoc, {
      id,
      params,
      body,
      generator: isGenerator,
      async: !!starting
    });
  }

  parseNewExpression() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "new");
    const callee = this.parseExprSubscripts();
    const args = [];
    let closing = callee;

    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      this.consumeToken(TOKEN_TYPES.Punctuator, "(");

      if (!this.match(TOKEN_TYPES.Punctuator, ")")) {
        do {
          if (this.match(TOKEN_TYPES.Punctuator, "...")) {
            args.push(this.parseSpreadElement());
            continue;
          }

          args.push(this.parseMaybeAssign());
        } while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ","));
      }

      closing = this.consumeToken(TOKEN_TYPES.Punctuator, ")");
    }

    return this.createNode(NODE_TYPES.NewExpression, keyword.loc.start, closing.loc.end, {
      callee,
      typeArguments: null,
      arguments: args
    });
  }

  parseSpreadElement() {
    const ellipsis = this.consumeToken(TOKEN_TYPES.Punctuator, "...");
    const argument = this.parseMaybeAssign();

    return this.createNode(NODE_TYPES.SpreadElement, ellipsis.loc.start, argument.loc.end, {
      argument
    });
  }

  parseImportExpression() {
    const keyword = this.consumeToken(TOKEN_TYPES.Keyword, "import");

    // Dynamic import
    if (this.match(TOKEN_TYPES.Punctuator, "(")) {
      return this.createNode(NODE_TYPES.Import, keyword.loc.start, keyword.loc.end);
    }

    // Meta attribute
    if (this.match(TOKEN_TYPES.Punctuator, ".")) {
      this.consumeToken(TOKEN_TYPES.Punctuator, ".");
      const identifier = this.consumeToken(TOKEN_TYPES.Identifier);

      if (identifier.value === "meta") {
        const meta = this.createNode(NODE_TYPES.Identifier, keyword.loc.start, keyword.loc.end, {
          name: "import"
        });
        const property = this.createNode(NODE_TYPES.Identifier, identifier.loc.start, identifier.loc.end, {
          name: "meta"
        });

        return this.createNode(NODE_TYPES.MetaProperty, keyword.loc.start, identifier.loc.end, {
          meta,
          property
        });
      }
    }

    throw new SyntaxError(
      `Unexpected token after import: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }

  parseNumericLiteral() {
    const token = this.consumeToken(TOKEN_TYPES.NumericLiteral);

    return this.createNode(NODE_TYPES.NumericLiteral, token.loc.start, token.loc.end, {
      value: token.value,
      extra: token.extra
    });
  }

  parseStringLiteral() {
    const token = this.consumeToken(TOKEN_TYPES.StringLiteral);

    return this.createNode(NODE_TYPES.StringLiteral, token.loc.start, token.loc.end, {
      value: token.value,
      extra: token.extra
    });
  }

  parseIdentifier() {
    const token = this.currentToken;

    this.nextToken();

    return this.createNode(NODE_TYPES.Identifier, token.loc.start, token.loc.end, {
      name: token.value
    });
  }

  parseTemplateLiteral() {}

  parseRegExpLiteral() {}

  parseParenthesizedExpression() {
    this.consumeToken(TOKEN_TYPES.Punctuator, "(");

    if (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ")")) {
      if (this.match(TOKEN_TYPES.Operator, "=>")) {
        return this.parseArrowFunctionExpression([]);
      }

      throw new SyntaxError(
        `Unexpected token: ) at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
      );
    }

    const expr = this.parseExpression();
    if (this.match(TOKEN_TYPES.Punctuator, ",")) {
      const expressions = [expr];

      while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",")) {
        expressions.push(this.parseExpression());
      }

      this.consumeToken(TOKEN_TYPES.Punctuator, ")");

      if (this.match(TOKEN_TYPES.Operator, "=>")) {
        return this.parseArrowFunctionExpression(expressions);
      }

      return this.createNode(
        NODE_TYPES.SequenceExpression,
        expr.loc.start,
        expressions[expressions.length - 1].loc.end,
        {
          expressions
        }
      );
    }

    this.consumeToken(TOKEN_TYPES.Punctuator, ")");
    if (this.match(TOKEN_TYPES.Operator, "=>")) {
      return this.parseArrowFunctionExpression([expr]);
    }

    return expr;
  }

  parseArrowFunctionExpression(params) {
    let body;
    let expression;
    if (this.match(TOKEN_TYPES.Punctuator, "{")) {
      body = this.parseBlockStatement();
      expression = false;
    } else {
      body = this.parseExpression();
      expression = true;
    }

    const startLoc = params.length > 0 ? params[0].loc.start : this.currentToken.loc.start;

    return this.createNode(NODE_TYPES.ArrowFunctionExpression, startLoc, body.loc.end, {
      params,
      body,
      expression
    });
  }

  parseArrayExpression() {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "[");
    const elements = [];

    if (!this.match(TOKEN_TYPES.Punctuator, "]")) {
      do {
        if (this.match(TOKEN_TYPES.Punctuator, ",")) {
          elements.push(null);
          continue;
        }

        if (this.match(TOKEN_TYPES.Punctuator, "...")) {
          elements.push(this.parseSpreadElement());
          continue;
        }

        elements.push(this.parseMaybeAssign());
      } while (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ","));
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "]");

    return this.createNode(NODE_TYPES.ArrayExpression, opening.loc.start, closing.loc.end, {
      elements
    });
  }

  parseObjectExpression() {
    const opening = this.consumeToken(TOKEN_TYPES.Punctuator, "{");
    const properties = [];
    let trailingComma;

    if (!this.match(TOKEN_TYPES.Punctuator, "}")) {
      do {
        const property = this.parseObjectProperty();
        if (property) {
          properties.push(property);
        }

        if (this.tryConsumeToken(TOKEN_TYPES.Punctuator, ",")) {
          if (this.match(TOKEN_TYPES.Punctuator, "}")) {
            trailingComma = properties[properties.length - 1].end;
            break;
          }
        } else {
          break;
        }
      } while (true);
    }

    const closing = this.consumeToken(TOKEN_TYPES.Punctuator, "}");
    const node = this.createNode(NODE_TYPES.ObjectExpression, opening.loc.start, closing.loc.end, {
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
    const startLoc = this.currentToken.loc.start;

    if (this.match(TOKEN_TYPES.Punctuator, "...")) {
      return this.parseSpreadElement();
    }

    let isAsync = false;
    let isGenerator = false;
    let kind = "method";

    if (
      this.currentToken.value === "async" &&
      (this.peekToken().type === TOKEN_TYPES.Identifier || this.peekToken().value === "*")
    ) {
      isAsync = true;
      this.nextToken();
    }

    if (this.currentToken.value === "*") {
      isGenerator = true;
      this.nextToken();
    }

    if (this.currentToken.value === "get" || this.currentToken.value === "set") {
      const peek = this.peekToken();

      if (peek.value !== "(") {
        if (isGenerator) {
          throw new SyntaxError(
            `Generator methods cannot be getters or setters at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
          );
        }

        kind = this.currentToken.value;
        this.nextToken();
      }
    }

    if (this.tryConsumeToken(TOKEN_TYPES.Punctuator, "[")) {
      const key = this.parseMaybeAssign();
      this.consumeToken(TOKEN_TYPES.Punctuator, "]");

      if (this.currentToken.value === "(") {
        return this.parseObjectMethod(key, kind, startLoc, isAsync, isGenerator, true);
      }

      this.consumeToken(TOKEN_TYPES.Operator, ":");

      const value = this.parseMaybeAssign();

      return this.createNode(NODE_TYPES.ObjectProperty, startLoc, value.loc.end, {
        key,
        value,
        method: false,
        computed: true,
        shorthand: false
      });
    }

    const key = this.parseObjectPropertyKey();

    if (this.currentToken.value === "(") {
      return this.parseObjectMethod(key, kind, startLoc, isAsync, isGenerator);
    }

    let value;

    if (this.tryConsumeToken(TOKEN_TYPES.Operator, ":")) {
      value = this.parseMaybeAssign();
    } else {
      value = {
        ...key,
        range: key.range,
        extra: key.extra
      };
    }

    return this.createNode(NODE_TYPES.ObjectProperty, startLoc, value.loc.end, {
      key,
      value,
      method: false,
      computed: false,
      shorthand: key.type === NODE_TYPES.Identifier && value.type === NODE_TYPES.Identifier && key.name === value.name
    });
  }

  parseObjectMethod(key, kind, startLoc, isAsync = false, isGenerator = false, isComputed = false) {
    const params = this.parseParamsStatement();
    const body = this.parseBlockStatement();

    return this.createNode(NODE_TYPES.ObjectMethod, startLoc, body.loc.end, {
      key,
      params,
      body,
      id: null,
      kind,
      method: true,
      async: isAsync,
      generator: isGenerator,
      computed: isComputed
    });
  }

  parseObjectPropertyKey() {
    if (
      this.currentToken.type === TOKEN_TYPES.Identifier ||
      this.currentToken.type === TOKEN_TYPES.Keyword ||
      this.currentToken.type === TOKEN_TYPES.NullLiteral ||
      this.currentToken.type === TOKEN_TYPES.BooleanLiteral
    ) {
      return this.parseIdentifier();
    }

    if (this.currentToken.type === TOKEN_TYPES.NumericLiteral) {
      return this.parseNumericLiteral();
    }

    if (this.currentToken.type === TOKEN_TYPES.StringLiteral) {
      return this.parseStringLiteral();
    }

    throw new SyntaxError(
      `Unexpected token: ${this.currentToken.value} at line ${this.currentToken.loc.start.line}, column ${this.currentToken.loc.start.column}`
    );
  }
}
