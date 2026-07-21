import Tokenizer from "../../js/tokenizer.js";
import Parser from "../../js/parser.js";

describe("Parser", () => {
  describe("Async Declaration", () => {
    it("should parse async declaration", () => {
      const input = `async = 1
async function name() {
  const count = 100.00;
};
const async = null;
async () => {
  const value = "Hello, World!";
  console.log(value);
}
const foo1 = async (...args) => {};
const foo2 = async ({x: xx, y}, [a, b]) => {};
const foo3 = async () => await something;
const foo4 = async x => x + 1;
const foo5 = async ([...aaa]) => {};
const obj = {
  foo: async function() {}
};`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 388,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 17,
            "column": 2,
            "index": 388
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 388,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 17,
              "column": 2,
              "index": 388
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "ExpressionStatement",
              "start": 0,
              "end": 9,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 1,
                  "column": 9,
                  "index": 9
                }
              },
              "expression": {
                "type": "AssignmentExpression",
                "start": 0,
                "end": 9,
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 0,
                    "index": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 9,
                    "index": 9
                  }
                },
                "operator": "=",
                "left": {
                  "type": "Identifier",
                  "start": 0,
                  "end": 5,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 0,
                      "index": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 5,
                      "index": 5
                    },
                    "identifierName": "async"
                  },
                  "name": "async"
                },
                "right": {
                  "type": "NumericLiteral",
                  "start": 8,
                  "end": 9,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 8,
                      "index": 8
                    },
                    "end": {
                      "line": 1,
                      "column": 9,
                      "index": 9
                    }
                  },
                  "extra": {
                    "value": 1,
                    "raw": "1"
                  },
                  "value": 1
                }
              }
            },
            {
              "type": "FunctionDeclaration",
              "start": 10,
              "end": 59,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 10
                },
                "end": {
                  "line": 4,
                  "column": 1,
                  "index": 59
                }
              },
              "id": {
                "type": "Identifier",
                "start": 25,
                "end": 29,
                "loc": {
                  "start": {
                    "line": 2,
                    "column": 15,
                    "index": 25
                  },
                  "end": {
                    "line": 2,
                    "column": 19,
                    "index": 29
                  },
                  "identifierName": "name"
                },
                "name": "name"
              },
              "generator": false,
              "async": true,
              "params": [],
              "body": {
                "type": "BlockStatement",
                "start": 32,
                "end": 59,
                "loc": {
                  "start": {
                    "line": 2,
                    "column": 22,
                    "index": 32
                  },
                  "end": {
                    "line": 4,
                    "column": 1,
                    "index": 59
                  }
                },
                "body": [
                  {
                    "type": "VariableDeclaration",
                    "start": 36,
                    "end": 57,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 2,
                        "index": 36
                      },
                      "end": {
                        "line": 3,
                        "column": 23,
                        "index": 57
                      }
                    },
                    "declarations": [
                      {
                        "type": "VariableDeclarator",
                        "start": 42,
                        "end": 56,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 8,
                            "index": 42
                          },
                          "end": {
                            "line": 3,
                            "column": 22,
                            "index": 56
                          }
                        },
                        "id": {
                          "type": "Identifier",
                          "start": 42,
                          "end": 47,
                          "loc": {
                            "start": {
                              "line": 3,
                              "column": 8,
                              "index": 42
                            },
                            "end": {
                              "line": 3,
                              "column": 13,
                              "index": 47
                            },
                            "identifierName": "count"
                          },
                          "name": "count"
                        },
                        "init": {
                          "type": "NumericLiteral",
                          "start": 50,
                          "end": 56,
                          "loc": {
                            "start": {
                              "line": 3,
                              "column": 16,
                              "index": 50
                            },
                            "end": {
                              "line": 3,
                              "column": 22,
                              "index": 56
                            }
                          },
                          "extra": {
                            "value": 100,
                            "raw": "100.00"
                          },
                          "value": 100
                        }
                      }
                    ],
                    "kind": "const"
                  }
                ],
                "directives": []
              }
            },
            {
              "type": "EmptyStatement",
              "start": 59,
              "end": 60,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 1,
                  "index": 59
                },
                "end": {
                  "line": 4,
                  "column": 2,
                  "index": 60
                }
              }
            },
            {
              "type": "VariableDeclaration",
              "start": 61,
              "end": 80,
              "loc": {
                "start": {
                  "line": 5,
                  "column": 0,
                  "index": 61
                },
                "end": {
                  "line": 5,
                  "column": 19,
                  "index": 80
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 67,
                  "end": 79,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 6,
                      "index": 67
                    },
                    "end": {
                      "line": 5,
                      "column": 18,
                      "index": 79
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 67,
                    "end": 72,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 6,
                        "index": 67
                      },
                      "end": {
                        "line": 5,
                        "column": 11,
                        "index": 72
                      },
                      "identifierName": "async"
                    },
                    "name": "async"
                  },
                  "init": {
                    "type": "NullLiteral",
                    "start": 75,
                    "end": 79,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 14,
                        "index": 75
                      },
                      "end": {
                        "line": 5,
                        "column": 18,
                        "index": 79
                      }
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "ExpressionStatement",
              "start": 81,
              "end": 151,
              "loc": {
                "start": {
                  "line": 6,
                  "column": 0,
                  "index": 81
                },
                "end": {
                  "line": 9,
                  "column": 1,
                  "index": 151
                }
              },
              "expression": {
                "type": "ArrowFunctionExpression",
                "start": 81,
                "end": 151,
                "loc": {
                  "start": {
                    "line": 6,
                    "column": 0,
                    "index": 81
                  },
                  "end": {
                    "line": 9,
                    "column": 1,
                    "index": 151
                  }
                },
                "id": null,
                "generator": false,
                "async": true,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "start": 93,
                  "end": 151,
                  "loc": {
                    "start": {
                      "line": 6,
                      "column": 12,
                      "index": 93
                    },
                    "end": {
                      "line": 9,
                      "column": 1,
                      "index": 151
                    }
                  },
                  "body": [
                    {
                      "type": "VariableDeclaration",
                      "start": 97,
                      "end": 127,
                      "loc": {
                        "start": {
                          "line": 7,
                          "column": 2,
                          "index": 97
                        },
                        "end": {
                          "line": 7,
                          "column": 32,
                          "index": 127
                        }
                      },
                      "declarations": [
                        {
                          "type": "VariableDeclarator",
                          "start": 103,
                          "end": 126,
                          "loc": {
                            "start": {
                              "line": 7,
                              "column": 8,
                              "index": 103
                            },
                            "end": {
                              "line": 7,
                              "column": 31,
                              "index": 126
                            }
                          },
                          "id": {
                            "type": "Identifier",
                            "start": 103,
                            "end": 108,
                            "loc": {
                              "start": {
                                "line": 7,
                                "column": 8,
                                "index": 103
                              },
                              "end": {
                                "line": 7,
                                "column": 13,
                                "index": 108
                              },
                              "identifierName": "value"
                            },
                            "name": "value"
                          },
                          "init": {
                            "type": "StringLiteral",
                            "start": 111,
                            "end": 126,
                            "loc": {
                              "start": {
                                "line": 7,
                                "column": 16,
                                "index": 111
                              },
                              "end": {
                                "line": 7,
                                "column": 31,
                                "index": 126
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
                      "kind": "const"
                    },
                    {
                      "type": "ExpressionStatement",
                      "start": 130,
                      "end": 149,
                      "loc": {
                        "start": {
                          "line": 8,
                          "column": 2,
                          "index": 130
                        },
                        "end": {
                          "line": 8,
                          "column": 21,
                          "index": 149
                        }
                      },
                      "expression": {
                        "type": "CallExpression",
                        "start": 130,
                        "end": 148,
                        "loc": {
                          "start": {
                            "line": 8,
                            "column": 2,
                            "index": 130
                          },
                          "end": {
                            "line": 8,
                            "column": 20,
                            "index": 148
                          }
                        },
                        "callee": {
                          "type": "MemberExpression",
                          "start": 130,
                          "end": 141,
                          "loc": {
                            "start": {
                              "line": 8,
                              "column": 2,
                              "index": 130
                            },
                            "end": {
                              "line": 8,
                              "column": 13,
                              "index": 141
                            }
                          },
                          "object": {
                            "type": "Identifier",
                            "start": 130,
                            "end": 137,
                            "loc": {
                              "start": {
                                "line": 8,
                                "column": 2,
                                "index": 130
                              },
                              "end": {
                                "line": 8,
                                "column": 9,
                                "index": 137
                              },
                              "identifierName": "console"
                            },
                            "name": "console"
                          },
                          "computed": false,
                          "property": {
                            "type": "Identifier",
                            "start": 138,
                            "end": 141,
                            "loc": {
                              "start": {
                                "line": 8,
                                "column": 10,
                                "index": 138
                              },
                              "end": {
                                "line": 8,
                                "column": 13,
                                "index": 141
                              },
                              "identifierName": "log"
                            },
                            "name": "log"
                          }
                        },
                        "arguments": [
                          {
                            "type": "Identifier",
                            "start": 142,
                            "end": 147,
                            "loc": {
                              "start": {
                                "line": 8,
                                "column": 14,
                                "index": 142
                              },
                              "end": {
                                "line": 8,
                                "column": 19,
                                "index": 147
                              },
                              "identifierName": "value"
                            },
                            "name": "value"
                          }
                        ]
                      }
                    }
                  ],
                  "directives": []
                }
              }
            },
            {
              "type": "VariableDeclaration",
              "start": 152,
              "end": 187,
              "loc": {
                "start": {
                  "line": 10,
                  "column": 0,
                  "index": 152
                },
                "end": {
                  "line": 10,
                  "column": 35,
                  "index": 187
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 158,
                  "end": 186,
                  "loc": {
                    "start": {
                      "line": 10,
                      "column": 6,
                      "index": 158
                    },
                    "end": {
                      "line": 10,
                      "column": 34,
                      "index": 186
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 158,
                    "end": 162,
                    "loc": {
                      "start": {
                        "line": 10,
                        "column": 6,
                        "index": 158
                      },
                      "end": {
                        "line": 10,
                        "column": 10,
                        "index": 162
                      },
                      "identifierName": "foo1"
                    },
                    "name": "foo1"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 165,
                    "end": 186,
                    "loc": {
                      "start": {
                        "line": 10,
                        "column": 13,
                        "index": 165
                      },
                      "end": {
                        "line": 10,
                        "column": 34,
                        "index": 186
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "RestElement",
                        "start": 172,
                        "end": 179,
                        "loc": {
                          "start": {
                            "line": 10,
                            "column": 20,
                            "index": 172
                          },
                          "end": {
                            "line": 10,
                            "column": 27,
                            "index": 179
                          }
                        },
                        "argument": {
                          "type": "Identifier",
                          "start": 175,
                          "end": 179,
                          "loc": {
                            "start": {
                              "line": 10,
                              "column": 23,
                              "index": 175
                            },
                            "end": {
                              "line": 10,
                              "column": 27,
                              "index": 179
                            },
                            "identifierName": "args"
                          },
                          "name": "args"
                        }
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 184,
                      "end": 186,
                      "loc": {
                        "start": {
                          "line": 10,
                          "column": 32,
                          "index": 184
                        },
                        "end": {
                          "line": 10,
                          "column": 34,
                          "index": 186
                        }
                      },
                      "body": [],
                      "directives": []
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 188,
              "end": 234,
              "loc": {
                "start": {
                  "line": 11,
                  "column": 0,
                  "index": 188
                },
                "end": {
                  "line": 11,
                  "column": 46,
                  "index": 234
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 194,
                  "end": 233,
                  "loc": {
                    "start": {
                      "line": 11,
                      "column": 6,
                      "index": 194
                    },
                    "end": {
                      "line": 11,
                      "column": 45,
                      "index": 233
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 194,
                    "end": 198,
                    "loc": {
                      "start": {
                        "line": 11,
                        "column": 6,
                        "index": 194
                      },
                      "end": {
                        "line": 11,
                        "column": 10,
                        "index": 198
                      },
                      "identifierName": "foo2"
                    },
                    "name": "foo2"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 201,
                    "end": 233,
                    "loc": {
                      "start": {
                        "line": 11,
                        "column": 13,
                        "index": 201
                      },
                      "end": {
                        "line": 11,
                        "column": 45,
                        "index": 233
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "ObjectPattern",
                        "start": 208,
                        "end": 218,
                        "loc": {
                          "start": {
                            "line": 11,
                            "column": 20,
                            "index": 208
                          },
                          "end": {
                            "line": 11,
                            "column": 30,
                            "index": 218
                          }
                        },
                        "properties": [
                          {
                            "type": "ObjectProperty",
                            "start": 209,
                            "end": 214,
                            "loc": {
                              "start": {
                                "line": 11,
                                "column": 21,
                                "index": 209
                              },
                              "end": {
                                "line": 11,
                                "column": 26,
                                "index": 214
                              }
                            },
                            "method": false,
                            "key": {
                              "type": "Identifier",
                              "start": 209,
                              "end": 210,
                              "loc": {
                                "start": {
                                  "line": 11,
                                  "column": 21,
                                  "index": 209
                                },
                                "end": {
                                  "line": 11,
                                  "column": 22,
                                  "index": 210
                                },
                                "identifierName": "x"
                              },
                              "name": "x"
                            },
                            "computed": false,
                            "shorthand": false,
                            "value": {
                              "type": "Identifier",
                              "start": 212,
                              "end": 214,
                              "loc": {
                                "start": {
                                  "line": 11,
                                  "column": 24,
                                  "index": 212
                                },
                                "end": {
                                  "line": 11,
                                  "column": 26,
                                  "index": 214
                                },
                                "identifierName": "xx"
                              },
                              "name": "xx"
                            }
                          },
                          {
                            "type": "ObjectProperty",
                            "start": 216,
                            "end": 217,
                            "loc": {
                              "start": {
                                "line": 11,
                                "column": 28,
                                "index": 216
                              },
                              "end": {
                                "line": 11,
                                "column": 29,
                                "index": 217
                              }
                            },
                            "method": false,
                            "key": {
                              "type": "Identifier",
                              "start": 216,
                              "end": 217,
                              "loc": {
                                "start": {
                                  "line": 11,
                                  "column": 28,
                                  "index": 216
                                },
                                "end": {
                                  "line": 11,
                                  "column": 29,
                                  "index": 217
                                },
                                "identifierName": "y"
                              },
                              "name": "y"
                            },
                            "computed": false,
                            "shorthand": true,
                            "value": {
                              "type": "Identifier",
                              "start": 216,
                              "end": 217,
                              "loc": {
                                "start": {
                                  "line": 11,
                                  "column": 28,
                                  "index": 216
                                },
                                "end": {
                                  "line": 11,
                                  "column": 29,
                                  "index": 217
                                },
                                "identifierName": "y"
                              },
                              "name": "y"
                            },
                            "extra": {
                              "shorthand": true
                            }
                          }
                        ]
                      },
                      {
                        "type": "ArrayPattern",
                        "start": 220,
                        "end": 226,
                        "loc": {
                          "start": {
                            "line": 11,
                            "column": 32,
                            "index": 220
                          },
                          "end": {
                            "line": 11,
                            "column": 38,
                            "index": 226
                          }
                        },
                        "elements": [
                          {
                            "type": "Identifier",
                            "start": 221,
                            "end": 222,
                            "loc": {
                              "start": {
                                "line": 11,
                                "column": 33,
                                "index": 221
                              },
                              "end": {
                                "line": 11,
                                "column": 34,
                                "index": 222
                              },
                              "identifierName": "a"
                            },
                            "name": "a"
                          },
                          {
                            "type": "Identifier",
                            "start": 224,
                            "end": 225,
                            "loc": {
                              "start": {
                                "line": 11,
                                "column": 36,
                                "index": 224
                              },
                              "end": {
                                "line": 11,
                                "column": 37,
                                "index": 225
                              },
                              "identifierName": "b"
                            },
                            "name": "b"
                          }
                        ]
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 231,
                      "end": 233,
                      "loc": {
                        "start": {
                          "line": 11,
                          "column": 43,
                          "index": 231
                        },
                        "end": {
                          "line": 11,
                          "column": 45,
                          "index": 233
                        }
                      },
                      "body": [],
                      "directives": []
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 235,
              "end": 276,
              "loc": {
                "start": {
                  "line": 12,
                  "column": 0,
                  "index": 235
                },
                "end": {
                  "line": 12,
                  "column": 41,
                  "index": 276
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 241,
                  "end": 275,
                  "loc": {
                    "start": {
                      "line": 12,
                      "column": 6,
                      "index": 241
                    },
                    "end": {
                      "line": 12,
                      "column": 40,
                      "index": 275
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 241,
                    "end": 245,
                    "loc": {
                      "start": {
                        "line": 12,
                        "column": 6,
                        "index": 241
                      },
                      "end": {
                        "line": 12,
                        "column": 10,
                        "index": 245
                      },
                      "identifierName": "foo3"
                    },
                    "name": "foo3"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 248,
                    "end": 275,
                    "loc": {
                      "start": {
                        "line": 12,
                        "column": 13,
                        "index": 248
                      },
                      "end": {
                        "line": 12,
                        "column": 40,
                        "index": 275
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [],
                    "body": {
                      "type": "AwaitExpression",
                      "start": 260,
                      "end": 275,
                      "loc": {
                        "start": {
                          "line": 12,
                          "column": 25,
                          "index": 260
                        },
                        "end": {
                          "line": 12,
                          "column": 40,
                          "index": 275
                        }
                      },
                      "argument": {
                        "type": "Identifier",
                        "start": 266,
                        "end": 275,
                        "loc": {
                          "start": {
                            "line": 12,
                            "column": 31,
                            "index": 266
                          },
                          "end": {
                            "line": 12,
                            "column": 40,
                            "index": 275
                          },
                          "identifierName": "something"
                        },
                        "name": "something"
                      }
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 277,
              "end": 307,
              "loc": {
                "start": {
                  "line": 13,
                  "column": 0,
                  "index": 277
                },
                "end": {
                  "line": 13,
                  "column": 30,
                  "index": 307
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 283,
                  "end": 306,
                  "loc": {
                    "start": {
                      "line": 13,
                      "column": 6,
                      "index": 283
                    },
                    "end": {
                      "line": 13,
                      "column": 29,
                      "index": 306
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 283,
                    "end": 287,
                    "loc": {
                      "start": {
                        "line": 13,
                        "column": 6,
                        "index": 283
                      },
                      "end": {
                        "line": 13,
                        "column": 10,
                        "index": 287
                      },
                      "identifierName": "foo4"
                    },
                    "name": "foo4"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 290,
                    "end": 306,
                    "loc": {
                      "start": {
                        "line": 13,
                        "column": 13,
                        "index": 290
                      },
                      "end": {
                        "line": 13,
                        "column": 29,
                        "index": 306
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 296,
                        "end": 297,
                        "loc": {
                          "start": {
                            "line": 13,
                            "column": 19,
                            "index": 296
                          },
                          "end": {
                            "line": 13,
                            "column": 20,
                            "index": 297
                          },
                          "identifierName": "x"
                        },
                        "name": "x"
                      }
                    ],
                    "body": {
                      "type": "BinaryExpression",
                      "start": 301,
                      "end": 306,
                      "loc": {
                        "start": {
                          "line": 13,
                          "column": 24,
                          "index": 301
                        },
                        "end": {
                          "line": 13,
                          "column": 29,
                          "index": 306
                        }
                      },
                      "left": {
                        "type": "Identifier",
                        "start": 301,
                        "end": 302,
                        "loc": {
                          "start": {
                            "line": 13,
                            "column": 24,
                            "index": 301
                          },
                          "end": {
                            "line": 13,
                            "column": 25,
                            "index": 302
                          },
                          "identifierName": "x"
                        },
                        "name": "x"
                      },
                      "operator": "+",
                      "right": {
                        "type": "NumericLiteral",
                        "start": 305,
                        "end": 306,
                        "loc": {
                          "start": {
                            "line": 13,
                            "column": 28,
                            "index": 305
                          },
                          "end": {
                            "line": 13,
                            "column": 29,
                            "index": 306
                          }
                        },
                        "extra": {
                          "value": 1,
                          "raw": "1"
                        },
                        "value": 1
                      }
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 308,
              "end": 344,
              "loc": {
                "start": {
                  "line": 14,
                  "column": 0,
                  "index": 308
                },
                "end": {
                  "line": 14,
                  "column": 36,
                  "index": 344
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 314,
                  "end": 343,
                  "loc": {
                    "start": {
                      "line": 14,
                      "column": 6,
                      "index": 314
                    },
                    "end": {
                      "line": 14,
                      "column": 35,
                      "index": 343
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 314,
                    "end": 318,
                    "loc": {
                      "start": {
                        "line": 14,
                        "column": 6,
                        "index": 314
                      },
                      "end": {
                        "line": 14,
                        "column": 10,
                        "index": 318
                      },
                      "identifierName": "foo5"
                    },
                    "name": "foo5"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 321,
                    "end": 343,
                    "loc": {
                      "start": {
                        "line": 14,
                        "column": 13,
                        "index": 321
                      },
                      "end": {
                        "line": 14,
                        "column": 35,
                        "index": 343
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "ArrayPattern",
                        "start": 328,
                        "end": 336,
                        "loc": {
                          "start": {
                            "line": 14,
                            "column": 20,
                            "index": 328
                          },
                          "end": {
                            "line": 14,
                            "column": 28,
                            "index": 336
                          }
                        },
                        "elements": [
                          {
                            "type": "RestElement",
                            "start": 329,
                            "end": 335,
                            "loc": {
                              "start": {
                                "line": 14,
                                "column": 21,
                                "index": 329
                              },
                              "end": {
                                "line": 14,
                                "column": 27,
                                "index": 335
                              }
                            },
                            "argument": {
                              "type": "Identifier",
                              "start": 332,
                              "end": 335,
                              "loc": {
                                "start": {
                                  "line": 14,
                                  "column": 24,
                                  "index": 332
                                },
                                "end": {
                                  "line": 14,
                                  "column": 27,
                                  "index": 335
                                },
                                "identifierName": "aaa"
                              },
                              "name": "aaa"
                            }
                          }
                        ]
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 341,
                      "end": 343,
                      "loc": {
                        "start": {
                          "line": 14,
                          "column": 33,
                          "index": 341
                        },
                        "end": {
                          "line": 14,
                          "column": 35,
                          "index": 343
                        }
                      },
                      "body": [],
                      "directives": []
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 345,
              "end": 388,
              "loc": {
                "start": {
                  "line": 15,
                  "column": 0,
                  "index": 345
                },
                "end": {
                  "line": 17,
                  "column": 2,
                  "index": 388
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 351,
                  "end": 387,
                  "loc": {
                    "start": {
                      "line": 15,
                      "column": 6,
                      "index": 351
                    },
                    "end": {
                      "line": 17,
                      "column": 1,
                      "index": 387
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 351,
                    "end": 354,
                    "loc": {
                      "start": {
                        "line": 15,
                        "column": 6,
                        "index": 351
                      },
                      "end": {
                        "line": 15,
                        "column": 9,
                        "index": 354
                      },
                      "identifierName": "obj"
                    },
                    "name": "obj"
                  },
                  "init": {
                    "type": "ObjectExpression",
                    "start": 357,
                    "end": 387,
                    "loc": {
                      "start": {
                        "line": 15,
                        "column": 12,
                        "index": 357
                      },
                      "end": {
                        "line": 17,
                        "column": 1,
                        "index": 387
                      }
                    },
                    "properties": [
                      {
                        "type": "ObjectProperty",
                        "start": 361,
                        "end": 385,
                        "loc": {
                          "start": {
                            "line": 16,
                            "column": 2,
                            "index": 361
                          },
                          "end": {
                            "line": 16,
                            "column": 26,
                            "index": 385
                          }
                        },
                        "method": false,
                        "key": {
                          "type": "Identifier",
                          "start": 361,
                          "end": 364,
                          "loc": {
                            "start": {
                              "line": 16,
                              "column": 2,
                              "index": 361
                            },
                            "end": {
                              "line": 16,
                              "column": 5,
                              "index": 364
                            },
                            "identifierName": "foo"
                          },
                          "name": "foo"
                        },
                        "computed": false,
                        "shorthand": false,
                        "value": {
                          "type": "FunctionExpression",
                          "start": 366,
                          "end": 385,
                          "loc": {
                            "start": {
                              "line": 16,
                              "column": 7,
                              "index": 366
                            },
                            "end": {
                              "line": 16,
                              "column": 26,
                              "index": 385
                            }
                          },
                          "id": null,
                          "generator": false,
                          "async": true,
                          "params": [],
                          "body": {
                            "type": "BlockStatement",
                            "start": 383,
                            "end": 385,
                            "loc": {
                              "start": {
                                "line": 16,
                                "column": 24,
                                "index": 383
                              },
                              "end": {
                                "line": 16,
                                "column": 26,
                                "index": 385
                              }
                            },
                            "body": [],
                            "directives": []
                          }
                        }
                      }
                    ]
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