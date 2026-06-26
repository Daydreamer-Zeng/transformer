import Tokenizer from "../../src/tokenizer.js";
import Parser from "../../src/parser.js";

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
const foo2 = async ({x, y}) => {};
const foo4 = async x => x + 1;
const obj = {
  foo: async function() {}
};`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 297,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 15,
            "column": 2,
            "index": 297
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 297,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 15,
              "column": 2,
              "index": 297
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
              "end": 222,
              "loc": {
                "start": {
                  "line": 11,
                  "column": 0,
                  "index": 188
                },
                "end": {
                  "line": 11,
                  "column": 34,
                  "index": 222
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 194,
                  "end": 221,
                  "loc": {
                    "start": {
                      "line": 11,
                      "column": 6,
                      "index": 194
                    },
                    "end": {
                      "line": 11,
                      "column": 33,
                      "index": 221
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
                    "end": 221,
                    "loc": {
                      "start": {
                        "line": 11,
                        "column": 13,
                        "index": 201
                      },
                      "end": {
                        "line": 11,
                        "column": 33,
                        "index": 221
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "ObjectPattern",
                        "start": 208,
                        "end": 214,
                        "loc": {
                          "start": {
                            "line": 11,
                            "column": 20,
                            "index": 208
                          },
                          "end": {
                            "line": 11,
                            "column": 26,
                            "index": 214
                          }
                        },
                        "properties": [
                          {
                            "type": "ObjectProperty",
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
                            "shorthand": true,
                            "value": {
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
                            "extra": {
                              "shorthand": true
                            }
                          },
                          {
                            "type": "ObjectProperty",
                            "start": 212,
                            "end": 213,
                            "loc": {
                              "start": {
                                "line": 11,
                                "column": 24,
                                "index": 212
                              },
                              "end": {
                                "line": 11,
                                "column": 25,
                                "index": 213
                              }
                            },
                            "method": false,
                            "key": {
                              "type": "Identifier",
                              "start": 212,
                              "end": 213,
                              "loc": {
                                "start": {
                                  "line": 11,
                                  "column": 24,
                                  "index": 212
                                },
                                "end": {
                                  "line": 11,
                                  "column": 25,
                                  "index": 213
                                },
                                "identifierName": "y"
                              },
                              "name": "y"
                            },
                            "computed": false,
                            "shorthand": true,
                            "value": {
                              "type": "Identifier",
                              "start": 212,
                              "end": 213,
                              "loc": {
                                "start": {
                                  "line": 11,
                                  "column": 24,
                                  "index": 212
                                },
                                "end": {
                                  "line": 11,
                                  "column": 25,
                                  "index": 213
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
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 219,
                      "end": 221,
                      "loc": {
                        "start": {
                          "line": 11,
                          "column": 31,
                          "index": 219
                        },
                        "end": {
                          "line": 11,
                          "column": 33,
                          "index": 221
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
              "start": 223,
              "end": 253,
              "loc": {
                "start": {
                  "line": 12,
                  "column": 0,
                  "index": 223
                },
                "end": {
                  "line": 12,
                  "column": 30,
                  "index": 253
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 229,
                  "end": 252,
                  "loc": {
                    "start": {
                      "line": 12,
                      "column": 6,
                      "index": 229
                    },
                    "end": {
                      "line": 12,
                      "column": 29,
                      "index": 252
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 229,
                    "end": 233,
                    "loc": {
                      "start": {
                        "line": 12,
                        "column": 6,
                        "index": 229
                      },
                      "end": {
                        "line": 12,
                        "column": 10,
                        "index": 233
                      },
                      "identifierName": "foo4"
                    },
                    "name": "foo4"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 236,
                    "end": 252,
                    "loc": {
                      "start": {
                        "line": 12,
                        "column": 13,
                        "index": 236
                      },
                      "end": {
                        "line": 12,
                        "column": 29,
                        "index": 252
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 242,
                        "end": 243,
                        "loc": {
                          "start": {
                            "line": 12,
                            "column": 19,
                            "index": 242
                          },
                          "end": {
                            "line": 12,
                            "column": 20,
                            "index": 243
                          },
                          "identifierName": "x"
                        },
                        "name": "x"
                      }
                    ],
                    "body": {
                      "type": "BinaryExpression",
                      "start": 247,
                      "end": 252,
                      "loc": {
                        "start": {
                          "line": 12,
                          "column": 24,
                          "index": 247
                        },
                        "end": {
                          "line": 12,
                          "column": 29,
                          "index": 252
                        }
                      },
                      "left": {
                        "type": "Identifier",
                        "start": 247,
                        "end": 248,
                        "loc": {
                          "start": {
                            "line": 12,
                            "column": 24,
                            "index": 247
                          },
                          "end": {
                            "line": 12,
                            "column": 25,
                            "index": 248
                          },
                          "identifierName": "x"
                        },
                        "name": "x"
                      },
                      "operator": "+",
                      "right": {
                        "type": "NumericLiteral",
                        "start": 251,
                        "end": 252,
                        "loc": {
                          "start": {
                            "line": 12,
                            "column": 28,
                            "index": 251
                          },
                          "end": {
                            "line": 12,
                            "column": 29,
                            "index": 252
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
              "start": 254,
              "end": 297,
              "loc": {
                "start": {
                  "line": 13,
                  "column": 0,
                  "index": 254
                },
                "end": {
                  "line": 15,
                  "column": 2,
                  "index": 297
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 260,
                  "end": 296,
                  "loc": {
                    "start": {
                      "line": 13,
                      "column": 6,
                      "index": 260
                    },
                    "end": {
                      "line": 15,
                      "column": 1,
                      "index": 296
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 260,
                    "end": 263,
                    "loc": {
                      "start": {
                        "line": 13,
                        "column": 6,
                        "index": 260
                      },
                      "end": {
                        "line": 13,
                        "column": 9,
                        "index": 263
                      },
                      "identifierName": "obj"
                    },
                    "name": "obj"
                  },
                  "init": {
                    "type": "ObjectExpression",
                    "start": 266,
                    "end": 296,
                    "loc": {
                      "start": {
                        "line": 13,
                        "column": 12,
                        "index": 266
                      },
                      "end": {
                        "line": 15,
                        "column": 1,
                        "index": 296
                      }
                    },
                    "properties": [
                      {
                        "type": "ObjectProperty",
                        "start": 270,
                        "end": 294,
                        "loc": {
                          "start": {
                            "line": 14,
                            "column": 2,
                            "index": 270
                          },
                          "end": {
                            "line": 14,
                            "column": 26,
                            "index": 294
                          }
                        },
                        "method": false,
                        "key": {
                          "type": "Identifier",
                          "start": 270,
                          "end": 273,
                          "loc": {
                            "start": {
                              "line": 14,
                              "column": 2,
                              "index": 270
                            },
                            "end": {
                              "line": 14,
                              "column": 5,
                              "index": 273
                            },
                            "identifierName": "foo"
                          },
                          "name": "foo"
                        },
                        "computed": false,
                        "shorthand": false,
                        "value": {
                          "type": "FunctionExpression",
                          "start": 275,
                          "end": 294,
                          "loc": {
                            "start": {
                              "line": 14,
                              "column": 7,
                              "index": 275
                            },
                            "end": {
                              "line": 14,
                              "column": 26,
                              "index": 294
                            }
                          },
                          "id": null,
                          "generator": false,
                          "async": true,
                          "params": [],
                          "body": {
                            "type": "BlockStatement",
                            "start": 292,
                            "end": 294,
                            "loc": {
                              "start": {
                                "line": 14,
                                "column": 24,
                                "index": 292
                              },
                              "end": {
                                "line": 14,
                                "column": 26,
                                "index": 294
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