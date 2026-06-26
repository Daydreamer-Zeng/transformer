import Tokenizer from "../../src/tokenizer.js";
import Parser from "../../src/parser.js";

describe("Parser", () => {
  describe("Arrow Function", () => {
    it("parse arrow function", () => {
      const input = `const func = async a => "Hello, World!";
const func1 = a => "Hello, World!";
const func2 = async (a) => "Hello, World!";
const func3 = (a) => { return "Hello, World!" };`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 169,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 4,
            "column": 48,
            "index": 169
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 169,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 4,
              "column": 48,
              "index": 169
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "VariableDeclaration",
              "start": 0,
              "end": 40,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 1,
                  "column": 40,
                  "index": 40
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 6,
                  "end": 39,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 6,
                      "index": 6
                    },
                    "end": {
                      "line": 1,
                      "column": 39,
                      "index": 39
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
                      "identifierName": "func"
                    },
                    "name": "func"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 13,
                    "end": 39,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 13,
                        "index": 13
                      },
                      "end": {
                        "line": 1,
                        "column": 39,
                        "index": 39
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 19,
                        "end": 20,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 19,
                            "index": 19
                          },
                          "end": {
                            "line": 1,
                            "column": 20,
                            "index": 20
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      }
                    ],
                    "body": {
                      "type": "StringLiteral",
                      "start": 24,
                      "end": 39,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 24,
                          "index": 24
                        },
                        "end": {
                          "line": 1,
                          "column": 39,
                          "index": 39
                        }
                      },
                      "extra": {
                        "value": "Hello, World!",
                        "raw": "\"Hello, World!\""
                      },
                      "value": "Hello, World!"
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 41,
              "end": 76,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 41
                },
                "end": {
                  "line": 2,
                  "column": 35,
                  "index": 76
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 47,
                  "end": 75,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 6,
                      "index": 47
                    },
                    "end": {
                      "line": 2,
                      "column": 34,
                      "index": 75
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 47,
                    "end": 52,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 6,
                        "index": 47
                      },
                      "end": {
                        "line": 2,
                        "column": 11,
                        "index": 52
                      },
                      "identifierName": "func1"
                    },
                    "name": "func1"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 55,
                    "end": 75,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 14,
                        "index": 55
                      },
                      "end": {
                        "line": 2,
                        "column": 34,
                        "index": 75
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 55,
                        "end": 56,
                        "loc": {
                          "start": {
                            "line": 2,
                            "column": 14,
                            "index": 55
                          },
                          "end": {
                            "line": 2,
                            "column": 15,
                            "index": 56
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      }
                    ],
                    "body": {
                      "type": "StringLiteral",
                      "start": 60,
                      "end": 75,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 19,
                          "index": 60
                        },
                        "end": {
                          "line": 2,
                          "column": 34,
                          "index": 75
                        }
                      },
                      "extra": {
                        "value": "Hello, World!",
                        "raw": "\"Hello, World!\""
                      },
                      "value": "Hello, World!"
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 77,
              "end": 120,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 0,
                  "index": 77
                },
                "end": {
                  "line": 3,
                  "column": 43,
                  "index": 120
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 83,
                  "end": 119,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 6,
                      "index": 83
                    },
                    "end": {
                      "line": 3,
                      "column": 42,
                      "index": 119
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 83,
                    "end": 88,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 6,
                        "index": 83
                      },
                      "end": {
                        "line": 3,
                        "column": 11,
                        "index": 88
                      },
                      "identifierName": "func2"
                    },
                    "name": "func2"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 91,
                    "end": 119,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 14,
                        "index": 91
                      },
                      "end": {
                        "line": 3,
                        "column": 42,
                        "index": 119
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 98,
                        "end": 99,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 21,
                            "index": 98
                          },
                          "end": {
                            "line": 3,
                            "column": 22,
                            "index": 99
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      }
                    ],
                    "body": {
                      "type": "StringLiteral",
                      "start": 104,
                      "end": 119,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 27,
                          "index": 104
                        },
                        "end": {
                          "line": 3,
                          "column": 42,
                          "index": 119
                        }
                      },
                      "extra": {
                        "value": "Hello, World!",
                        "raw": "\"Hello, World!\""
                      },
                      "value": "Hello, World!"
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 121,
              "end": 169,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0,
                  "index": 121
                },
                "end": {
                  "line": 4,
                  "column": 48,
                  "index": 169
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 127,
                  "end": 168,
                  "loc": {
                    "start": {
                      "line": 4,
                      "column": 6,
                      "index": 127
                    },
                    "end": {
                      "line": 4,
                      "column": 47,
                      "index": 168
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 127,
                    "end": 132,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 6,
                        "index": 127
                      },
                      "end": {
                        "line": 4,
                        "column": 11,
                        "index": 132
                      },
                      "identifierName": "func3"
                    },
                    "name": "func3"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 135,
                    "end": 168,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 14,
                        "index": 135
                      },
                      "end": {
                        "line": 4,
                        "column": 47,
                        "index": 168
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 136,
                        "end": 137,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 15,
                            "index": 136
                          },
                          "end": {
                            "line": 4,
                            "column": 16,
                            "index": 137
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 142,
                      "end": 168,
                      "loc": {
                        "start": {
                          "line": 4,
                          "column": 21,
                          "index": 142
                        },
                        "end": {
                          "line": 4,
                          "column": 47,
                          "index": 168
                        }
                      },
                      "body": [
                        {
                          "type": "ReturnStatement",
                          "start": 144,
                          "end": 166,
                          "loc": {
                            "start": {
                              "line": 4,
                              "column": 23,
                              "index": 144
                            },
                            "end": {
                              "line": 4,
                              "column": 45,
                              "index": 166
                            }
                          },
                          "argument": {
                            "type": "StringLiteral",
                            "start": 151,
                            "end": 166,
                            "loc": {
                              "start": {
                                "line": 4,
                                "column": 30,
                                "index": 151
                              },
                              "end": {
                                "line": 4,
                                "column": 45,
                                "index": 166
                              }
                            },
                            "extra": {
                              "value": "Hello, World!",
                              "raw": "\"Hello, World!\""
                            },
                            "value": "Hello, World!"
                          }
                        }
                      ],
                      "directives": []
                    }
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