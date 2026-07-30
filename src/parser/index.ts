import Tokenizer from "@/tokenizer/index.ts";
import { TOKEN_TYPES, NODE_TYPES } from "@/utils/types.ts";
import type { TokenizerOptions, Token, Loc } from "@/types/index.ts";
import type { Program, Node, Location, Statement, Expression } from "@/parser/types.ts";

interface ParserOptions extends TokenizerOptions {
  errorRecovery?: boolean;
}

export default function Parser(options: ParserOptions = {}) {
  const config = {
    sourceType: options.sourceType || "script",
    strictMode: options.strictMode ?? false,
    errorRecovery: options.errorRecovery ?? false,
    plugins: new Set(options.plugins || [])
  };

  const tokenizer = Tokenizer({
    sourceType: config.sourceType,
    strictMode: config.strictMode,
    plugins: Array.from(config.plugins)
  } as TokenizerOptions);

  let ast: any = null;
  let tokens: Token[] = [];
  let state = {
    pos: 0,
    line: 1,
    column: 0,
    inForInit: false
  };

  function createNode(type: NODE_TYPES, start: Location, end: Location, properties = {}): Node {
    return {
      type,
      start,
      end,
      ...properties
    };
  }

  function next() {
    state.pos++;
    return tokens[state.pos];
  }

  function unexpected() {
    const t = tokens[state.pos];
    throw new SyntaxError(`Unexpected token: ${t.value} at line ${t.start.line}, column ${t.start.column}`);
  }

  function match(type: string, value?: any) {
    const token = tokens[state.pos];
    return token && token.type === type && (value === void 0 || token.value === value);
  }

  function consume(type: string, value?: any): Token | any {
    const token = tokens[state.pos];
    if (token.type === type && (value === void 0 || token.value === value)) {
      state.pos++;
      return token;
    }

    unexpected();
  }

  function tryConsume(type: string, value?: any) {
    const token = tokens[state.pos];
    if (token && token.type === type && (value === void 0 || token.value === value)) {
      state.pos++;
      return token;
    }

    return null;
  }

  function parse(source: string) {
    tokens = tokenizer.tokenize(source);
    state = {
      pos: 0,
      line: 1,
      column: 0,
      inForInit: false
    };

    ast = parseProgram();
    return ast;
  }

  function parseProgram(): Program {
    const body: Statement[] = [];

    while (state.pos < tokens.length) {
      const statement = parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    let start = null;
    let end = null;
    if (tokens.length > 0) {
      start = tokens[0].start;
      end = tokens[tokens.length - 1].end || start;
    }



    return createNode(NODE_TYPES.Program, start, end, {
      body,
      sourceType: config.sourceType
    }) as Program;
  }

  function parseStatement() {
    const token = tokens[state.pos];

    if (token.type === TOKEN_TYPES.Keyword) {
      switch (token.value) {
        case "var":
        case "let":
        case "const":
          return parseVariableDeclaration();

        case "function":
          return parseFunctionDeclaration();

        case "async":
          return parseAsyncDeclaration();

        case "if":
          return parseIfStatement();

        case "switch":
          return parseSwitchStatement();

        case "for":
          return parseForStatement();

        case "while":
          return parseWhileStatement();

        case "do":
          return parseDoWhileStatement();

        case "return":
          return parseReturnStatement();

        case "break":
          return parseBreakStatement();

        case "continue":
          return parseContinueStatement();

        case "yield":
          return parseYieldExpression();

        case "throw":
          return parseThrowStatement();

        case "try":
          return parseTryStatement();

        case "class":
          return parseClassDeclaration();

        case "import":
          return parseImportDeclaration();

        case "export":
          return parseExportDeclaration();

        case "debugger":
          return parseDebuggerStatement();

        default:
          return parseExpressionStatement();
      }
    }

    if (token.type === TOKEN_TYPES.Punctuator) {
      if (token.value === "{") {
        return parseBlockStatement();
      }

      if (token.value === "(") {
        return parseExpressionStatement();
      }

      if (token.value === ";") {
        return parseEmptyStatement();
      }
    }

    return parseExpressionStatement();
  }

  function parseVariableDeclaration(eatSemi = true) {
    const keyword = consume(TOKEN_TYPES.Keyword);
    const declarations = [];
    const usedNames = new Set();

    do {
      const declarator = parseVariableDeclarator(keyword.value);

      // Check for duplicate variable names in the same declaration
      if (declarator.id.type === NODE_TYPES.Identifier) {
        if (usedNames.has(declarator.id.name)) {
          throw new SyntaxError(
            `Duplicate variable name '${declarator.id.name}' in the same declaration at line ${declarator.id.start.line}, column ${declarator.id.start.column}`
          );
        }

        usedNames.add(declarator.id.name);
      }

      declarations.push(declarator);
    } while (tryConsume(TOKEN_TYPES.Punctuator, ","));

    let ending: Node | Token = declarations[declarations.length - 1] || tokens[state.pos];

    if (eatSemi) {
      ending = tryConsume(TOKEN_TYPES.Punctuator, ";") ?? ending;
    }

    return createNode(NODE_TYPES.VariableDeclaration, keyword.start, ending.end, {
      kind: keyword.value,
      declarations
    });
  }

  function parseVariableDeclarator(kind: string) {
    const id = parseBindingAtom();
    let init = null;
    let end = id.end;

    if (tryConsume(TOKEN_TYPES.Operator, "=")) {
      init = parseExpression();
      end = init.end;
    }

    if (kind === "const" && !init) {
      throw new SyntaxError(
        `Missing initializer in const declaration at line ${id.start.line}, column ${id.start.column}`
      );
    }

    return createNode(NODE_TYPES.VariableDeclarator, id.start, end, {
      id,
      init
    });
  }

  function parseFunctionDeclaration(start = tokens[state.pos].start, isAsync = false) {
    consume(TOKEN_TYPES.Keyword, "function");

    const isGenerator = !!tryConsume(TOKEN_TYPES.Operator, "*");
    const id = parseIdentifier();
    const params = parseParamsStatement();
    const body = parseBlockStatement();

    return createNode(NODE_TYPES.FunctionDeclaration, start, body.end, {
      id,
      params,
      body,
      generator: isGenerator,
      async: isAsync
    });
  }

  function parseAsyncDeclaration() {
    const index = state.pos;
    const keyword = consume(TOKEN_TYPES.Keyword, "async");

    if (match(TOKEN_TYPES.Keyword, "function")) {
      if (keyword.start.line === tokens[state.pos].start.line) {
        return parseFunctionDeclaration(keyword.start, true);
      }
    }

    state.pos = index;
    return parseExpressionStatement();
  }

  function parseIfStatement(): Statement {
    const keyword = consume(TOKEN_TYPES.Keyword, "if");
    const test = parseParenthesizedExpression();
    const consequent = parseBlockStatement();
    let alternate = null;

    if (tryConsume(TOKEN_TYPES.Keyword, "else")) {
      if (match(TOKEN_TYPES.Keyword, "if")) {
        alternate = parseIfStatement();
      } else {
        alternate = parseBlockStatement();
      }
    }

    const end = alternate ? alternate.end : consequent.end;

    return createNode(NODE_TYPES.IfStatement, keyword.start, end, {
      test,
      consequent,
      alternate
    });
  }

  function parseSwitchStatement(): Statement {
    const keyword = consume(TOKEN_TYPES.Keyword, "switch");
    const discriminant = parseParenthesizedExpression();
    consume(TOKEN_TYPES.Punctuator, "{");

    const cases = [];
    while (!match(TOKEN_TYPES.Punctuator, "}")) {
      cases.push(parseSwitchCase());
    }

    const closing = consume(TOKEN_TYPES.Punctuator, "}");

    return createNode(NODE_TYPES.SwitchStatement, keyword.start, closing.end, {
      discriminant,
      cases
    });
  }

  function parseSwitchCase() {
    let keyword = tryConsume(TOKEN_TYPES.Keyword, "case");
    const test = keyword ? parseExpression() : null;

    if (!test) {
      keyword = tryConsume(TOKEN_TYPES.Keyword, "default");
    }

    const colon = consume(TOKEN_TYPES.Operator, ":");
    const consequent = [];

    while (!match(TOKEN_TYPES.Keyword, "case") && !match(TOKEN_TYPES.Keyword, "default")) {
      if (match(TOKEN_TYPES.Keyword, "break")) {
        consequent.push(parseBreakStatement());
        break;
      }

      if (match(TOKEN_TYPES.Keyword, "return")) {
        consequent.push(parseReturnStatement());
        break;
      }

      const statement = parseStatement();
      if (statement) {
        consequent.push(statement);
      }
    }

    const ending = consequent.length > 0 ? consequent[consequent.length - 1] : colon;

    // @ts-ignore
    return createNode(NODE_TYPES.SwitchCase, keyword.start, ending.end, {
      test,
      consequent
    });
  }

  function parseForStatement() {
    state.inForInit = true;
    const keyword = consume(TOKEN_TYPES.Keyword, "for");
    let isAwait = false;

    if (tryConsume(TOKEN_TYPES.Keyword, "await")) {
      isAwait = true;
    }

    consume(TOKEN_TYPES.Punctuator, "(");

    let init = null;
    if (!match(TOKEN_TYPES.Punctuator, ";")) {
      if (
        match(TOKEN_TYPES.Keyword, "var") ||
        match(TOKEN_TYPES.Keyword, "let") ||
        match(TOKEN_TYPES.Keyword, "const")
      ) {
        init = parseVariableDeclaration(false);
      } else {
        init = parseExpression();
      }
    }

    state.inForInit = false;

    // for...in
    if (match(TOKEN_TYPES.Keyword, "in")) {
      if (isAwait) {
        return unexpected();
      }

      validateForInOfLeft(init, "in");
      consume(TOKEN_TYPES.Keyword, "in");

      const right = parseMaybeAssign();

      consume(TOKEN_TYPES.Punctuator, ")");

      const body = parseBlockStatement();

      return createNode(NODE_TYPES.ForInStatement, keyword.start, body.end, {
        left: init,
        right,
        body
      });
    }

    // for...of/for await...of
    if (match(TOKEN_TYPES.Keyword, "of")) {
      validateForInOfLeft(init, "of");
      consume(TOKEN_TYPES.Keyword, "of");

      const right = parseMaybeAssign();

      consume(TOKEN_TYPES.Punctuator, ")");

      const body = parseBlockStatement();

      return createNode(NODE_TYPES.ForOfStatement, keyword.start, body.end, {
        await: isAwait,
        left: init,
        right,
        body
      });
    }

    // traditional for loop
    consume(TOKEN_TYPES.Punctuator, ";");

    let test = null;
    if (!match(TOKEN_TYPES.Punctuator, ";")) {
      test = parseExpression();
    }

    consume(TOKEN_TYPES.Punctuator, ";");

    let update = null;
    if (!match(TOKEN_TYPES.Punctuator, ")")) {
      update = parseExpression();
    }

    consume(TOKEN_TYPES.Punctuator, ")");

    const body = parseBlockStatement();

    return createNode(NODE_TYPES.ForStatement, keyword.start, body.end, {
      init,
      test,
      update,
      body
    });
  }

  function validateForInLeft(node: Node) {
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

  function validateForInOfLeft(init: Statement | any, keyword: string) {
    if (!init) {
      const token = tokens[state.pos];
      throw new SyntaxError(
        `Missing left-hand side in for-${keyword} statement at line ${token.start.line}, column ${token.start.column}`
      );
    }

    if (init.type === NODE_TYPES.VariableDeclaration) {
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

  function parseWhileStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "while");
    const test = parseParenthesizedExpression();
    const body = parseBlockStatement();

    return createNode(NODE_TYPES.WhileStatement, keyword.start, body.end, {
      test,
      body
    });
  }

  function parseDoWhileStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "do");
    const body = parseBlockStatement();

    consume(TOKEN_TYPES.Keyword, "while");

    const test = parseParenthesizedExpression();
    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";");
    const endLoc = semi ? semi.end : test.end;

    return createNode(NODE_TYPES.DoWhileStatement, keyword.start, endLoc, {
      body,
      test
    });
  }

  function parseReturnStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "return");
    let argument = null;

    if (!match(TOKEN_TYPES.Punctuator, ";") && !match(TOKEN_TYPES.EOF)) {
      argument = parseExpression();
    }

    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";");
    const ending = semi || argument || keyword;

    return createNode(NODE_TYPES.ReturnStatement, keyword.start, ending.end, {
      argument
    });
  }

  function parseBreakStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "break");
    const identifier = tryConsume(TOKEN_TYPES.Identifier);
    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";");

    let label = null;
    if (identifier) {
      label = parseIdentifier(identifier);
    }

    const ending = semi || identifier || keyword;

    return createNode(NODE_TYPES.BreakStatement, keyword.start, ending.end, {
      label
    });
  }

  function parseContinueStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "continue");
    const identifier = tryConsume(TOKEN_TYPES.Identifier);
    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";");

    let label = null;
    if (identifier) {
      label = parseIdentifier(identifier);
    }

    const ending = semi || identifier || keyword;

    return createNode(NODE_TYPES.ContinueStatement, keyword.start, ending.end, {
      label
    });
  }

  function parseYieldExpression() {
    const keyword = consume(TOKEN_TYPES.Keyword, "yield");
    let argument = null;

    if (!match(TOKEN_TYPES.Punctuator, ";") && !match(TOKEN_TYPES.EOF)) {
      argument = parseExpression();
    }

    const ending = tryConsume(TOKEN_TYPES.Punctuator, ";") || argument || keyword;

    return createNode(NODE_TYPES.YieldExpression, keyword.start, ending.end, {
      argument,
      delegate: false
    });
  }

  function parseThrowStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "throw");
    const token = tokens[state.pos];
    if (token.type !== TOKEN_TYPES.EOF && keyword.start.line !== token.start.line) {
      throw new SyntaxError(
        `Illegal newline after throw at line ${keyword.start.line}, column ${keyword.start.column}`
      );
    }

    const argument = parseExpression();
    const ending = tryConsume(TOKEN_TYPES.Punctuator, ";") || argument;

    return createNode(NODE_TYPES.ThrowStatement, keyword.start, ending.end, {
      argument
    });
  }

  function parseTryStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "try");
    const block = parseBlockStatement();

    let handler = null;
    let finalizer = null;

    if (match(TOKEN_TYPES.Keyword, "catch")) {
      handler = parseCatchClause();
    }

    if (tryConsume(TOKEN_TYPES.Keyword, "finally")) {
      finalizer = parseBlockStatement();
    }

    if (!handler && !finalizer) {
      throw new SyntaxError(
        `Missing catch or finally after try at line ${keyword.start.line}, column ${keyword.start.column}`
      );
    }

    const ending = finalizer || handler || block;

    return createNode(NODE_TYPES.TryStatement, keyword.start, ending.end, {
      block,
      handler,
      finalizer
    });
  }

  function parseCatchClause() {
    const keyword = consume(TOKEN_TYPES.Keyword, "catch");
    let param = null;

    if (match(TOKEN_TYPES.Punctuator, "(")) {
      consume(TOKEN_TYPES.Punctuator, "(");

      param = parseIdentifier();

      consume(TOKEN_TYPES.Punctuator, ")");
    }

    const body = parseBlockStatement();
    const startLoc = param ? keyword.start : body.start;

    return createNode(NODE_TYPES.CatchClause, startLoc, body.end, {
      param,
      body
    });
  }

  // @ts-ignore
  function parseClassDeclaration(type: NODE_TYPES = NODE_TYPES.ClassDeclaration): Statement {} // TODO

  function parseClassPrivateName() {
    const identifier = consume(TOKEN_TYPES.PrivateIdentifier);

    if (identifier.value === "constructor") {
      throw new SyntaxError(
        `Private member cannot be named 'constructor' at line ${identifier.start.line}, column ${identifier.start.column}`
      );
    }

    identifier.start.column += 1;
    identifier.start.index += 1;
    const id = parseIdentifier(identifier);

    return createNode(NODE_TYPES.PrivateName, id.start, id.end, { id });
  }

  function parseImportDeclaration() {
    const index = state.pos;
    const keyword = consume(TOKEN_TYPES.Keyword, "import");

    // Import expression
    if (match(TOKEN_TYPES.Punctuator, "(") || match(TOKEN_TYPES.Punctuator, ".")) {
      state.pos = index;
      return parseExpressionStatement();
    }

    // import "module-name";
    if (match(TOKEN_TYPES.StringLiteral)) {
      const source = parseStringLiteral();
      const ending = tryConsume(TOKEN_TYPES.Punctuator, ";") || source;

      return createNode(NODE_TYPES.ImportDeclaration, keyword.start, ending.end, {
        assertions: [],
        specifiers: [],
        source
      });
    }

    let specifiers = [];

    // import defaultExport from "module-name";
    if (match(TOKEN_TYPES.Identifier)) {
      specifiers.push(parseImportDefaultSpecifier());

      if (match(TOKEN_TYPES.Punctuator, ",")) {
        consume(TOKEN_TYPES.Punctuator, ",");
      }
    }

    if (match(TOKEN_TYPES.Operator, "*")) {
      // import * as name from "module-name";
      specifiers.push(parseImportNamespaceSpecifier());
    } else if (match(TOKEN_TYPES.Punctuator, "{")) {
      // import { export1 , export2 as alias2 } from "module-name";
      specifiers = specifiers.concat(parseImportNamedSpecifiers());
    }

    consume(TOKEN_TYPES.Identifier, "from");

    const source = parseStringLiteral();
    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";") || source;

    return createNode(NODE_TYPES.ImportDeclaration, keyword.start, semi.end, {
      importKind: "value",
      specifiers,
      source
    });
  }

  function parseImportDefaultSpecifier() {
    const local = parseIdentifier(consume(TOKEN_TYPES.Identifier));

    return createNode(NODE_TYPES.ImportDefaultSpecifier, local.start, local.end, {
      local
    });
  }

  function parseImportNamespaceSpecifier() {
    const asterisk = consume(TOKEN_TYPES.Operator, "*");

    consume(TOKEN_TYPES.Identifier, "as");

    const local = parseIdentifier(consume(TOKEN_TYPES.Identifier));

    return createNode(NODE_TYPES.ImportNamespaceSpecifier, asterisk.start, local.end, {
      local
    });
  }

  function parseImportNamedSpecifiers() {
    consume(TOKEN_TYPES.Punctuator, "{");

    const specifiers = [];

    while (!match(TOKEN_TYPES.Punctuator, "}")) {
      const importedIdentifier = consume(TOKEN_TYPES.Identifier);
      let localIdentifier = importedIdentifier;

      if (tryConsume(TOKEN_TYPES.Identifier, "as")) {
        localIdentifier = consume(TOKEN_TYPES.Identifier);
      }

      const imported = parseIdentifier(importedIdentifier);
      const local = parseIdentifier(localIdentifier);

      specifiers.push(
        createNode(NODE_TYPES.ImportSpecifier, imported.start, local.end, {
          importKind: null,
          imported,
          local
        })
      );

      if (!tryConsume(TOKEN_TYPES.Punctuator, ",")) {
        break;
      }
    }

    consume(TOKEN_TYPES.Punctuator, "}");

    return specifiers;
  }

  function isExportDecls(value: string): boolean {
    return value === "const" || value === "let" || value === "var" || value === "function" || value === "class";
  }

  function parseExportDeclaration() {
    if (!match(TOKEN_TYPES.Keyword, "export")) {
      return unexpected();
    }

    const peek = tokens[state.pos + 1];

    if (peek.type === TOKEN_TYPES.Keyword && peek.value === "default") {
      return parseExportDefaultDeclaration();
    }

    if (
      (peek.type === TOKEN_TYPES.Punctuator && peek.value === "{") ||
      (peek.type === TOKEN_TYPES.Operator && peek.value === "*") ||
      (peek.type === TOKEN_TYPES.Identifier && !isExportDecls(peek.value))
    ) {
      return parseExportNamedDeclaration();
    }

    return parseExportDeclarationWithDeclaration();
  }

  function parseExportDefaultDeclaration() {
    const keyword = consume(TOKEN_TYPES.Keyword, "export");
    consume(TOKEN_TYPES.Keyword, "default");

    let declaration = null;
    let ending;

    if (match(TOKEN_TYPES.Keyword, "function")) {
      declaration = parseFunctionExpression();
      declaration.type = NODE_TYPES.FunctionDeclaration;
      ending = declaration;
    } else if (match(TOKEN_TYPES.Keyword, "class")) {
      declaration = parseClassDeclaration(NODE_TYPES.ClassExpression) as Statement | any;
      declaration.type = NODE_TYPES.ClassDeclaration;
      ending = declaration;
    } else {
      declaration = parseMaybeAssign();
      ending = tryConsume(TOKEN_TYPES.Punctuator, ";") || declaration;
    }

    return createNode(NODE_TYPES.ExportDefaultDeclaration, keyword.start, ending.end, {
      declaration
    });
  }

  function parseExportNamedDeclaration(exportKind = "value") {
    const keyword = consume(TOKEN_TYPES.Keyword, "export");
    const specifiers = [];

    if (match(TOKEN_TYPES.Operator, "*")) {
      const asterisk = consume(TOKEN_TYPES.Operator, "*");

      // ExportAllDeclaration
      if (tryConsume(TOKEN_TYPES.Identifier, "from")) {
        const source = parseStringLiteral();
        const semi = tryConsume(TOKEN_TYPES.Punctuator, ";") || source;

        return createNode(NODE_TYPES.ExportAllDeclaration, keyword.start, semi.end, {
          exportKind,
          source,
          assertions: []
        });
      }

      if (tryConsume(TOKEN_TYPES.Identifier, "as")) {
        const name = consume(TOKEN_TYPES.Identifier);
        const exported = parseIdentifier(name);
        const specifier = createNode(NODE_TYPES.ExportNamespaceSpecifier, asterisk.start, name.end, {
          exported
        });

        specifiers.push(specifier);

        if (tryConsume(TOKEN_TYPES.Punctuator, ",") && !match(TOKEN_TYPES.Punctuator, "{")) {
          const token = tokens[state.pos];
          throw new SyntaxError(
            `Unexpected ',' token: expected '{' after ',' at line ${token.start.line}, column ${token.start.column}`
          );
        }
      }
    } else if (match(TOKEN_TYPES.Identifier) && !isExportDecls(tokens[state.pos].value)) {
      specifiers.push(parseExportDefaultSpecifier());
      tryConsume(TOKEN_TYPES.Punctuator, ",");
    }

    if (match(TOKEN_TYPES.Punctuator, "{")) {
      specifiers.push(...parseExportSpecifiers());
    }

    consume(TOKEN_TYPES.Identifier, "from");
    const source = parseStringLiteral();
    const ending = tryConsume(TOKEN_TYPES.Punctuator, ";") || source;

    return createNode(NODE_TYPES.ExportNamedDeclaration, keyword.start, ending.end, {
      source,
      declaration: null,
      assertions: [],
      specifiers,
      exportKind
    });
  }

  function parseExportDeclarationWithDeclaration(exportKind = "value") {
    const keyword = consume(TOKEN_TYPES.Keyword, "export");
    const token = tokens[state.pos];
    let declaration = null;

    switch (token.value) {
      case "const":
      case "let":
      case "var":
        declaration = parseVariableDeclaration();
        break;

      case "function":
        declaration = parseFunctionDeclaration();
        break;

      case "class":
        declaration = parseClassDeclaration();
        break;

      default:
        unexpected();
        break;
    }

    // @ts-ignore
    return createNode(NODE_TYPES.ExportNamedDeclaration, keyword.start, declaration.end, {
      specifiers: [],
      source: null,
      assertions: [],
      declaration,
      exportKind
    });
  }

  function parseExportDefaultSpecifier() {
    const exported = parseIdentifier(consume(TOKEN_TYPES.Identifier));

    return createNode(NODE_TYPES.ExportDefaultSpecifier, exported.start, exported.end, {
      exported
    });
  }

  function parseExportSpecifiers() {
    consume(TOKEN_TYPES.Punctuator, "{");

    const specifiers = [];

    do {
      const local = parseIdentifier(consume(TOKEN_TYPES.Identifier));
      let exported = local;

      if (tryConsume(TOKEN_TYPES.Identifier, "as")) {
        exported = parseIdentifier(consume(TOKEN_TYPES.Identifier));
      }

      specifiers.push(
        createNode(NODE_TYPES.ExportSpecifier, local.start, exported.end, {
          local,
          exported
        })
      );
    } while (tryConsume(TOKEN_TYPES.Punctuator, ","));

    consume(TOKEN_TYPES.Punctuator, "}");

    return specifiers;
  }

  function parseDebuggerStatement() {
    const keyword = consume(TOKEN_TYPES.Keyword, "debugger");
    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";");
    const token = tokens[state.pos];
    if (
      !semi &&
      !(token.type === TOKEN_TYPES.CommentBlock || token.type === TOKEN_TYPES.CommentLine) &&
      token.type !== TOKEN_TYPES.EOF &&
      token.value !== "}" &&
      keyword.start.line === token.start.line
    ) {
      throw new SyntaxError(
        `Unexpected token: after 'debugger' statement ${keyword.value} at line ${keyword.start.line}, column ${keyword.start.column}`
      );
    }

    const ending = semi || keyword;

    return createNode(NODE_TYPES.DebuggerStatement, keyword.start, ending.end);
  }

  function parseBindingAtom(): Node | any {
    if (match(TOKEN_TYPES.Identifier) || match(TOKEN_TYPES.Keyword)) {
      return parseIdentifier();
    }

    if (match(TOKEN_TYPES.Punctuator, "{")) {
      return parseObjectPattern();
    }

    if (match(TOKEN_TYPES.Punctuator, "[")) {
      return parseArrayPattern();
    }

    return unexpected();
  }

  function parseEmptyStatement() {
    const semi = consume(TOKEN_TYPES.Punctuator, ";");
    return createNode(NODE_TYPES.EmptyStatement, semi.start, semi.end);
  }

  function parseIdentifier(node?: Token): Node {
    const token = node ?? tokens[state.pos];

    if (!node) {
      next();
    }

    return createNode(NODE_TYPES.Identifier, token.start, token.end, {
      name: token.value
    });
  }

  function parseNumericLiteral() {
    const token = consume(TOKEN_TYPES.NumericLiteral);

    return createNode(NODE_TYPES.NumericLiteral, token.start, token.end, {
      value: token.value,
      raw: token.raw
    });
  }

  function parseStringLiteral() {
    const token = consume(TOKEN_TYPES.StringLiteral);

    return createNode(NODE_TYPES.StringLiteral, token.start, token.end, {
      value: token.value,
      raw: token.raw
    });
  }

  function parseTemplateLiteral() {
    const opening = consume(TOKEN_TYPES.TemplateLiteralBegin, "`");

    let quasis = [];
    let expressions = [];

    while (!match(TOKEN_TYPES.TemplateLiteralEnd, "`")) {
      quasis.push(parseTemplateElement());

      if (tryConsume(TOKEN_TYPES.TemplateExpressionStart, "${")) {
        expressions.push(parseExpression());
        consume(TOKEN_TYPES.TemplateExpressionEnd, "}");
      }
    }

    const closing = consume(TOKEN_TYPES.TemplateLiteralEnd, "`");

    return createNode(NODE_TYPES.TemplateLiteral, opening.start, closing.end, {
      quasis,
      expressions
    });
  }

  function parseTemplateElement() {
    const token = consume(TOKEN_TYPES.TemplateElement);

    return createNode(NODE_TYPES.TemplateElement, token.start, token.end, {
      value: {
        raw: token.raw,
        cooked: token.cooked
      },
      tail: token.tail
    });
  }

  function parseRegExpLiteral() {
    const token = consume(TOKEN_TYPES.RegExpLiteral);
    const pattern = token?.pattern ?? "";
    const flags = token?.flags ?? "";
    const raw = token?.raw ?? `/${pattern}/${flags}`;

    return createNode(NODE_TYPES.RegExpLiteral, token.start, token.end, {
      pattern,
      flags,
      raw
    });
  }

  function parseParenthesizedExpression() {
    const startLoc = tokens[state.pos].start;

    consume(TOKEN_TYPES.Punctuator, "(");

    if (tryConsume(TOKEN_TYPES.Punctuator, ")")) {
      if (tryConsume(TOKEN_TYPES.Operator, "=>")) {
        return parseArrowFunctionExpression(startLoc, []);
      }

      throw new SyntaxError(
        `Unexpected token: ) at line ${tokens[state.pos].start.line}, column ${tokens[state.pos].start.column}`
      );
    }

    const expr = parseExpression();
    if (match(TOKEN_TYPES.Punctuator, ",")) {
      const exprs = [expr];

      while (tryConsume(TOKEN_TYPES.Punctuator, ",")) {
        exprs.push(parseExpression());
      }

      consume(TOKEN_TYPES.Punctuator, ")");

      if (tryConsume(TOKEN_TYPES.Operator, "=>")) {
        return parseArrowFunctionExpression(startLoc, exprs);
      }

      return createNode(NODE_TYPES.SequenceExpression, expr.start, exprs[exprs.length - 1].end, {
        expressions: exprs
      });
    }

    consume(TOKEN_TYPES.Punctuator, ")");

    if (tryConsume(TOKEN_TYPES.Operator, "=>")) {
      return parseArrowFunctionExpression(startLoc, [expr]);
    }

    return expr;
  }

  function parseObjectPattern(): Node {
    const opening = consume(TOKEN_TYPES.Punctuator, "{");
    const properties = [];
    let trailingComma;

    while (!match(TOKEN_TYPES.Punctuator, "}")) {
      properties.push(parseObjectPatternProperty());

      if (tryConsume(TOKEN_TYPES.Punctuator, ",")) {
        if (match(TOKEN_TYPES.Punctuator, "}")) {
          trailingComma = properties[properties.length - 1].end;
          break;
        }
      } else {
        break;
      }
    }

    const closing = consume(TOKEN_TYPES.Punctuator, "}");
    const node = createNode(NODE_TYPES.ObjectPattern, opening.start, closing.end, {
      properties
    });

    if (trailingComma) {
      node.trailingComma = trailingComma;
    }

    return node;
  }

  function parseObjectPatternProperty() {
    if (match(TOKEN_TYPES.Punctuator, "...")) {
      return parseRestElement();
    }

    const key = parseObjectPropertyKey();
    let value = key;
    let shorthand = false;

    if (tryConsume(TOKEN_TYPES.Operator, ":")) {
      value = parseAssignableListItem();
    } else {
      if (match(TOKEN_TYPES.Operator, "=")) {
        value = parseMaybeDefault(value);
        shorthand = true;
      } else {
        if (key.type !== NODE_TYPES.Identifier) {
          throw new SyntaxError(
            `Unexpected token in object pattern: ${key.value} at line ${key.start.line}, column ${key.start.column}`
          );
        }

        shorthand = true;
      }
    }

    const node = createNode(NODE_TYPES.ObjectProperty, key.start, value.end, {
      method: false,
      shorthand,
      computed: false,
      key,
      value
    });

    return node;
  }

  function parseArrayPattern() {
    const opening = consume(TOKEN_TYPES.Punctuator, "[");

    const elements = [];

    while (!match(TOKEN_TYPES.Punctuator, "]")) {
      if (match(TOKEN_TYPES.Punctuator, ",")) {
        consume(TOKEN_TYPES.Punctuator, ",");
        elements.push(null);
      } else if (match(TOKEN_TYPES.Punctuator, "...")) {
        let rest = parseRestElement();

        if (match(TOKEN_TYPES.Operator, ":")) {
          const typeAnnotation = parseTypeAnnotation();
          rest.typeAnnotation = typeAnnotation;
          rest.end = typeAnnotation.end;
          rest.end = typeAnnotation.end;
        }

        elements.push(rest);

        if (match(TOKEN_TYPES.Punctuator, ",")) {
          const token = tokens[state.pos];
          throw new SyntaxError(
            `Unexpected token after rest element: ${token.value} at line ${token.start.line}, column ${token.start.column}`
          );
        }
      } else {
        elements.push(parseAssignableListItem(true));
        tryConsume(TOKEN_TYPES.Punctuator, ",");
      }
    }

    const closing = consume(TOKEN_TYPES.Punctuator, "]");

    return createNode(NODE_TYPES.ArrayPattern, opening.start, closing.end, {
      elements
    });
  }

  function parseRestElement() {
    const ellipsis = consume(TOKEN_TYPES.Punctuator, "...");
    const identifier = consume(TOKEN_TYPES.Identifier);

    return createNode(NODE_TYPES.RestElement, ellipsis.start, identifier.end, {
      argument: parseIdentifier(identifier)
    });
  }

  function parseSpreadElement() {
    const ellipsis = consume(TOKEN_TYPES.Punctuator, "...");
    const argument = parseMaybeAssign();

    return createNode(NODE_TYPES.SpreadElement, ellipsis.start, argument.end, {
      argument
    });
  }

  function parseTypeAnnotation() {
    const colon = consume(TOKEN_TYPES.Operator, ":");
    const typeName = consume(TOKEN_TYPES.Identifier);

    return createNode(NODE_TYPES.TypeAnnotation, colon.start, typeName.end, {
      typeAnnotation: createNode(NODE_TYPES.GenericTypeAnnotation, typeName.start, typeName.end, {
        id: parseIdentifier(typeName),
        typeParameters: null
      })
    });
  }

  function parseParamsStatement(): Statement[] {
    consume(TOKEN_TYPES.Punctuator, "(");
    const params = [];

    if (!match(TOKEN_TYPES.Punctuator, ")")) {
      do {
        if (match(TOKEN_TYPES.Punctuator, "...")) {
          let rest = parseRestElement();

          if (match(TOKEN_TYPES.Operator, ":")) {
            const typeAnnotation = parseTypeAnnotation();
            rest.typeAnnotation = typeAnnotation;
            rest.end = typeAnnotation.end;
          }

          params.push(rest);
          break;
        }

        params.push(parseAssignableListItem(true));
      } while (tryConsume(TOKEN_TYPES.Punctuator, ","));
    }

    consume(TOKEN_TYPES.Punctuator, ")");

    return params;
  }

  function parseBlockStatement() {
    const opening = consume(TOKEN_TYPES.Punctuator, "{");

    const body: Statement[] = [];
    while (!match(TOKEN_TYPES.Punctuator, "}")) {
      const statement = parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    const closing = consume(TOKEN_TYPES.Punctuator, "}");

    return createNode(NODE_TYPES.BlockStatement, opening.start, closing.end, {
      body
    });
  }

  function parseAssignableListItem(isParam = false) {
    let node = parseMaybeDefault();

    if (isParam && match(TOKEN_TYPES.Operator, ":")) {
      node.typeAnnotation = parseTypeAnnotation();
      node.end = node.typeAnnotation.end;
    }

    return parseMaybeDefault(node);
  }

  function parseMaybeDefault(node?: Node) {
    const left = node ?? parseBindingAtom();

    if (tryConsume(TOKEN_TYPES.Operator, "=")) {
      const right = parseMaybeAssign();

      return createNode(NODE_TYPES.AssignmentPattern, left.start, right.end, {
        left,
        right
      });
    }

    return left;
  }

  function parseExpression() {
    return parseMaybeAssign();
  }

  function isAssign(value: string): boolean {
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

  function parseMaybeAssign(): Statement | Expression {
    if (match(TOKEN_TYPES.Keyword, "async")) {
      const index = state.pos;
      next();

      if (shouldParseAsyncArrow()) {
        return parseAsyncArrow(tokens[index].start);
      }

      state.pos = index;
    }

    let left = parseMaybeConditional();

    if (left.type === NODE_TYPES.Identifier && tryConsume(TOKEN_TYPES.Operator, "=>")) {
      return parseArrowFunctionExpression(left.start, [left]);
    }

    if (tokens[state.pos] && tokens[state.pos].type === TOKEN_TYPES.Operator && isAssign(tokens[state.pos].value)) {
      if (left.type === NODE_TYPES.ObjectExpression || left.type === NODE_TYPES.ArrayExpression) {
        left = toAssignable(left);
      }

      const operator = tokens[state.pos].value;
      next();
      const right = parseMaybeAssign();

      left = createNode(NODE_TYPES.AssignmentExpression, left.start, right.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  function shouldParseAsyncArrow() {
    const idx = state.pos;
    const t = tokens[idx];

    if (!t) {
      return false;
    }

    if (t.type === TOKEN_TYPES.Punctuator && t.value === "(") {
      let parenCount = 1;
      let index = idx + 1;
      const start = idx + 1;
      const lookahead = Math.min(tokens.length, start + 1000); // Arbitrary lookahead to prevent infinite loops in case of syntax errors

      while (parenCount > 0 && index < lookahead) {
        const token = tokens[index];

        if (token.type === TOKEN_TYPES.Punctuator && token.value === "(") {
          parenCount++;
        } else if (token.type === TOKEN_TYPES.Punctuator && token.value === ")") {
          parenCount--;
        } else if (token.type === TOKEN_TYPES.EOF) {
          return false;
        }

        index++;
      }

      if (parenCount > 0) {
        return false;
      }

      const next = tokens[index];

      if (!next || next.value !== "=>") {
        return false;
      }

      const parenToken = tokens[index - 1];

      if (parenToken.start.line !== next.start.line) {
        return false;
      }

      // TODO Annotations between parentheses and arrows

      const paramsTokens = tokens.slice(start, index - 1);

      // Check for invalid tokens in parameters
      if (paramsTokens.length === 0) {
        return true;
      }

      let i = 0;

      while (i < paramsTokens.length) {
        const token = paramsTokens[i];

        if (token.type === TOKEN_TYPES.Identifier) {
          i++;

          if (paramsTokens[i] && paramsTokens[i].type === TOKEN_TYPES.Operator && paramsTokens[i].value === ":") {
            i++;

            if (i < paramsTokens.length && paramsTokens[i].type === TOKEN_TYPES.Identifier) {
              i++;
            }
          }

          if (paramsTokens[i] && paramsTokens[i].type === TOKEN_TYPES.Operator && paramsTokens[i].value === "=") {
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

        if (token.type === TOKEN_TYPES.Punctuator && token.value === "{") {
          i++;
          let bracketCount = 1;

          while (i < paramsTokens.length && bracketCount > 0) {
            const target = paramsTokens[i];

            if (target.type === TOKEN_TYPES.Punctuator && target.value === "{") {
              bracketCount++;
            } else if (target.type === TOKEN_TYPES.Punctuator && target.value === "}") {
              bracketCount--;
            }

            i++;
          }

          if (bracketCount === 0) {
            continue;
          }
        }

        if (token.type === TOKEN_TYPES.Punctuator && token.value === "[") {
          i++;
          let bracketCount = 1;

          while (i < paramsTokens.length && bracketCount > 0) {
            const target = paramsTokens[i];

            if (target.type === TOKEN_TYPES.Punctuator && target.value === "[") {
              bracketCount++;
            } else if (target.type === TOKEN_TYPES.Punctuator && target.value === "]") {
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

    const peek = tokens[idx + 1];
    if (!peek) {
      return false;
    }

    if (t.type === TOKEN_TYPES.Identifier) {
      if (
        (peek.type === TOKEN_TYPES.Keyword && peek.value === "yield") ||
        (peek.type === TOKEN_TYPES.Keyword && peek.value === "await")
      ) {
        return false;
      }

      return allowedParseAsyncArrow(t, peek);
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
      return allowedParseAsyncArrow(t, peek);
    }

    return false;
  }

  function allowedParseAsyncArrow(token1: Token, token2: Token) {
    if (token2.type === TOKEN_TYPES.Operator && token2.value !== "=>") {
      return false;
    }

    if (token1.start.line !== token2.start.line || token2.type === TOKEN_TYPES.EOF) {
      return false;
    }

    if ((token2.value === "arguments" || token2.value === "eval") && config.strictMode) {
      return false;
    }

    return true;
  }

  function parseAsyncArrow(start: Location) {
    let params = [];

    if (match(TOKEN_TYPES.Punctuator, "(")) {
      params = parseParamsStatement();
    } else {
      params = [parseIdentifier()];
    }

    consume(TOKEN_TYPES.Operator, "=>");

    return parseArrowFunctionExpression(start, params, true);
  }

  function toAssignable(node: Statement | any) {
    switch (node.type) {
      case NODE_TYPES.ObjectExpression:
        node.type = NODE_TYPES.ObjectPattern;
        node.properties.map((prop: Statement) => {
          if (prop.type === NODE_TYPES.ObjectProperty) {
            prop.value = toAssignable(prop.value);
          } else if (prop.type === NODE_TYPES.SpreadElement) {
            prop.type = NODE_TYPES.RestElement;
            prop.argument = toAssignable(prop.argument);
          }

          return prop;
        });

        return node;

      case NODE_TYPES.ArrayExpression:
        node.type = NODE_TYPES.ArrayPattern;
        node.elements.map((element: Statement, index: number) => {
          if (!element) {
            return;
          }

          if (element.type === NODE_TYPES.AssignmentExpression) {
            // Convert assignment expression inside array pattern to AssignmentPattern
            // keep the right hand side, make left assignable
            element.type = NODE_TYPES.AssignmentPattern;
            element.left = toAssignable(element.left);
            node.elements[index] = element;
          } else if (element.type === NODE_TYPES.SpreadElement) {
            // Convert spread in array to rest element and recurse on argument
            element.type = NODE_TYPES.RestElement;
            element.argument = toAssignable(element.argument);
            node.elements[index] = element;
          } else {
            node.elements[index] = toAssignable(element);
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
          `Invalid left-hand side in assignment at line ${node.start.line}, column ${node.start.column}`
        );
    }
  }

  function parseMaybeConditional() {
    const test = parseExprOps();

    if (tryConsume(TOKEN_TYPES.Operator, "?")) {
      const consequent = parseMaybeAssign();

      consume(TOKEN_TYPES.Operator, ":");

      const alternate = parseMaybeAssign();

      return createNode(NODE_TYPES.ConditionalExpression, test.start, alternate.end, {
        test,
        consequent,
        alternate
      });
    }

    return test;
  }

  function parseExprOps() {
    let left = parseMaybeBinary();

    while (
      match(TOKEN_TYPES.Operator, "||") ||
      match(TOKEN_TYPES.Operator, "&&") ||
      match(TOKEN_TYPES.Operator, "??")
    ) {
      const operator = tokens[state.pos].value;

      next();

      const right = parseMaybeBinary();

      left = createNode(NODE_TYPES.LogicalExpression, left.start, right.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  function isBinaryOps(value: string): boolean {
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

  function parseMaybeBinary() {
    let left: Statement | any = parseMaybeUnary();

    while (
      tokens[state.pos] && (
        (tokens[state.pos].type === TOKEN_TYPES.Operator && isBinaryOps(tokens[state.pos].value)) ||
        (tokens[state.pos].type === TOKEN_TYPES.Keyword && (tokens[state.pos].value === "instanceof" || tokens[state.pos].value === "in"))
      )
    ) {
      const operator = tokens[state.pos].value;

      if (operator === "in") {
        if (state.inForInit) {
          if (validateForInLeft(left)) {
            if (left.type === NODE_TYPES.VariableDeclaration) {
              validateForInOfLeft(left, operator);
            }

            return left;
          }
        }

        if (!left) {
          throw new SyntaxError(
            `Invalid left-hand side in assignment at line ${tokens[state.pos].start.line}, column ${
              tokens[state.pos].start.column
            }`
          );
        }

        if (left.type === NODE_TYPES.PrivateName) {
          throw new SyntaxError(
            `Private identifier is not allowed as an assignment target at line ${left.start.line}, column ${left.start.column}`
          );
        }

        if (left.type === NODE_TYPES.ObjectPattern || left.type === NODE_TYPES.ArrayPattern) {
          throw new SyntaxError(
            `Invalid assignment target: cannot assign to a destructuring pattern here at line ${left.start.line}, column ${left.start.column}`
          );
        }
      }

      next();

      const right = parseMaybeUnary();

      left = createNode(NODE_TYPES.BinaryExpression, left.start, right.end, {
        operator,
        left,
        right
      });
    }

    return left;
  }

  function parseMaybeUnary(): Statement | Expression {
    if (match(TOKEN_TYPES.Operator, "++") || match(TOKEN_TYPES.Operator, "--")) {
      const token = tokens[state.pos];

      next();

      const argument = parseMaybeUnary();

      return createNode(NODE_TYPES.UpdateExpression, token.start, argument.end, {
        operator: token.value,
        argument,
        prefix: true
      });
    }

    if (
      match(TOKEN_TYPES.Operator, "+") ||
      match(TOKEN_TYPES.Operator, "-") ||
      match(TOKEN_TYPES.Operator, "!") ||
      match(TOKEN_TYPES.Operator, "~") ||
      match(TOKEN_TYPES.Keyword, "typeof") ||
      match(TOKEN_TYPES.Keyword, "void") ||
      match(TOKEN_TYPES.Keyword, "delete")
    ) {
      const token = tokens[state.pos];

      next();

      const argument = parseMaybeUnary();

      return createNode(NODE_TYPES.UnaryExpression, token.start, argument.end, {
        operator: token.value,
        argument,
        prefix: true
      });
    }

    const argument = parseExprSubscripts();

    if (match(TOKEN_TYPES.Operator, "++") || match(TOKEN_TYPES.Operator, "--")) {
      const token = tokens[state.pos];

      next();

      if (argument.type === NODE_TYPES.PrivateName) {
        throw new SyntaxError(
          `Private identifier is not allowed as an assignment target at line ${argument.start.line}, column ${argument.start.column}`
        );
      }

      if (argument.type === NODE_TYPES.ObjectPattern || argument.type === NODE_TYPES.ArrayPattern) {
        throw new SyntaxError(
          `Invalid assignment target: cannot assign to a destructuring pattern here at line ${argument.start.line}, column ${argument.start.column}`
        );
      }

      return createNode(NODE_TYPES.UpdateExpression, argument.start, token.end, {
        operator: token.value,
        argument,
        prefix: false
      });
    }

    return argument;
  }

  function parseExprSubscripts(): Statement | any {
    let object = parsePrimaryExpr();

    while (state.pos < tokens.length) {
      if (match(TOKEN_TYPES.Punctuator, ".") || match(TOKEN_TYPES.Punctuator, "[")) {
        object = parseMemberExpr(object);
        continue;
      }

      if (match(TOKEN_TYPES.Punctuator, "(")) {
        object = parseCallExpr(object);
        continue;
      }

      if (match(TOKEN_TYPES.Punctuator, "?.")) {
        object = parseOptionalExpr(object);
        continue;
      }

      break;
    }

    return object;
  }

  function parseMemberExpr(object: Statement | Expression) {
    if (match(TOKEN_TYPES.Punctuator, ".")) {
      consume(TOKEN_TYPES.Punctuator, ".");
      let property = null;

      if (match(TOKEN_TYPES.Identifier) || match(TOKEN_TYPES.Keyword)) {
        property = parseIdentifier();
      } else {
        property = parseClassPrivateName();
      }

      return createNode(NODE_TYPES.MemberExpression, object.start, property.end, {
        object,
        property,
        computed: false
      });
    }

    if (match(TOKEN_TYPES.Punctuator, "[")) {
      const opening = consume(TOKEN_TYPES.Punctuator, "[");
      const property = parseExpression();
      const closing = consume(TOKEN_TYPES.Punctuator, "]");

      return createNode(NODE_TYPES.MemberExpression, object.start, closing.end, {
        object,
        property,
        computed: true
      });
    }

    throw new SyntaxError(
      `Unexpected token after member expression at line ${tokens[state.pos].start.line}, column ${
        tokens[state.pos].start.column
      }`
    );
  }

  function parseCallExpr(callee: Statement | Expression) {
    consume(TOKEN_TYPES.Punctuator, "(");

    const args = [];

    if (!match(TOKEN_TYPES.Punctuator, ")")) {
      do {
        if (match(TOKEN_TYPES.Punctuator, "...")) {
          args.push(parseSpreadElement());

          if (match(TOKEN_TYPES.Punctuator, ",")) {
            throw new SyntaxError(
              `Rest element must be last element in argument list at line ${tokens[state.pos].start.line}, column ${
                tokens[state.pos].start.column
              }`
            );
          }
        } else {
          args.push(parseMaybeAssign());
        }
      } while (tryConsume(TOKEN_TYPES.Punctuator, ","));
    }

    const closing = consume(TOKEN_TYPES.Punctuator, ")");

    return createNode(NODE_TYPES.CallExpression, callee.start, closing.end, {
      callee,
      arguments: args
    });
  }

  function parseOptionalExpr(object: Statement | Expression) {
    consume(TOKEN_TYPES.Punctuator, "?.");

    if (match(TOKEN_TYPES.Identifier) || match(TOKEN_TYPES.Keyword)) {
      const property = parseIdentifier();

      return createNode(NODE_TYPES.OptionalMemberExpression, object.start, property.end, {
        object,
        property,
        computed: false,
        optional: true
      });
    }

    if (match(TOKEN_TYPES.Punctuator, "[")) {
      const opening = consume(TOKEN_TYPES.Punctuator, "[");
      const property = parseExpression();
      const closing = consume(TOKEN_TYPES.Punctuator, "]");

      return createNode(NODE_TYPES.OptionalMemberExpression, object.start, closing.end, {
        object,
        property,
        computed: true,
        optional: true
      });
    }

    if (match(TOKEN_TYPES.Punctuator, "(")) {
      const expr = parseCallExpr(object);
      expr.type = NODE_TYPES.OptionalCallExpression;
      expr.optional = true;
      return expr;
    }

    throw new SyntaxError(
      `Unexpected token after optional chaining operator at line ${tokens[state.pos].start.line}, column ${
        tokens[state.pos].start.column
      }`
    );
  }

  function parsePrimaryExpr(): Statement | any {
    const type = tokens[state.pos].type;

    if (type === TOKEN_TYPES.Keyword) {
      switch (tokens[state.pos].value) {
        case "function":
          return parseFunctionExpression();

        case "this":
          return parseThisExpr();

        case "super":
          return parseSuperExpr();

        case "new":
          return parseNewExpression();

        case "delete":
          return parseMaybeUnary(); // parseUnaryExpression();

        case "class":
          return parseClassDeclaration(NODE_TYPES.ClassExpression);

        case "import":
          return parseImportExpression();

        case "async":
          return parseAsyncExpression();

        case "await":
          return parseAwaitExpression();

        default:
          return parseIdentifier();
      }
    }

    if (type === TOKEN_TYPES.NumericLiteral) {
      return parseNumericLiteral();
    }

    if (type === TOKEN_TYPES.StringLiteral) {
      return parseStringLiteral();
    }

    if (type === TOKEN_TYPES.BooleanLiteral) {
      const token = tokens[state.pos];
      next();
      return createNode(NODE_TYPES.BooleanLiteral, token.start, token.end, {
        value: token.value
      });
    }

    if (type === TOKEN_TYPES.NullLiteral) {
      const token = tokens[state.pos];
      next();
      return createNode(NODE_TYPES.NullLiteral, token.start, token.end);
    }

    if (type === TOKEN_TYPES.Identifier) {
      return parseIdentifier();
    }

    if (match(TOKEN_TYPES.Punctuator, "(")) {
      return parseParenthesizedExpression();
    }

    if (match(TOKEN_TYPES.Punctuator, "[")) {
      return parseArrayExpression();
    }

    if (match(TOKEN_TYPES.Punctuator, "{")) {
      return parseObjectExpression();
    }

    if (match(TOKEN_TYPES.TemplateLiteralBegin, "`")) {
      return parseTemplateLiteral();
    }

    if (type === TOKEN_TYPES.RegExpLiteral) {
      return parseRegExpLiteral();
    }

    if (type === TOKEN_TYPES.EOF) {
      const token = tokens[state.pos];
      throw new SyntaxError(`Unexpected end of input at line ${token.start.line}, column ${token.start.column}`);
    }

    unexpected();
  }

  function parseExpressionStatement() {
    const expression = parseExpression();
    const semi = tryConsume(TOKEN_TYPES.Punctuator, ";");
    const ending = semi || expression;

    return createNode(NODE_TYPES.ExpressionStatement, expression.start, ending.end, {
      expression
    });
  }

  function parseFunctionExpression(start = tokens[state.pos].start, isAsync = false) {
    consume(TOKEN_TYPES.Keyword, "function");
    const isGenerator = !!tryConsume(TOKEN_TYPES.Operator, "*");

    let id = null;

    if (match(TOKEN_TYPES.Identifier) || match(TOKEN_TYPES.Keyword)) {
      id = parseIdentifier();
    }

    const params = parseParamsStatement();
    const body = parseBlockStatement();

    return createNode(NODE_TYPES.FunctionExpression, start, body.end, {
      id,
      params,
      body,
      generator: isGenerator,
      async: isAsync
    });
  }

  function parseAsyncExpression() {
    const keyword = consume(TOKEN_TYPES.Keyword, "async");

    if (shouldParseAsyncArrow()) {
      return parseAsyncArrow(keyword.start);
    }

    if (match(TOKEN_TYPES.Keyword, "function")) {
      return parseFunctionExpression(keyword.start, true);
    }

    return parseIdentifier(keyword);
  }

  function parseAwaitExpression() {
    const token = tokens[state.pos];
    next();

    // if (!isAwait()) {
    //   throw new SyntaxError(`Unexpected reserved word 'await' at line ${token.start.line}, column ${token.start.column}`);
    // }

    const argument = parseMaybeUnary();

    return createNode(NODE_TYPES.AwaitExpression, token.start, argument.end, {
      argument
    });
  }

  function parseThisExpr() {
    const keyword = consume(TOKEN_TYPES.Keyword, "this");
    return createNode(NODE_TYPES.ThisExpression, keyword.start, keyword.end);
  }

  function parseSuperExpr() {
    const keyword = consume(TOKEN_TYPES.Keyword, "super");
    return createNode(NODE_TYPES.Super, keyword.start, keyword.end);
  }

  function parseNewExpression(): Expression {
    const keyword = consume(TOKEN_TYPES.Keyword, "new");
    const callee = parseExprSubscripts();
    const args = [];
    let closing = callee;

    if (tryConsume(TOKEN_TYPES.Punctuator, "(")) {
      if (!match(TOKEN_TYPES.Punctuator, ")")) {
        do {
          if (match(TOKEN_TYPES.Punctuator, "...")) {
            args.push(parseSpreadElement());
            continue;
          }

          args.push(parseMaybeAssign());
        } while (tryConsume(TOKEN_TYPES.Punctuator, ","));
      }

      closing = consume(TOKEN_TYPES.Punctuator, ")");
    }

    return createNode(NODE_TYPES.NewExpression, keyword.start, closing.end, {
      callee,
      typeArguments: null,
      arguments: args
    });
  }

  function parseImportExpression() {
    const keyword = consume(TOKEN_TYPES.Keyword, "import");

    // Dynamic import
    if (match(TOKEN_TYPES.Punctuator, "(")) {
      return createNode(NODE_TYPES.ImportExpression, keyword.start, keyword.end);
    }

    // Meta attribute
    if (match(TOKEN_TYPES.Punctuator, ".")) {
      consume(TOKEN_TYPES.Punctuator, ".");
      const identifier = consume(TOKEN_TYPES.Identifier);

      if (identifier.value === "meta") {
        const meta = createNode(NODE_TYPES.Identifier, keyword.start, keyword.end, {
          name: "import"
        });
        const property = createNode(NODE_TYPES.Identifier, identifier.start, identifier.end, {
          name: "meta"
        });

        return createNode(NODE_TYPES.MetaProperty, keyword.start, identifier.end, {
          meta,
          property
        });
      }
    }

    const token = tokens[state.pos];
    throw new SyntaxError(
      `Unexpected token after import: ${token.value} at line ${token.start.line}, column ${token.start.column}`
    );
  }

  function parseArrowFunctionExpression(start: Location, params: Statement[], isAsync = false): Expression {
    let body;

    if (match(TOKEN_TYPES.Punctuator, "{")) {
      body = parseBlockStatement();
    } else {
      body = parseExpression();
    }

    return createNode(NODE_TYPES.ArrowFunctionExpression, start, body.end, {
      params,
      body,
      id: null,
      async: isAsync,
      generator: false
    });
  }

  function parseArrayExpression() {
    const opening = consume(TOKEN_TYPES.Punctuator, "[");
    const elements = [];

    if (!match(TOKEN_TYPES.Punctuator, "]")) {
      do {
        if (match(TOKEN_TYPES.Punctuator, ",")) {
          elements.push(null);
          continue;
        }

        if (match(TOKEN_TYPES.Punctuator, "...")) {
          elements.push(parseSpreadElement());
          continue;
        }

        elements.push(parseMaybeAssign());
      } while (tryConsume(TOKEN_TYPES.Punctuator, ","));
    }

    const closing = consume(TOKEN_TYPES.Punctuator, "]");

    return createNode(NODE_TYPES.ArrayExpression, opening.start, closing.end, {
      elements
    });
  }

  function parseObjectExpression() {
    const opening = consume(TOKEN_TYPES.Punctuator, "{");
    const properties = [];
    let trailingComma;

    if (!match(TOKEN_TYPES.Punctuator, "}")) {
      do {
        const property = parseObjectProperty();
        if (property) {
          properties.push(property);
        }

        if (tryConsume(TOKEN_TYPES.Punctuator, ",")) {
          if (match(TOKEN_TYPES.Punctuator, "}")) {
            trailingComma = properties[properties.length - 1].end;
            break;
          }
        } else {
          break;
        }
      } while (true);
    }

    const closing = consume(TOKEN_TYPES.Punctuator, "}");
    const node = createNode(NODE_TYPES.ObjectExpression, opening.start, closing.end, {
      properties
    });

    if (trailingComma) {
      node.extra = {
        trailingComma
      };
    }

    return node;
  }

  function parseObjectProperty() {
    const startLoc = tokens[state.pos].start;

    if (match(TOKEN_TYPES.Punctuator, "...")) {
      return parseSpreadElement();
    }

    let isAsync = false;
    let isGenerator = false;
    let kind = "method";

    const peek = tokens[state.pos + 1];
    if (tokens[state.pos].value === "async" && (peek.type === TOKEN_TYPES.Identifier || peek.value === "*")) {
      isAsync = true;
      next();
    }

    if (tokens[state.pos].value === "*") {
      isGenerator = true;
      next();
    }

    if (tokens[state.pos].value === "get" || tokens[state.pos].value === "set") {
      if (tokens[state.pos + 1].value !== "(") {
        if (isGenerator) {
          const token = tokens[state.pos];
          throw new SyntaxError(
            `Generator methods cannot be getters or setters at line ${token.start.line}, column ${token.start.column}`
          );
        }

        kind = tokens[state.pos].value;
        next();
      }
    }

    if (tryConsume(TOKEN_TYPES.Punctuator, "[")) {
      const key = parseMaybeAssign();
      consume(TOKEN_TYPES.Punctuator, "]");

      if (tokens[state.pos].value === "(") {
        return parseObjectMethod(key, kind, startLoc, isAsync, isGenerator, true);
      }

      consume(TOKEN_TYPES.Operator, ":");

      const value = parseMaybeAssign();

      return createNode(NODE_TYPES.ObjectProperty, startLoc, value.end, {
        key,
        value,
        method: false,
        computed: true,
        shorthand: false
      });
    }

    const key = parseObjectPropertyKey();

    if (tokens[state.pos].value === "(") {
      return parseObjectMethod(key, kind, startLoc, isAsync, isGenerator);
    }

    let value;

    if (tryConsume(TOKEN_TYPES.Operator, ":")) {
      value = parseMaybeAssign();
    } else {
      value = {
        ...key,
        range: key.range,
        extra: key.extra
      };
    }

    return createNode(NODE_TYPES.ObjectProperty, startLoc, value.end, {
      key,
      value,
      method: false,
      computed: false,
      shorthand: key.type === NODE_TYPES.Identifier && value.type === NODE_TYPES.Identifier && key.name === value.name
    });
  }

  function parseObjectMethod(key: Statement, kind: string, start: Location, isAsync = false, isGenerator = false, isComputed = false) {
    const params = parseParamsStatement();
    const body = parseBlockStatement();

    return createNode(NODE_TYPES.ObjectMethod, start, body.end, {
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

  function parseObjectPropertyKey(): Node | any {
    const token = tokens[state.pos];

    switch (token.type) {
      case TOKEN_TYPES.Identifier:
      case TOKEN_TYPES.Keyword:
      case TOKEN_TYPES.NullLiteral:
      case TOKEN_TYPES.BooleanLiteral:
        return parseIdentifier();

      case TOKEN_TYPES.NumericLiteral:
        return parseNumericLiteral();

      case TOKEN_TYPES.StringLiteral:
        return parseStringLiteral();

      default:
        unexpected();
        break;
    }
  }

  return {
    parse,
    getTokens() {
      return tokens
    },
    getAST() {
      return ast
    }
  };
}
