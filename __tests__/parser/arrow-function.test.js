import Tokenizer from "../../src/tokenizer.js";
import Parser from "../../src/parser.js";

describe("Parser", () => {
  describe("Arrow Function", () => {
    it("parse arrow function", () => {
      const input = `const func = async a => "Hello, World!";
const func1 = a => "Hello, World!";
const func2 = async (a) => "Hello, World!";
const func3 = (a) => { return "Hello, World!" };
const func4 = () => {
  console.log("arrow function"); 
};
const func5 = async => {
  console.log("arrow function"); 
};`;
      const tokens = new Tokenizer().tokenize(input);

      const expected ={
        "type": "File",
        "start": 0,
        "end": 290,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 10,
            "column": 2,
            "index": 290
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 290,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 10,
              "column": 2,
              "index": 290
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
            },
            {
              "type": "VariableDeclaration",
              "start": 170,
              "end": 228,
              "loc": {
                "start": {
                  "line": 5,
                  "column": 0,
                  "index": 170
                },
                "end": {
                  "line": 7,
                  "column": 2,
                  "index": 228
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 176,
                  "end": 227,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 6,
                      "index": 176
                    },
                    "end": {
                      "line": 7,
                      "column": 1,
                      "index": 227
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 176,
                    "end": 181,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 6,
                        "index": 176
                      },
                      "end": {
                        "line": 5,
                        "column": 11,
                        "index": 181
                      },
                      "identifierName": "func4"
                    },
                    "name": "func4"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 184,
                    "end": 227,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 14,
                        "index": 184
                      },
                      "end": {
                        "line": 7,
                        "column": 1,
                        "index": 227
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 190,
                      "end": 227,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 20,
                          "index": 190
                        },
                        "end": {
                          "line": 7,
                          "column": 1,
                          "index": 227
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 194,
                          "end": 224,
                          "loc": {
                            "start": {
                              "line": 6,
                              "column": 2,
                              "index": 194
                            },
                            "end": {
                              "line": 6,
                              "column": 32,
                              "index": 224
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "start": 194,
                            "end": 223,
                            "loc": {
                              "start": {
                                "line": 6,
                                "column": 2,
                                "index": 194
                              },
                              "end": {
                                "line": 6,
                                "column": 31,
                                "index": 223
                              }
                            },
                            "callee": {
                              "type": "MemberExpression",
                              "start": 194,
                              "end": 205,
                              "loc": {
                                "start": {
                                  "line": 6,
                                  "column": 2,
                                  "index": 194
                                },
                                "end": {
                                  "line": 6,
                                  "column": 13,
                                  "index": 205
                                }
                              },
                              "object": {
                                "type": "Identifier",
                                "start": 194,
                                "end": 201,
                                "loc": {
                                  "start": {
                                    "line": 6,
                                    "column": 2,
                                    "index": 194
                                  },
                                  "end": {
                                    "line": 6,
                                    "column": 9,
                                    "index": 201
                                  },
                                  "identifierName": "console"
                                },
                                "name": "console"
                              },
                              "computed": false,
                              "property": {
                                "type": "Identifier",
                                "start": 202,
                                "end": 205,
                                "loc": {
                                  "start": {
                                    "line": 6,
                                    "column": 10,
                                    "index": 202
                                  },
                                  "end": {
                                    "line": 6,
                                    "column": 13,
                                    "index": 205
                                  },
                                  "identifierName": "log"
                                },
                                "name": "log"
                              }
                            },
                            "arguments": [
                              {
                                "type": "StringLiteral",
                                "start": 206,
                                "end": 222,
                                "loc": {
                                  "start": {
                                    "line": 6,
                                    "column": 14,
                                    "index": 206
                                  },
                                  "end": {
                                    "line": 6,
                                    "column": 30,
                                    "index": 222
                                  }
                                },
                                "extra": {
                                  "value": "arrow function",
                                  "raw": "\"arrow function\""
                                },
                                "value": "arrow function"
                              }
                            ]
                          }
                        }
                      ],
                      "directives": []
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 229,
              "end": 290,
              "loc": {
                "start": {
                  "line": 8,
                  "column": 0,
                  "index": 229
                },
                "end": {
                  "line": 10,
                  "column": 2,
                  "index": 290
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 235,
                  "end": 289,
                  "loc": {
                    "start": {
                      "line": 8,
                      "column": 6,
                      "index": 235
                    },
                    "end": {
                      "line": 10,
                      "column": 1,
                      "index": 289
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 235,
                    "end": 240,
                    "loc": {
                      "start": {
                        "line": 8,
                        "column": 6,
                        "index": 235
                      },
                      "end": {
                        "line": 8,
                        "column": 11,
                        "index": 240
                      },
                      "identifierName": "func5"
                    },
                    "name": "func5"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 243,
                    "end": 289,
                    "loc": {
                      "start": {
                        "line": 8,
                        "column": 14,
                        "index": 243
                      },
                      "end": {
                        "line": 10,
                        "column": 1,
                        "index": 289
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": false,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 243,
                        "end": 248,
                        "loc": {
                          "start": {
                            "line": 8,
                            "column": 14,
                            "index": 243
                          },
                          "end": {
                            "line": 8,
                            "column": 19,
                            "index": 248
                          },
                          "identifierName": "async"
                        },
                        "name": "async"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 252,
                      "end": 289,
                      "loc": {
                        "start": {
                          "line": 8,
                          "column": 23,
                          "index": 252
                        },
                        "end": {
                          "line": 10,
                          "column": 1,
                          "index": 289
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 256,
                          "end": 286,
                          "loc": {
                            "start": {
                              "line": 9,
                              "column": 2,
                              "index": 256
                            },
                            "end": {
                              "line": 9,
                              "column": 32,
                              "index": 286
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "start": 256,
                            "end": 285,
                            "loc": {
                              "start": {
                                "line": 9,
                                "column": 2,
                                "index": 256
                              },
                              "end": {
                                "line": 9,
                                "column": 31,
                                "index": 285
                              }
                            },
                            "callee": {
                              "type": "MemberExpression",
                              "start": 256,
                              "end": 267,
                              "loc": {
                                "start": {
                                  "line": 9,
                                  "column": 2,
                                  "index": 256
                                },
                                "end": {
                                  "line": 9,
                                  "column": 13,
                                  "index": 267
                                }
                              },
                              "object": {
                                "type": "Identifier",
                                "start": 256,
                                "end": 263,
                                "loc": {
                                  "start": {
                                    "line": 9,
                                    "column": 2,
                                    "index": 256
                                  },
                                  "end": {
                                    "line": 9,
                                    "column": 9,
                                    "index": 263
                                  },
                                  "identifierName": "console"
                                },
                                "name": "console"
                              },
                              "computed": false,
                              "property": {
                                "type": "Identifier",
                                "start": 264,
                                "end": 267,
                                "loc": {
                                  "start": {
                                    "line": 9,
                                    "column": 10,
                                    "index": 264
                                  },
                                  "end": {
                                    "line": 9,
                                    "column": 13,
                                    "index": 267
                                  },
                                  "identifierName": "log"
                                },
                                "name": "log"
                              }
                            },
                            "arguments": [
                              {
                                "type": "StringLiteral",
                                "start": 268,
                                "end": 284,
                                "loc": {
                                  "start": {
                                    "line": 9,
                                    "column": 14,
                                    "index": 268
                                  },
                                  "end": {
                                    "line": 9,
                                    "column": 30,
                                    "index": 284
                                  }
                                },
                                "extra": {
                                  "value": "arrow function",
                                  "raw": "\"arrow function\""
                                },
                                "value": "arrow function"
                              }
                            ]
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