import Tokenizer from "../../js/tokenizer.js";
import Parser from "../../js/parser.js";

describe("Parser", () => {
  describe("Regular Expression Literal", () => {
    it("should parse a simple regular expression literal", () => {
      const input = `const test1 = /(a)(\\1(b\\2))/;
const test2 = /[]/;
const test3 = /a{2147483648}/;
const test4 = /(?=(a))\\1/;
const test5 = /^[\\w.-]+@[\\w-]+\\.[a-zA-Z]{2,}$/;
const test6 = /^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$/;
const test7 = /<\\/?([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>/g;
const test8 = /\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])/`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 340,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 8,
            "column": 63,
            "index": 340
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 340,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 8,
              "column": 63,
              "index": 340
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "VariableDeclaration",
              "start": 0,
              "end": 29,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 1,
                  "column": 29,
                  "index": 29
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 6,
                  "end": 28,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 6,
                      "index": 6
                    },
                    "end": {
                      "line": 1,
                      "column": 28,
                      "index": 28
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 6,
                    "end": 11,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 6,
                        "index": 6
                      },
                      "end": {
                        "line": 1,
                        "column": 11,
                        "index": 11
                      },
                      "identifierName": "test1"
                    },
                    "name": "test1"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 14,
                    "end": 28,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 14,
                        "index": 14
                      },
                      "end": {
                        "line": 1,
                        "column": 28,
                        "index": 28
                      }
                    },
                    "extra": {
                      "raw": "/(a)(\\1(b\\2))/"
                    },
                    "pattern": "(a)(\\1(b\\2))",
                    "flags": ""
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 30,
              "end": 49,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 30
                },
                "end": {
                  "line": 2,
                  "column": 19,
                  "index": 49
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 36,
                  "end": 48,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 6,
                      "index": 36
                    },
                    "end": {
                      "line": 2,
                      "column": 18,
                      "index": 48
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 36,
                    "end": 41,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 6,
                        "index": 36
                      },
                      "end": {
                        "line": 2,
                        "column": 11,
                        "index": 41
                      },
                      "identifierName": "test2"
                    },
                    "name": "test2"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 44,
                    "end": 48,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 14,
                        "index": 44
                      },
                      "end": {
                        "line": 2,
                        "column": 18,
                        "index": 48
                      }
                    },
                    "extra": {
                      "raw": "/[]/"
                    },
                    "pattern": "[]",
                    "flags": ""
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 50,
              "end": 80,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 0,
                  "index": 50
                },
                "end": {
                  "line": 3,
                  "column": 30,
                  "index": 80
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 56,
                  "end": 79,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 6,
                      "index": 56
                    },
                    "end": {
                      "line": 3,
                      "column": 29,
                      "index": 79
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 56,
                    "end": 61,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 6,
                        "index": 56
                      },
                      "end": {
                        "line": 3,
                        "column": 11,
                        "index": 61
                      },
                      "identifierName": "test3"
                    },
                    "name": "test3"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 64,
                    "end": 79,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 14,
                        "index": 64
                      },
                      "end": {
                        "line": 3,
                        "column": 29,
                        "index": 79
                      }
                    },
                    "extra": {
                      "raw": "/a{2147483648}/"
                    },
                    "pattern": "a{2147483648}",
                    "flags": ""
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 81,
              "end": 107,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0,
                  "index": 81
                },
                "end": {
                  "line": 4,
                  "column": 26,
                  "index": 107
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 87,
                  "end": 106,
                  "loc": {
                    "start": {
                      "line": 4,
                      "column": 6,
                      "index": 87
                    },
                    "end": {
                      "line": 4,
                      "column": 25,
                      "index": 106
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 87,
                    "end": 92,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 6,
                        "index": 87
                      },
                      "end": {
                        "line": 4,
                        "column": 11,
                        "index": 92
                      },
                      "identifierName": "test4"
                    },
                    "name": "test4"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 95,
                    "end": 106,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 14,
                        "index": 95
                      },
                      "end": {
                        "line": 4,
                        "column": 25,
                        "index": 106
                      }
                    },
                    "extra": {
                      "raw": "/(?=(a))\\1/"
                    },
                    "pattern": "(?=(a))\\1",
                    "flags": ""
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 108,
              "end": 155,
              "loc": {
                "start": {
                  "line": 5,
                  "column": 0,
                  "index": 108
                },
                "end": {
                  "line": 5,
                  "column": 47,
                  "index": 155
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 114,
                  "end": 154,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 6,
                      "index": 114
                    },
                    "end": {
                      "line": 5,
                      "column": 46,
                      "index": 154
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 114,
                    "end": 119,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 6,
                        "index": 114
                      },
                      "end": {
                        "line": 5,
                        "column": 11,
                        "index": 119
                      },
                      "identifierName": "test5"
                    },
                    "name": "test5"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 122,
                    "end": 154,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 14,
                        "index": 122
                      },
                      "end": {
                        "line": 5,
                        "column": 46,
                        "index": 154
                      }
                    },
                    "extra": {
                      "raw": "/^[\\w.-]+@[\\w-]+\\.[a-zA-Z]{2,}$/"
                    },
                    "pattern": "^[\\w.-]+@[\\w-]+\\.[a-zA-Z]{2,}$",
                    "flags": ""
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 156,
              "end": 223,
              "loc": {
                "start": {
                  "line": 6,
                  "column": 0,
                  "index": 156
                },
                "end": {
                  "line": 6,
                  "column": 67,
                  "index": 223
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 162,
                  "end": 222,
                  "loc": {
                    "start": {
                      "line": 6,
                      "column": 6,
                      "index": 162
                    },
                    "end": {
                      "line": 6,
                      "column": 66,
                      "index": 222
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 162,
                    "end": 167,
                    "loc": {
                      "start": {
                        "line": 6,
                        "column": 6,
                        "index": 162
                      },
                      "end": {
                        "line": 6,
                        "column": 11,
                        "index": 167
                      },
                      "identifierName": "test6"
                    },
                    "name": "test6"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 170,
                    "end": 222,
                    "loc": {
                      "start": {
                        "line": 6,
                        "column": 14,
                        "index": 170
                      },
                      "end": {
                        "line": 6,
                        "column": 66,
                        "index": 222
                      }
                    },
                    "extra": {
                      "raw": "/^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$/"
                    },
                    "pattern": "^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$",
                    "flags": ""
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 224,
              "end": 276,
              "loc": {
                "start": {
                  "line": 7,
                  "column": 0,
                  "index": 224
                },
                "end": {
                  "line": 7,
                  "column": 52,
                  "index": 276
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 230,
                  "end": 275,
                  "loc": {
                    "start": {
                      "line": 7,
                      "column": 6,
                      "index": 230
                    },
                    "end": {
                      "line": 7,
                      "column": 51,
                      "index": 275
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 230,
                    "end": 235,
                    "loc": {
                      "start": {
                        "line": 7,
                        "column": 6,
                        "index": 230
                      },
                      "end": {
                        "line": 7,
                        "column": 11,
                        "index": 235
                      },
                      "identifierName": "test7"
                    },
                    "name": "test7"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 238,
                    "end": 275,
                    "loc": {
                      "start": {
                        "line": 7,
                        "column": 14,
                        "index": 238
                      },
                      "end": {
                        "line": 7,
                        "column": 51,
                        "index": 275
                      }
                    },
                    "extra": {
                      "raw": "/<\\/?([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>/g"
                    },
                    "pattern": "<\\/?([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>",
                    "flags": "g"
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 277,
              "end": 340,
              "loc": {
                "start": {
                  "line": 8,
                  "column": 0,
                  "index": 277
                },
                "end": {
                  "line": 8,
                  "column": 63,
                  "index": 340
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 283,
                  "end": 340,
                  "loc": {
                    "start": {
                      "line": 8,
                      "column": 6,
                      "index": 283
                    },
                    "end": {
                      "line": 8,
                      "column": 63,
                      "index": 340
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 283,
                    "end": 288,
                    "loc": {
                      "start": {
                        "line": 8,
                        "column": 6,
                        "index": 283
                      },
                      "end": {
                        "line": 8,
                        "column": 11,
                        "index": 288
                      },
                      "identifierName": "test8"
                    },
                    "name": "test8"
                  },
                  "init": {
                    "type": "RegExpLiteral",
                    "start": 291,
                    "end": 340,
                    "loc": {
                      "start": {
                        "line": 8,
                        "column": 14,
                        "index": 291
                      },
                      "end": {
                        "line": 8,
                        "column": 63,
                        "index": 340
                      }
                    },
                    "extra": {
                      "raw": "/\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])/"
                    },
                    "pattern": "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
                    "flags": ""
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
