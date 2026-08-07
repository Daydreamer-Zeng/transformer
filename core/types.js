export const TOKEN_TYPES = {
  // Literals
  NullLiteral: "NullLiteral",
  BooleanLiteral: "BooleanLiteral",
  NumericLiteral: "NumericLiteral",
  BigIntLiteral: "BigIntLiteral",
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
};
