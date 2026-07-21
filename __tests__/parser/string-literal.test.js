import Tokenizer from "../../js/tokenizer.js";
import Parser from "../../js/parser.js";

describe("Parser", () => {
  describe("String Literal", () => {
    it("should parse a simple string literal", () => {
      const input = `const str1 = "string";
const str2 = 'hello';
const str3 = "line\\nbreak";`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
  "type": "File",
  "start": 0,
  "end": 72,
  "loc": {
    "start": {
      "line": 1,
      "column": 0,
      "index": 0
    },
    "end": {
      "line": 3,
      "column": 27,
      "index": 72
    }
  },
  "errors": [],
  "program": {
    "type": "Program",
    "start": 0,
    "end": 72,
    "loc": {
      "start": {
        "line": 1,
        "column": 0,
        "index": 0
      },
      "end": {
        "line": 3,
        "column": 27,
        "index": 72
      }
    },
    "sourceType": "module",
    "interpreter": null,
    "body": [
      {
        "type": "VariableDeclaration",
        "start": 0,
        "end": 22,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 1,
            "column": 22,
            "index": 22
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 6,
            "end": 21,
            "loc": {
              "start": {
                "line": 1,
                "column": 6,
                "index": 6
              },
              "end": {
                "line": 1,
                "column": 21,
                "index": 21
              }
            },
            "id": {
              "type": "Identifier",
              "start": 6,
              "end": 10,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 6,
                  "index": 6
                },
                "end": {
                  "line": 1,
                  "column": 10,
                  "index": 10
                },
                "identifierName": "str1"
              },
              "name": "str1"
            },
            "init": {
              "type": "StringLiteral",
              "start": 13,
              "end": 21,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 13,
                  "index": 13
                },
                "end": {
                  "line": 1,
                  "column": 21,
                  "index": 21
                }
              },
              "extra": {
                "value": "string",
                "raw": "\"string\""
              },
              "value": "string"
            }
          }
        ],
        "kind": "const"
      },
      {
        "type": "VariableDeclaration",
        "start": 23,
        "end": 44,
        "loc": {
          "start": {
            "line": 2,
            "column": 0,
            "index": 23
          },
          "end": {
            "line": 2,
            "column": 21,
            "index": 44
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 29,
            "end": 43,
            "loc": {
              "start": {
                "line": 2,
                "column": 6,
                "index": 29
              },
              "end": {
                "line": 2,
                "column": 20,
                "index": 43
              }
            },
            "id": {
              "type": "Identifier",
              "start": 29,
              "end": 33,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 6,
                  "index": 29
                },
                "end": {
                  "line": 2,
                  "column": 10,
                  "index": 33
                },
                "identifierName": "str2"
              },
              "name": "str2"
            },
            "init": {
              "type": "StringLiteral",
              "start": 36,
              "end": 43,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 13,
                  "index": 36
                },
                "end": {
                  "line": 2,
                  "column": 20,
                  "index": 43
                }
              },
              "extra": {
                "value": "hello",
                "raw": "'hello'"
              },
              "value": "hello"
            }
          }
        ],
        "kind": "const"
      },
      {
        "type": "VariableDeclaration",
        "start": 45,
        "end": 72,
        "loc": {
          "start": {
            "line": 3,
            "column": 0,
            "index": 45
          },
          "end": {
            "line": 3,
            "column": 27,
            "index": 72
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 51,
            "end": 71,
            "loc": {
              "start": {
                "line": 3,
                "column": 6,
                "index": 51
              },
              "end": {
                "line": 3,
                "column": 26,
                "index": 71
              }
            },
            "id": {
              "type": "Identifier",
              "start": 51,
              "end": 55,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 6,
                  "index": 51
                },
                "end": {
                  "line": 3,
                  "column": 10,
                  "index": 55
                },
                "identifierName": "str3"
              },
              "name": "str3"
            },
            "init": {
              "type": "StringLiteral",
              "start": 58,
              "end": 71,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 13,
                  "index": 58
                },
                "end": {
                  "line": 3,
                  "column": 26,
                  "index": 71
                }
              },
              "extra": {
                "value": "line\nbreak",
                "raw": "\"line\\nbreak\""
              },
              "value": "line\nbreak"
            }
          }
        ],
        "kind": "const"
      }
    ],
    "directives": []
  },
  "comments": []
}
      const result = new Parser({ sourceType: "module" }).parse(tokens);

      expect(result).toEqual(expected);
    });
  });
});
