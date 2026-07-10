import Tokenizer from "../../src/tokenizer.js";
import Parser from "../../src/parser.js";

describe("Parser", () => {
  describe("Template Literal", () => {
    it("should parse Template literal", () => {
      const input = `const test1 = \`hello world\`;
const test2 = \`hello \${name}\`;
const test3 = \`\${name} world\`;
const test4 = \`\${a}\${b}\${c}\`;
const test5 = \`outer \${\`inner \${x}\`} outer\`;
const test6 = \`\`;
const test7 = \`\${x}\`;`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 205,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 7,
            "column": 21,
            "index": 205
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 205,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 7,
              "column": 21,
              "index": 205
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "VariableDeclaration",
              "start": 0,
              "end": 28,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 1,
                  "column": 28,
                  "index": 28
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 6,
                  "end": 27,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 6,
                      "index": 6
                    },
                    "end": {
                      "line": 1,
                      "column": 27,
                      "index": 27
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
                    "type": "TemplateLiteral",
                    "start": 14,
                    "end": 27,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 14,
                        "index": 14
                      },
                      "end": {
                        "line": 1,
                        "column": 27,
                        "index": 27
                      }
                    },
                    "expressions": [],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 15,
                        "end": 26,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 15,
                            "index": 15
                          },
                          "end": {
                            "line": 1,
                            "column": 26,
                            "index": 26
                          }
                        },
                        "value": {
                          "raw": "hello world",
                          "cooked": "hello world"
                        },
                        "tail": true
                      }
                    ]
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 29,
              "end": 59,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 29
                },
                "end": {
                  "line": 2,
                  "column": 30,
                  "index": 59
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 35,
                  "end": 58,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 6,
                      "index": 35
                    },
                    "end": {
                      "line": 2,
                      "column": 29,
                      "index": 58
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 35,
                    "end": 40,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 6,
                        "index": 35
                      },
                      "end": {
                        "line": 2,
                        "column": 11,
                        "index": 40
                      },
                      "identifierName": "test2"
                    },
                    "name": "test2"
                  },
                  "init": {
                    "type": "TemplateLiteral",
                    "start": 43,
                    "end": 58,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 14,
                        "index": 43
                      },
                      "end": {
                        "line": 2,
                        "column": 29,
                        "index": 58
                      }
                    },
                    "expressions": [
                      {
                        "type": "Identifier",
                        "start": 52,
                        "end": 56,
                        "loc": {
                          "start": {
                            "line": 2,
                            "column": 23,
                            "index": 52
                          },
                          "end": {
                            "line": 2,
                            "column": 27,
                            "index": 56
                          },
                          "identifierName": "name"
                        },
                        "name": "name"
                      }
                    ],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 44,
                        "end": 50,
                        "loc": {
                          "start": {
                            "line": 2,
                            "column": 15,
                            "index": 44
                          },
                          "end": {
                            "line": 2,
                            "column": 21,
                            "index": 50
                          }
                        },
                        "value": {
                          "raw": "hello ",
                          "cooked": "hello "
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 57,
                        "end": 57,
                        "loc": {
                          "start": {
                            "line": 2,
                            "column": 28,
                            "index": 57
                          },
                          "end": {
                            "line": 2,
                            "column": 28,
                            "index": 57
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": true
                      }
                    ]
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 60,
              "end": 90,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 0,
                  "index": 60
                },
                "end": {
                  "line": 3,
                  "column": 30,
                  "index": 90
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 66,
                  "end": 89,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 6,
                      "index": 66
                    },
                    "end": {
                      "line": 3,
                      "column": 29,
                      "index": 89
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 66,
                    "end": 71,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 6,
                        "index": 66
                      },
                      "end": {
                        "line": 3,
                        "column": 11,
                        "index": 71
                      },
                      "identifierName": "test3"
                    },
                    "name": "test3"
                  },
                  "init": {
                    "type": "TemplateLiteral",
                    "start": 74,
                    "end": 89,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 14,
                        "index": 74
                      },
                      "end": {
                        "line": 3,
                        "column": 29,
                        "index": 89
                      }
                    },
                    "expressions": [
                      {
                        "type": "Identifier",
                        "start": 77,
                        "end": 81,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 17,
                            "index": 77
                          },
                          "end": {
                            "line": 3,
                            "column": 21,
                            "index": 81
                          },
                          "identifierName": "name"
                        },
                        "name": "name"
                      }
                    ],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 75,
                        "end": 75,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 15,
                            "index": 75
                          },
                          "end": {
                            "line": 3,
                            "column": 15,
                            "index": 75
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 82,
                        "end": 88,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 22,
                            "index": 82
                          },
                          "end": {
                            "line": 3,
                            "column": 28,
                            "index": 88
                          }
                        },
                        "value": {
                          "raw": " world",
                          "cooked": " world"
                        },
                        "tail": true
                      }
                    ]
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 91,
              "end": 120,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0,
                  "index": 91
                },
                "end": {
                  "line": 4,
                  "column": 29,
                  "index": 120
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 97,
                  "end": 119,
                  "loc": {
                    "start": {
                      "line": 4,
                      "column": 6,
                      "index": 97
                    },
                    "end": {
                      "line": 4,
                      "column": 28,
                      "index": 119
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 97,
                    "end": 102,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 6,
                        "index": 97
                      },
                      "end": {
                        "line": 4,
                        "column": 11,
                        "index": 102
                      },
                      "identifierName": "test4"
                    },
                    "name": "test4"
                  },
                  "init": {
                    "type": "TemplateLiteral",
                    "start": 105,
                    "end": 119,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 14,
                        "index": 105
                      },
                      "end": {
                        "line": 4,
                        "column": 28,
                        "index": 119
                      }
                    },
                    "expressions": [
                      {
                        "type": "Identifier",
                        "start": 108,
                        "end": 109,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 17,
                            "index": 108
                          },
                          "end": {
                            "line": 4,
                            "column": 18,
                            "index": 109
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      },
                      {
                        "type": "Identifier",
                        "start": 112,
                        "end": 113,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 21,
                            "index": 112
                          },
                          "end": {
                            "line": 4,
                            "column": 22,
                            "index": 113
                          },
                          "identifierName": "b"
                        },
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 116,
                        "end": 117,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 25,
                            "index": 116
                          },
                          "end": {
                            "line": 4,
                            "column": 26,
                            "index": 117
                          },
                          "identifierName": "c"
                        },
                        "name": "c"
                      }
                    ],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 106,
                        "end": 106,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 15,
                            "index": 106
                          },
                          "end": {
                            "line": 4,
                            "column": 15,
                            "index": 106
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 110,
                        "end": 110,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 19,
                            "index": 110
                          },
                          "end": {
                            "line": 4,
                            "column": 19,
                            "index": 110
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 114,
                        "end": 114,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 23,
                            "index": 114
                          },
                          "end": {
                            "line": 4,
                            "column": 23,
                            "index": 114
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 118,
                        "end": 118,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 27,
                            "index": 118
                          },
                          "end": {
                            "line": 4,
                            "column": 27,
                            "index": 118
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": true
                      }
                    ]
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 121,
              "end": 165,
              "loc": {
                "start": {
                  "line": 5,
                  "column": 0,
                  "index": 121
                },
                "end": {
                  "line": 5,
                  "column": 44,
                  "index": 165
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 127,
                  "end": 164,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 6,
                      "index": 127
                    },
                    "end": {
                      "line": 5,
                      "column": 43,
                      "index": 164
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 127,
                    "end": 132,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 6,
                        "index": 127
                      },
                      "end": {
                        "line": 5,
                        "column": 11,
                        "index": 132
                      },
                      "identifierName": "test5"
                    },
                    "name": "test5"
                  },
                  "init": {
                    "type": "TemplateLiteral",
                    "start": 135,
                    "end": 164,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 14,
                        "index": 135
                      },
                      "end": {
                        "line": 5,
                        "column": 43,
                        "index": 164
                      }
                    },
                    "expressions": [
                      {
                        "type": "TemplateLiteral",
                        "start": 144,
                        "end": 156,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 23,
                            "index": 144
                          },
                          "end": {
                            "line": 5,
                            "column": 35,
                            "index": 156
                          }
                        },
                        "expressions": [
                          {
                            "type": "Identifier",
                            "start": 153,
                            "end": 154,
                            "loc": {
                              "start": {
                                "line": 5,
                                "column": 32,
                                "index": 153
                              },
                              "end": {
                                "line": 5,
                                "column": 33,
                                "index": 154
                              },
                              "identifierName": "x"
                            },
                            "name": "x"
                          }
                        ],
                        "quasis": [
                          {
                            "type": "TemplateElement",
                            "start": 145,
                            "end": 151,
                            "loc": {
                              "start": {
                                "line": 5,
                                "column": 24,
                                "index": 145
                              },
                              "end": {
                                "line": 5,
                                "column": 30,
                                "index": 151
                              }
                            },
                            "value": {
                              "raw": "inner ",
                              "cooked": "inner "
                            },
                            "tail": false
                          },
                          {
                            "type": "TemplateElement",
                            "start": 155,
                            "end": 155,
                            "loc": {
                              "start": {
                                "line": 5,
                                "column": 34,
                                "index": 155
                              },
                              "end": {
                                "line": 5,
                                "column": 34,
                                "index": 155
                              }
                            },
                            "value": {
                              "raw": "",
                              "cooked": ""
                            },
                            "tail": true
                          }
                        ]
                      }
                    ],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 136,
                        "end": 142,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 15,
                            "index": 136
                          },
                          "end": {
                            "line": 5,
                            "column": 21,
                            "index": 142
                          }
                        },
                        "value": {
                          "raw": "outer ",
                          "cooked": "outer "
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 157,
                        "end": 163,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 36,
                            "index": 157
                          },
                          "end": {
                            "line": 5,
                            "column": 42,
                            "index": 163
                          }
                        },
                        "value": {
                          "raw": " outer",
                          "cooked": " outer"
                        },
                        "tail": true
                      }
                    ]
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 166,
              "end": 183,
              "loc": {
                "start": {
                  "line": 6,
                  "column": 0,
                  "index": 166
                },
                "end": {
                  "line": 6,
                  "column": 17,
                  "index": 183
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 172,
                  "end": 182,
                  "loc": {
                    "start": {
                      "line": 6,
                      "column": 6,
                      "index": 172
                    },
                    "end": {
                      "line": 6,
                      "column": 16,
                      "index": 182
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 172,
                    "end": 177,
                    "loc": {
                      "start": {
                        "line": 6,
                        "column": 6,
                        "index": 172
                      },
                      "end": {
                        "line": 6,
                        "column": 11,
                        "index": 177
                      },
                      "identifierName": "test6"
                    },
                    "name": "test6"
                  },
                  "init": {
                    "type": "TemplateLiteral",
                    "start": 180,
                    "end": 182,
                    "loc": {
                      "start": {
                        "line": 6,
                        "column": 14,
                        "index": 180
                      },
                      "end": {
                        "line": 6,
                        "column": 16,
                        "index": 182
                      }
                    },
                    "expressions": [],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 181,
                        "end": 181,
                        "loc": {
                          "start": {
                            "line": 6,
                            "column": 15,
                            "index": 181
                          },
                          "end": {
                            "line": 6,
                            "column": 15,
                            "index": 181
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": true
                      }
                    ]
                  }
                }
              ],
              "kind": "const"
            },
            {
              "type": "VariableDeclaration",
              "start": 184,
              "end": 205,
              "loc": {
                "start": {
                  "line": 7,
                  "column": 0,
                  "index": 184
                },
                "end": {
                  "line": 7,
                  "column": 21,
                  "index": 205
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 190,
                  "end": 204,
                  "loc": {
                    "start": {
                      "line": 7,
                      "column": 6,
                      "index": 190
                    },
                    "end": {
                      "line": 7,
                      "column": 20,
                      "index": 204
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 190,
                    "end": 195,
                    "loc": {
                      "start": {
                        "line": 7,
                        "column": 6,
                        "index": 190
                      },
                      "end": {
                        "line": 7,
                        "column": 11,
                        "index": 195
                      },
                      "identifierName": "test7"
                    },
                    "name": "test7"
                  },
                  "init": {
                    "type": "TemplateLiteral",
                    "start": 198,
                    "end": 204,
                    "loc": {
                      "start": {
                        "line": 7,
                        "column": 14,
                        "index": 198
                      },
                      "end": {
                        "line": 7,
                        "column": 20,
                        "index": 204
                      }
                    },
                    "expressions": [
                      {
                        "type": "Identifier",
                        "start": 201,
                        "end": 202,
                        "loc": {
                          "start": {
                            "line": 7,
                            "column": 17,
                            "index": 201
                          },
                          "end": {
                            "line": 7,
                            "column": 18,
                            "index": 202
                          },
                          "identifierName": "x"
                        },
                        "name": "x"
                      }
                    ],
                    "quasis": [
                      {
                        "type": "TemplateElement",
                        "start": 199,
                        "end": 199,
                        "loc": {
                          "start": {
                            "line": 7,
                            "column": 15,
                            "index": 199
                          },
                          "end": {
                            "line": 7,
                            "column": 15,
                            "index": 199
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": false
                      },
                      {
                        "type": "TemplateElement",
                        "start": 203,
                        "end": 203,
                        "loc": {
                          "start": {
                            "line": 7,
                            "column": 19,
                            "index": 203
                          },
                          "end": {
                            "line": 7,
                            "column": 19,
                            "index": 203
                          }
                        },
                        "value": {
                          "raw": "",
                          "cooked": ""
                        },
                        "tail": true
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