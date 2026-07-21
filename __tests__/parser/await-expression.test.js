import Tokenizer from "../../js/tokenizer.js";
import Parser from "../../js/parser.js";

describe("Parser", () => {
  describe("Async Declaration", () => {
    it("should parse async declaration", () => {
      const input = `const res = await import('./module.js');
await import('./module.js');
const foo = async () => await promise;
async function welcome() {
  return await Promise.resolve("Hello, World!");
}
export const result = await promise;
const obj = {
  async method() {
    await promise()
  }
}`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 282,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 12,
            "column": 1,
            "index": 282
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 282,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 12,
              "column": 1,
              "index": 282
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
                    "end": 9,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 6,
                        "index": 6
                      },
                      "end": {
                        "line": 1,
                        "column": 9,
                        "index": 9
                      },
                      "identifierName": "res"
                    },
                    "name": "res"
                  },
                  "init": {
                    "type": "AwaitExpression",
                    "start": 12,
                    "end": 39,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 12,
                        "index": 12
                      },
                      "end": {
                        "line": 1,
                        "column": 39,
                        "index": 39
                      }
                    },
                    "argument": {
                      "type": "CallExpression",
                      "start": 18,
                      "end": 39,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 18,
                          "index": 18
                        },
                        "end": {
                          "line": 1,
                          "column": 39,
                          "index": 39
                        }
                      },
                      "callee": {
                        "type": "Import",
                        "start": 18,
                        "end": 24,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 18,
                            "index": 18
                          },
                          "end": {
                            "line": 1,
                            "column": 24,
                            "index": 24
                          }
                        }
                      },
                      "arguments": [
                        {
                          "type": "StringLiteral",
                          "start": 25,
                          "end": 38,
                          "loc": {
                            "start": {
                              "line": 1,
                              "column": 25,
                              "index": 25
                            },
                            "end": {
                              "line": 1,
                              "column": 38,
                              "index": 38
                            }
                          },
                          "extra": {
                            "value": "./module.js",
                            "raw": "'./module.js'"
                          },
                          "value": "./module.js"
                        }
                      ]
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "ExpressionStatement",
              "start": 41,
              "end": 69,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 41
                },
                "end": {
                  "line": 2,
                  "column": 28,
                  "index": 69
                }
              },
              "expression": {
                "type": "AwaitExpression",
                "start": 41,
                "end": 68,
                "loc": {
                  "start": {
                    "line": 2,
                    "column": 0,
                    "index": 41
                  },
                  "end": {
                    "line": 2,
                    "column": 27,
                    "index": 68
                  }
                },
                "argument": {
                  "type": "CallExpression",
                  "start": 47,
                  "end": 68,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 6,
                      "index": 47
                    },
                    "end": {
                      "line": 2,
                      "column": 27,
                      "index": 68
                    }
                  },
                  "callee": {
                    "type": "Import",
                    "start": 47,
                    "end": 53,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 6,
                        "index": 47
                      },
                      "end": {
                        "line": 2,
                        "column": 12,
                        "index": 53
                      }
                    }
                  },
                  "arguments": [
                    {
                      "type": "StringLiteral",
                      "start": 54,
                      "end": 67,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 13,
                          "index": 54
                        },
                        "end": {
                          "line": 2,
                          "column": 26,
                          "index": 67
                        }
                      },
                      "extra": {
                        "value": "./module.js",
                        "raw": "'./module.js'"
                      },
                      "value": "./module.js"
                    }
                  ]
                }
              }
            },
            {
              "type": "VariableDeclaration",
              "start": 70,
              "end": 108,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 0,
                  "index": 70
                },
                "end": {
                  "line": 3,
                  "column": 38,
                  "index": 108
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 76,
                  "end": 107,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 6,
                      "index": 76
                    },
                    "end": {
                      "line": 3,
                      "column": 37,
                      "index": 107
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 76,
                    "end": 79,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 6,
                        "index": 76
                      },
                      "end": {
                        "line": 3,
                        "column": 9,
                        "index": 79
                      },
                      "identifierName": "foo"
                    },
                    "name": "foo"
                  },
                  "init": {
                    "type": "ArrowFunctionExpression",
                    "start": 82,
                    "end": 107,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 12,
                        "index": 82
                      },
                      "end": {
                        "line": 3,
                        "column": 37,
                        "index": 107
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [],
                    "body": {
                      "type": "AwaitExpression",
                      "start": 94,
                      "end": 107,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 24,
                          "index": 94
                        },
                        "end": {
                          "line": 3,
                          "column": 37,
                          "index": 107
                        }
                      },
                      "argument": {
                        "type": "Identifier",
                        "start": 100,
                        "end": 107,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 30,
                            "index": 100
                          },
                          "end": {
                            "line": 3,
                            "column": 37,
                            "index": 107
                          },
                          "identifierName": "promise"
                        },
                        "name": "promise"
                      }
                    }
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "FunctionDeclaration",
              "start": 109,
              "end": 186,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0,
                  "index": 109
                },
                "end": {
                  "line": 6,
                  "column": 1,
                  "index": 186
                }
              },
              "id": {
                "type": "Identifier",
                "start": 124,
                "end": 131,
                "loc": {
                  "start": {
                    "line": 4,
                    "column": 15,
                    "index": 124
                  },
                  "end": {
                    "line": 4,
                    "column": 22,
                    "index": 131
                  },
                  "identifierName": "welcome"
                },
                "name": "welcome"
              },
              "generator": false,
              "async": true,
              "params": [],
              "body": {
                "type": "BlockStatement",
                "start": 134,
                "end": 186,
                "loc": {
                  "start": {
                    "line": 4,
                    "column": 25,
                    "index": 134
                  },
                  "end": {
                    "line": 6,
                    "column": 1,
                    "index": 186
                  }
                },
                "body": [
                  {
                    "type": "ReturnStatement",
                    "start": 138,
                    "end": 184,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 2,
                        "index": 138
                      },
                      "end": {
                        "line": 5,
                        "column": 48,
                        "index": 184
                      }
                    },
                    "argument": {
                      "type": "AwaitExpression",
                      "start": 145,
                      "end": 183,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 9,
                          "index": 145
                        },
                        "end": {
                          "line": 5,
                          "column": 47,
                          "index": 183
                        }
                      },
                      "argument": {
                        "type": "CallExpression",
                        "start": 151,
                        "end": 183,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 15,
                            "index": 151
                          },
                          "end": {
                            "line": 5,
                            "column": 47,
                            "index": 183
                          }
                        },
                        "callee": {
                          "type": "MemberExpression",
                          "start": 151,
                          "end": 166,
                          "loc": {
                            "start": {
                              "line": 5,
                              "column": 15,
                              "index": 151
                            },
                            "end": {
                              "line": 5,
                              "column": 30,
                              "index": 166
                            }
                          },
                          "object": {
                            "type": "Identifier",
                            "start": 151,
                            "end": 158,
                            "loc": {
                              "start": {
                                "line": 5,
                                "column": 15,
                                "index": 151
                              },
                              "end": {
                                "line": 5,
                                "column": 22,
                                "index": 158
                              },
                              "identifierName": "Promise"
                            },
                            "name": "Promise"
                          },
                          "computed": false,
                          "property": {
                            "type": "Identifier",
                            "start": 159,
                            "end": 166,
                            "loc": {
                              "start": {
                                "line": 5,
                                "column": 23,
                                "index": 159
                              },
                              "end": {
                                "line": 5,
                                "column": 30,
                                "index": 166
                              },
                              "identifierName": "resolve"
                            },
                            "name": "resolve"
                          }
                        },
                        "arguments": [
                          {
                            "type": "StringLiteral",
                            "start": 167,
                            "end": 182,
                            "loc": {
                              "start": {
                                "line": 5,
                                "column": 31,
                                "index": 167
                              },
                              "end": {
                                "line": 5,
                                "column": 46,
                                "index": 182
                              }
                            },
                            "extra": {
                              "value": "Hello, World!",
                              "raw": "\"Hello, World!\""
                            },
                            "value": "Hello, World!"
                          }
                        ]
                      }
                    }
                  }
                ],
                "directives": []
              }
            },
            {
              "type": "ExportNamedDeclaration",
              "start": 187,
              "end": 223,
              "loc": {
                "start": {
                  "line": 7,
                  "column": 0,
                  "index": 187
                },
                "end": {
                  "line": 7,
                  "column": 36,
                  "index": 223
                }
              },
              "specifiers": [],
              "source": null,
              "assertions": [],
              "declaration": {
                "type": "VariableDeclaration",
                "start": 194,
                "end": 223,
                "loc": {
                  "start": {
                    "line": 7,
                    "column": 7,
                    "index": 194
                  },
                  "end": {
                    "line": 7,
                    "column": 36,
                    "index": 223
                  }
                },
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 200,
                    "end": 222,
                    "loc": {
                      "start": {
                        "line": 7,
                        "column": 13,
                        "index": 200
                      },
                      "end": {
                        "line": 7,
                        "column": 35,
                        "index": 222
                      }
                    },
                    "id": {
                      "type": "Identifier",
                      "start": 200,
                      "end": 206,
                      "loc": {
                        "start": {
                          "line": 7,
                          "column": 13,
                          "index": 200
                        },
                        "end": {
                          "line": 7,
                          "column": 19,
                          "index": 206
                        },
                        "identifierName": "result"
                      },
                      "name": "result"
                    },
                    "init": {
                      "type": "AwaitExpression",
                      "start": 209,
                      "end": 222,
                      "loc": {
                        "start": {
                          "line": 7,
                          "column": 22,
                          "index": 209
                        },
                        "end": {
                          "line": 7,
                          "column": 35,
                          "index": 222
                        }
                      },
                      "argument": {
                        "type": "Identifier",
                        "start": 215,
                        "end": 222,
                        "loc": {
                          "start": {
                            "line": 7,
                            "column": 28,
                            "index": 215
                          },
                          "end": {
                            "line": 7,
                            "column": 35,
                            "index": 222
                          },
                          "identifierName": "promise"
                        },
                        "name": "promise"
                      }
                    }
                  }
                ],
                "kind": "const"
              },
              "exportKind": "value"
            },
            {
              "type": "VariableDeclaration",
              "start": 224,
              "end": 282,
              "loc": {
                "start": {
                  "line": 8,
                  "column": 0,
                  "index": 224
                },
                "end": {
                  "line": 12,
                  "column": 1,
                  "index": 282
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 230,
                  "end": 282,
                  "loc": {
                    "start": {
                      "line": 8,
                      "column": 6,
                      "index": 230
                    },
                    "end": {
                      "line": 12,
                      "column": 1,
                      "index": 282
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 230,
                    "end": 233,
                    "loc": {
                      "start": {
                        "line": 8,
                        "column": 6,
                        "index": 230
                      },
                      "end": {
                        "line": 8,
                        "column": 9,
                        "index": 233
                      },
                      "identifierName": "obj"
                    },
                    "name": "obj"
                  },
                  "init": {
                    "type": "ObjectExpression",
                    "start": 236,
                    "end": 282,
                    "loc": {
                      "start": {
                        "line": 8,
                        "column": 12,
                        "index": 236
                      },
                      "end": {
                        "line": 12,
                        "column": 1,
                        "index": 282
                      }
                    },
                    "properties": [
                      {
                        "type": "ObjectMethod",
                        "start": 240,
                        "end": 280,
                        "loc": {
                          "start": {
                            "line": 9,
                            "column": 2,
                            "index": 240
                          },
                          "end": {
                            "line": 11,
                            "column": 3,
                            "index": 280
                          }
                        },
                        "method": true,
                        "key": {
                          "type": "Identifier",
                          "start": 246,
                          "end": 252,
                          "loc": {
                            "start": {
                              "line": 9,
                              "column": 8,
                              "index": 246
                            },
                            "end": {
                              "line": 9,
                              "column": 14,
                              "index": 252
                            },
                            "identifierName": "method"
                          },
                          "name": "method"
                        },
                        "computed": false,
                        "kind": "method",
                        "id": null,
                        "generator": false,
                        "async": true,
                        "params": [],
                        "body": {
                          "type": "BlockStatement",
                          "start": 255,
                          "end": 280,
                          "loc": {
                            "start": {
                              "line": 9,
                              "column": 17,
                              "index": 255
                            },
                            "end": {
                              "line": 11,
                              "column": 3,
                              "index": 280
                            }
                          },
                          "body": [
                            {
                              "type": "ExpressionStatement",
                              "start": 261,
                              "end": 276,
                              "loc": {
                                "start": {
                                  "line": 10,
                                  "column": 4,
                                  "index": 261
                                },
                                "end": {
                                  "line": 10,
                                  "column": 19,
                                  "index": 276
                                }
                              },
                              "expression": {
                                "type": "AwaitExpression",
                                "start": 261,
                                "end": 276,
                                "loc": {
                                  "start": {
                                    "line": 10,
                                    "column": 4,
                                    "index": 261
                                  },
                                  "end": {
                                    "line": 10,
                                    "column": 19,
                                    "index": 276
                                  }
                                },
                                "argument": {
                                  "type": "CallExpression",
                                  "start": 267,
                                  "end": 276,
                                  "loc": {
                                    "start": {
                                      "line": 10,
                                      "column": 10,
                                      "index": 267
                                    },
                                    "end": {
                                      "line": 10,
                                      "column": 19,
                                      "index": 276
                                    }
                                  },
                                  "callee": {
                                    "type": "Identifier",
                                    "start": 267,
                                    "end": 274,
                                    "loc": {
                                      "start": {
                                        "line": 10,
                                        "column": 10,
                                        "index": 267
                                      },
                                      "end": {
                                        "line": 10,
                                        "column": 17,
                                        "index": 274
                                      },
                                      "identifierName": "promise"
                                    },
                                    "name": "promise"
                                  },
                                  "arguments": []
                                }
                              }
                            }
                          ],
                          "directives": []
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