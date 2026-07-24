export const enum TOKEN_TYPES {
  // Literals
  NullLiteral = "NullLiteral",
  BooleanLiteral = "BooleanLiteral",
  NumericLiteral = "NumericLiteral",
  StringLiteral = "StringLiteral",
  RegExpLiteral = "RegExpLiteral",

  // Template literals
  TemplateLiteralBegin = "TemplateLiteralBegin",
  TemplateLiteralEnd = "TemplateLiteralEnd",
  TemplateElement = "TemplateElement",
  TemplateExpressionStart = "TemplateExpressionStart",
  TemplateExpressionEnd = "TemplateExpressionEnd",

  // keywords
  Keyword = "Keyword",

  // Identifiers
  Identifier = "Identifier",
  PrivateIdentifier = "PrivateIdentifier",

  // Operators
  Operator = "Operator",

  // Punctuators
  Punctuator = "Punctuator",

  // Comments
  CommentLine = "CommentLine",
  CommentBlock = "CommentBlock",

  // Others
  Whitespace = "Whitespace",
  EOF = "EOF"
}

export const enum NODE_TYPES {
  // Main
  Program = "Program",

  // Identifiers
  Identifier = "Identifier",
  PrivateName = "PrivateName",

  // Literals
  NumericLiteral = "NumericLiteral",
  StringLiteral = "StringLiteral",
  BooleanLiteral = "BooleanLiteral",
  NullLiteral = "NullLiteral",
  RegExpLiteral = "RegExpLiteral",

  // Template Literals
  TemplateLiteral = "TemplateLiteral",
  TemplateElement = "TemplateElement",

  // Variable Declarations
  VariableDeclaration = "VariableDeclaration",
  VariableDeclarator = "VariableDeclarator",

  // Function Declarations
  FunctionDeclaration = "FunctionDeclaration",
  FunctionExpression = "FunctionExpression",
  ArrowFunctionExpression = "ArrowFunctionExpression",
  ObjectMethod = "ObjectMethod",

  // Class Declarations
  ClassDeclaration = "ClassDeclaration",
  ClassExpression = "ClassExpression",
  ClassBody = "ClassBody",
  ClassMethod = "ClassMethod",
  ClassProperty = "ClassProperty",
  ClassPrivateMethod = "ClassPrivateMethod",
  ClassPrivateProperty = "ClassPrivateProperty",

  // Import Declarations
  ImportDeclaration = "ImportDeclaration",
  ImportSpecifier = "ImportSpecifier",
  ImportDefaultSpecifier = "ImportDefaultSpecifier",
  ImportNamespaceSpecifier = "ImportNamespaceSpecifier",
  ImportExpression = "ImportExpression", // Import

  // Export Declarations
  ExportDefaultDeclaration = "ExportDefaultDeclaration",
  ExportNamedDeclaration = "ExportNamedDeclaration",
  ExportAllDeclaration = "ExportAllDeclaration",
  ExportDefaultSpecifier = "ExportDefaultSpecifier",
  ExportNamespaceSpecifier = "ExportNamespaceSpecifier",
  ExportSpecifier = "ExportSpecifier",

  // Expressions
  ThisExpression = "ThisExpression",
  Super = "Super",
  MetaProperty = "MetaProperty",
  ExpressionStatement = "ExpressionStatement",

  // Members/Call Expressions
  MemberExpression = "MemberExpression",
  OptionalMemberExpression = "OptionalMemberExpression",
  CallExpression = "CallExpression",
  OptionalCallExpression = "OptionalCallExpression",
  NewExpression = "NewExpression",

  // Unary/Update Expressions
  UnaryExpression = "UnaryExpression",
  UpdateExpression = "UpdateExpression",
  AwaitExpression = "AwaitExpression",
  YieldExpression = "YieldExpression",

  // Binary/Logical Expressions
  BinaryExpression = "BinaryExpression",
  LogicalExpression = "LogicalExpression",

  // Assignment Expressions
  AssignmentExpression = "AssignmentExpression",
  AssignmentPattern = "AssignmentPattern",

  // Conditional/Sequence Expressions
  ConditionalExpression = "ConditionalExpression",
  SequenceExpression = "SequenceExpression",

  // Array/Object Expressions
  ArrayExpression = "ArrayExpression",
  ArrayPattern = "ArrayPattern",
  ObjectExpression = "ObjectExpression",
  ObjectProperty = "ObjectProperty",
  ObjectPattern = "ObjectPattern",

  // Spread/Rest Elements
  SpreadElement = "SpreadElement",
  RestElement = "RestElement",

  // Block Statements
  BlockStatement = "BlockStatement",
  EmptyStatement = "EmptyStatement",
  DebuggerStatement = "DebuggerStatement",
  WithStatement = "WithStatement",

  // Control Flows
  IfStatement = "IfStatement",
  SwitchStatement = "SwitchStatement",
  SwitchCase = "SwitchCase",
  LabeledStatement = "LabeledStatement",
  ReturnStatement = "ReturnStatement",

  // Loop Statements
  ForStatement = "ForStatement",
  ForInStatement = "ForInStatement",
  ForOfStatement = "ForOfStatement",
  WhileStatement = "WhileStatement",
  DoWhileStatement = "DoWhileStatement",

  // Jump Statements
  BreakStatement = "BreakStatement",
  ContinueStatement = "ContinueStatement",

  // Exception Statements
  ThrowStatement = "ThrowStatement",
  TryStatement = "TryStatement",
  CatchClause = "CatchClause",

  // Type Annotations
  TypeAnnotation = "TypeAnnotation",
  GenericTypeAnnotation = "GenericTypeAnnotation"
}

export const enum TS_NODE_TYPES {}
