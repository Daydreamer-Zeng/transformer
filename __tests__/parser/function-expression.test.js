import Tokenizer from "../../js/tokenizer.js";
import Parser from "../../js/parser.js";

describe("Parser", () => {
  describe("Function Expression", () => {
    it("should parse function expression", () => {
      const input = `const fu1 = function () {};
const fu2 = function name() {};
const fu3 = function name(param) {};
const fu4 = function (a, b, c) {};
const fu5 = function name(a, b, c, e) {};`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        type: "File",
        start: 0,
        end: 173,
        loc: {
          start: {
            line: 1,
            column: 0,
            index: 0
          },
          end: {
            line: 5,
            column: 41,
            index: 173
          }
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 173,
          loc: {
            start: {
              line: 1,
              column: 0,
              index: 0
            },
            end: {
              line: 5,
              column: 41,
              index: 173
            }
          },
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "VariableDeclaration",
              start: 0,
              end: 27,
              loc: {
                start: {
                  line: 1,
                  column: 0,
                  index: 0
                },
                end: {
                  line: 1,
                  column: 27,
                  index: 27
                }
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 6,
                  end: 26,
                  loc: {
                    start: {
                      line: 1,
                      column: 6,
                      index: 6
                    },
                    end: {
                      line: 1,
                      column: 26,
                      index: 26
                    }
                  },
                  id: {
                    type: "Identifier",
                    start: 6,
                    end: 9,
                    loc: {
                      start: {
                        line: 1,
                        column: 6,
                        index: 6
                      },
                      end: {
                        line: 1,
                        column: 9,
                        index: 9
                      },
                      identifierName: "fu1"
                    },
                    name: "fu1"
                  },
                  init: {
                    type: "FunctionExpression",
                    start: 12,
                    end: 26,
                    loc: {
                      start: {
                        line: 1,
                        column: 12,
                        index: 12
                      },
                      end: {
                        line: 1,
                        column: 26,
                        index: 26
                      }
                    },
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: "BlockStatement",
                      start: 24,
                      end: 26,
                      loc: {
                        start: {
                          line: 1,
                          column: 24,
                          index: 24
                        },
                        end: {
                          line: 1,
                          column: 26,
                          index: 26
                        }
                      },
                      body: [],
                      directives: []
                    }
                  }
                }
              ],
              kind: "const"
            },
            {
              type: "VariableDeclaration",
              start: 28,
              end: 59,
              loc: {
                start: {
                  line: 2,
                  column: 0,
                  index: 28
                },
                end: {
                  line: 2,
                  column: 31,
                  index: 59
                }
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 34,
                  end: 58,
                  loc: {
                    start: {
                      line: 2,
                      column: 6,
                      index: 34
                    },
                    end: {
                      line: 2,
                      column: 30,
                      index: 58
                    }
                  },
                  id: {
                    type: "Identifier",
                    start: 34,
                    end: 37,
                    loc: {
                      start: {
                        line: 2,
                        column: 6,
                        index: 34
                      },
                      end: {
                        line: 2,
                        column: 9,
                        index: 37
                      },
                      identifierName: "fu2"
                    },
                    name: "fu2"
                  },
                  init: {
                    type: "FunctionExpression",
                    start: 40,
                    end: 58,
                    loc: {
                      start: {
                        line: 2,
                        column: 12,
                        index: 40
                      },
                      end: {
                        line: 2,
                        column: 30,
                        index: 58
                      }
                    },
                    id: {
                      type: "Identifier",
                      start: 49,
                      end: 53,
                      loc: {
                        start: {
                          line: 2,
                          column: 21,
                          index: 49
                        },
                        end: {
                          line: 2,
                          column: 25,
                          index: 53
                        },
                        identifierName: "name"
                      },
                      name: "name"
                    },
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: "BlockStatement",
                      start: 56,
                      end: 58,
                      loc: {
                        start: {
                          line: 2,
                          column: 28,
                          index: 56
                        },
                        end: {
                          line: 2,
                          column: 30,
                          index: 58
                        }
                      },
                      body: [],
                      directives: []
                    }
                  }
                }
              ],
              kind: "const"
            },
            {
              type: "VariableDeclaration",
              start: 60,
              end: 96,
              loc: {
                start: {
                  line: 3,
                  column: 0,
                  index: 60
                },
                end: {
                  line: 3,
                  column: 36,
                  index: 96
                }
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 66,
                  end: 95,
                  loc: {
                    start: {
                      line: 3,
                      column: 6,
                      index: 66
                    },
                    end: {
                      line: 3,
                      column: 35,
                      index: 95
                    }
                  },
                  id: {
                    type: "Identifier",
                    start: 66,
                    end: 69,
                    loc: {
                      start: {
                        line: 3,
                        column: 6,
                        index: 66
                      },
                      end: {
                        line: 3,
                        column: 9,
                        index: 69
                      },
                      identifierName: "fu3"
                    },
                    name: "fu3"
                  },
                  init: {
                    type: "FunctionExpression",
                    start: 72,
                    end: 95,
                    loc: {
                      start: {
                        line: 3,
                        column: 12,
                        index: 72
                      },
                      end: {
                        line: 3,
                        column: 35,
                        index: 95
                      }
                    },
                    id: {
                      type: "Identifier",
                      start: 81,
                      end: 85,
                      loc: {
                        start: {
                          line: 3,
                          column: 21,
                          index: 81
                        },
                        end: {
                          line: 3,
                          column: 25,
                          index: 85
                        },
                        identifierName: "name"
                      },
                      name: "name"
                    },
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: "Identifier",
                        start: 86,
                        end: 91,
                        loc: {
                          start: {
                            line: 3,
                            column: 26,
                            index: 86
                          },
                          end: {
                            line: 3,
                            column: 31,
                            index: 91
                          },
                          identifierName: "param"
                        },
                        name: "param"
                      }
                    ],
                    body: {
                      type: "BlockStatement",
                      start: 93,
                      end: 95,
                      loc: {
                        start: {
                          line: 3,
                          column: 33,
                          index: 93
                        },
                        end: {
                          line: 3,
                          column: 35,
                          index: 95
                        }
                      },
                      body: [],
                      directives: []
                    }
                  }
                }
              ],
              kind: "const"
            },
            {
              type: "VariableDeclaration",
              start: 97,
              end: 131,
              loc: {
                start: {
                  line: 4,
                  column: 0,
                  index: 97
                },
                end: {
                  line: 4,
                  column: 34,
                  index: 131
                }
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 103,
                  end: 130,
                  loc: {
                    start: {
                      line: 4,
                      column: 6,
                      index: 103
                    },
                    end: {
                      line: 4,
                      column: 33,
                      index: 130
                    }
                  },
                  id: {
                    type: "Identifier",
                    start: 103,
                    end: 106,
                    loc: {
                      start: {
                        line: 4,
                        column: 6,
                        index: 103
                      },
                      end: {
                        line: 4,
                        column: 9,
                        index: 106
                      },
                      identifierName: "fu4"
                    },
                    name: "fu4"
                  },
                  init: {
                    type: "FunctionExpression",
                    start: 109,
                    end: 130,
                    loc: {
                      start: {
                        line: 4,
                        column: 12,
                        index: 109
                      },
                      end: {
                        line: 4,
                        column: 33,
                        index: 130
                      }
                    },
                    id: null,
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: "Identifier",
                        start: 119,
                        end: 120,
                        loc: {
                          start: {
                            line: 4,
                            column: 22,
                            index: 119
                          },
                          end: {
                            line: 4,
                            column: 23,
                            index: 120
                          },
                          identifierName: "a"
                        },
                        name: "a"
                      },
                      {
                        type: "Identifier",
                        start: 122,
                        end: 123,
                        loc: {
                          start: {
                            line: 4,
                            column: 25,
                            index: 122
                          },
                          end: {
                            line: 4,
                            column: 26,
                            index: 123
                          },
                          identifierName: "b"
                        },
                        name: "b"
                      },
                      {
                        type: "Identifier",
                        start: 125,
                        end: 126,
                        loc: {
                          start: {
                            line: 4,
                            column: 28,
                            index: 125
                          },
                          end: {
                            line: 4,
                            column: 29,
                            index: 126
                          },
                          identifierName: "c"
                        },
                        name: "c"
                      }
                    ],
                    body: {
                      type: "BlockStatement",
                      start: 128,
                      end: 130,
                      loc: {
                        start: {
                          line: 4,
                          column: 31,
                          index: 128
                        },
                        end: {
                          line: 4,
                          column: 33,
                          index: 130
                        }
                      },
                      body: [],
                      directives: []
                    }
                  }
                }
              ],
              kind: "const"
            },
            {
              type: "VariableDeclaration",
              start: 132,
              end: 173,
              loc: {
                start: {
                  line: 5,
                  column: 0,
                  index: 132
                },
                end: {
                  line: 5,
                  column: 41,
                  index: 173
                }
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 138,
                  end: 172,
                  loc: {
                    start: {
                      line: 5,
                      column: 6,
                      index: 138
                    },
                    end: {
                      line: 5,
                      column: 40,
                      index: 172
                    }
                  },
                  id: {
                    type: "Identifier",
                    start: 138,
                    end: 141,
                    loc: {
                      start: {
                        line: 5,
                        column: 6,
                        index: 138
                      },
                      end: {
                        line: 5,
                        column: 9,
                        index: 141
                      },
                      identifierName: "fu5"
                    },
                    name: "fu5"
                  },
                  init: {
                    type: "FunctionExpression",
                    start: 144,
                    end: 172,
                    loc: {
                      start: {
                        line: 5,
                        column: 12,
                        index: 144
                      },
                      end: {
                        line: 5,
                        column: 40,
                        index: 172
                      }
                    },
                    id: {
                      type: "Identifier",
                      start: 153,
                      end: 157,
                      loc: {
                        start: {
                          line: 5,
                          column: 21,
                          index: 153
                        },
                        end: {
                          line: 5,
                          column: 25,
                          index: 157
                        },
                        identifierName: "name"
                      },
                      name: "name"
                    },
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: "Identifier",
                        start: 158,
                        end: 159,
                        loc: {
                          start: {
                            line: 5,
                            column: 26,
                            index: 158
                          },
                          end: {
                            line: 5,
                            column: 27,
                            index: 159
                          },
                          identifierName: "a"
                        },
                        name: "a"
                      },
                      {
                        type: "Identifier",
                        start: 161,
                        end: 162,
                        loc: {
                          start: {
                            line: 5,
                            column: 29,
                            index: 161
                          },
                          end: {
                            line: 5,
                            column: 30,
                            index: 162
                          },
                          identifierName: "b"
                        },
                        name: "b"
                      },
                      {
                        type: "Identifier",
                        start: 164,
                        end: 165,
                        loc: {
                          start: {
                            line: 5,
                            column: 32,
                            index: 164
                          },
                          end: {
                            line: 5,
                            column: 33,
                            index: 165
                          },
                          identifierName: "c"
                        },
                        name: "c"
                      },
                      {
                        type: "Identifier",
                        start: 167,
                        end: 168,
                        loc: {
                          start: {
                            line: 5,
                            column: 35,
                            index: 167
                          },
                          end: {
                            line: 5,
                            column: 36,
                            index: 168
                          },
                          identifierName: "e"
                        },
                        name: "e"
                      }
                    ],
                    body: {
                      type: "BlockStatement",
                      start: 170,
                      end: 172,
                      loc: {
                        start: {
                          line: 5,
                          column: 38,
                          index: 170
                        },
                        end: {
                          line: 5,
                          column: 40,
                          index: 172
                        }
                      },
                      body: [],
                      directives: []
                    }
                  }
                }
              ],
              kind: "const"
            }
          ],
          directives: []
        },
        comments: []
      };
      const result = new Parser({ sourceType: "module" }).parse(tokens);

      expect(result).toEqual(expected);
    });

    it("should parse async function expression", () => {
      const input = `const fu1 = async function () {};
const fu2 = async function name() {};
const fu3 = async function name(param) {};
const fu4 = async function (a, b, c) {};
const fu5 = async function name(a, b, c, e) {};`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 203,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 5,
            "column": 47,
            "index": 203
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 203,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 5,
              "column": 47,
              "index": 203
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "VariableDeclaration",
              "start": 0,
              "end": 33,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 1,
                  "column": 33,
                  "index": 33
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 6,
                  "end": 32,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 6,
                      "index": 6
                    },
                    "end": {
                      "line": 1,
                      "column": 32,
                      "index": 32
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
                      "identifierName": "fu1"
                    },
                    "name": "fu1"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 12,
                    "end": 32,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 12,
                        "index": 12
                      },
                      "end": {
                        "line": 1,
                        "column": 32,
                        "index": 32
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 30,
                      "end": 32,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 30,
                          "index": 30
                        },
                        "end": {
                          "line": 1,
                          "column": 32,
                          "index": 32
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
              "start": 34,
              "end": 71,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 34
                },
                "end": {
                  "line": 2,
                  "column": 37,
                  "index": 71
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 40,
                  "end": 70,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 6,
                      "index": 40
                    },
                    "end": {
                      "line": 2,
                      "column": 36,
                      "index": 70
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 40,
                    "end": 43,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 6,
                        "index": 40
                      },
                      "end": {
                        "line": 2,
                        "column": 9,
                        "index": 43
                      },
                      "identifierName": "fu2"
                    },
                    "name": "fu2"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 46,
                    "end": 70,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 12,
                        "index": 46
                      },
                      "end": {
                        "line": 2,
                        "column": 36,
                        "index": 70
                      }
                    },
                    "id": {
                      "type": "Identifier",
                      "start": 61,
                      "end": 65,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 27,
                          "index": 61
                        },
                        "end": {
                          "line": 2,
                          "column": 31,
                          "index": 65
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
                      "start": 68,
                      "end": 70,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 34,
                          "index": 68
                        },
                        "end": {
                          "line": 2,
                          "column": 36,
                          "index": 70
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
              "start": 72,
              "end": 114,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 0,
                  "index": 72
                },
                "end": {
                  "line": 3,
                  "column": 42,
                  "index": 114
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 78,
                  "end": 113,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 6,
                      "index": 78
                    },
                    "end": {
                      "line": 3,
                      "column": 41,
                      "index": 113
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 78,
                    "end": 81,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 6,
                        "index": 78
                      },
                      "end": {
                        "line": 3,
                        "column": 9,
                        "index": 81
                      },
                      "identifierName": "fu3"
                    },
                    "name": "fu3"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 84,
                    "end": 113,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 12,
                        "index": 84
                      },
                      "end": {
                        "line": 3,
                        "column": 41,
                        "index": 113
                      }
                    },
                    "id": {
                      "type": "Identifier",
                      "start": 99,
                      "end": 103,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 27,
                          "index": 99
                        },
                        "end": {
                          "line": 3,
                          "column": 31,
                          "index": 103
                        },
                        "identifierName": "name"
                      },
                      "name": "name"
                    },
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 104,
                        "end": 109,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 32,
                            "index": 104
                          },
                          "end": {
                            "line": 3,
                            "column": 37,
                            "index": 109
                          },
                          "identifierName": "param"
                        },
                        "name": "param"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 111,
                      "end": 113,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 39,
                          "index": 111
                        },
                        "end": {
                          "line": 3,
                          "column": 41,
                          "index": 113
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
              "start": 115,
              "end": 155,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0,
                  "index": 115
                },
                "end": {
                  "line": 4,
                  "column": 40,
                  "index": 155
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 121,
                  "end": 154,
                  "loc": {
                    "start": {
                      "line": 4,
                      "column": 6,
                      "index": 121
                    },
                    "end": {
                      "line": 4,
                      "column": 39,
                      "index": 154
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 121,
                    "end": 124,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 6,
                        "index": 121
                      },
                      "end": {
                        "line": 4,
                        "column": 9,
                        "index": 124
                      },
                      "identifierName": "fu4"
                    },
                    "name": "fu4"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 127,
                    "end": 154,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 12,
                        "index": 127
                      },
                      "end": {
                        "line": 4,
                        "column": 39,
                        "index": 154
                      }
                    },
                    "id": null,
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 143,
                        "end": 144,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 28,
                            "index": 143
                          },
                          "end": {
                            "line": 4,
                            "column": 29,
                            "index": 144
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      },
                      {
                        "type": "Identifier",
                        "start": 146,
                        "end": 147,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 31,
                            "index": 146
                          },
                          "end": {
                            "line": 4,
                            "column": 32,
                            "index": 147
                          },
                          "identifierName": "b"
                        },
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 149,
                        "end": 150,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 34,
                            "index": 149
                          },
                          "end": {
                            "line": 4,
                            "column": 35,
                            "index": 150
                          },
                          "identifierName": "c"
                        },
                        "name": "c"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 152,
                      "end": 154,
                      "loc": {
                        "start": {
                          "line": 4,
                          "column": 37,
                          "index": 152
                        },
                        "end": {
                          "line": 4,
                          "column": 39,
                          "index": 154
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
              "start": 156,
              "end": 203,
              "loc": {
                "start": {
                  "line": 5,
                  "column": 0,
                  "index": 156
                },
                "end": {
                  "line": 5,
                  "column": 47,
                  "index": 203
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 162,
                  "end": 202,
                  "loc": {
                    "start": {
                      "line": 5,
                      "column": 6,
                      "index": 162
                    },
                    "end": {
                      "line": 5,
                      "column": 46,
                      "index": 202
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 162,
                    "end": 165,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 6,
                        "index": 162
                      },
                      "end": {
                        "line": 5,
                        "column": 9,
                        "index": 165
                      },
                      "identifierName": "fu5"
                    },
                    "name": "fu5"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 168,
                    "end": 202,
                    "loc": {
                      "start": {
                        "line": 5,
                        "column": 12,
                        "index": 168
                      },
                      "end": {
                        "line": 5,
                        "column": 46,
                        "index": 202
                      }
                    },
                    "id": {
                      "type": "Identifier",
                      "start": 183,
                      "end": 187,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 27,
                          "index": 183
                        },
                        "end": {
                          "line": 5,
                          "column": 31,
                          "index": 187
                        },
                        "identifierName": "name"
                      },
                      "name": "name"
                    },
                    "generator": false,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 188,
                        "end": 189,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 32,
                            "index": 188
                          },
                          "end": {
                            "line": 5,
                            "column": 33,
                            "index": 189
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      },
                      {
                        "type": "Identifier",
                        "start": 191,
                        "end": 192,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 35,
                            "index": 191
                          },
                          "end": {
                            "line": 5,
                            "column": 36,
                            "index": 192
                          },
                          "identifierName": "b"
                        },
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 194,
                        "end": 195,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 38,
                            "index": 194
                          },
                          "end": {
                            "line": 5,
                            "column": 39,
                            "index": 195
                          },
                          "identifierName": "c"
                        },
                        "name": "c"
                      },
                      {
                        "type": "Identifier",
                        "start": 197,
                        "end": 198,
                        "loc": {
                          "start": {
                            "line": 5,
                            "column": 41,
                            "index": 197
                          },
                          "end": {
                            "line": 5,
                            "column": 42,
                            "index": 198
                          },
                          "identifierName": "e"
                        },
                        "name": "e"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 200,
                      "end": 202,
                      "loc": {
                        "start": {
                          "line": 5,
                          "column": 44,
                          "index": 200
                        },
                        "end": {
                          "line": 5,
                          "column": 46,
                          "index": 202
                        }
                      },
                      "body": [],
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
      };
      const result = new Parser({ sourceType: "module" }).parse(tokens);

      expect(result).toEqual(expected);
    });

    it("should parse generator expression", () => {
      const input = `const fu1 = function* () {};
const fu2 = async function* name() {};
const fu3 = async function* name(param) {};
const fu4 = async function* (a, b, c) {};`;
      const tokens = new Tokenizer().tokenize(input);

      const expected = {
        "type": "File",
        "start": 0,
        "end": 153,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 4,
            "column": 41,
            "index": 153
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 153,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 4,
              "column": 41,
              "index": 153
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
                      "identifierName": "fu1"
                    },
                    "name": "fu1"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 12,
                    "end": 27,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 12,
                        "index": 12
                      },
                      "end": {
                        "line": 1,
                        "column": 27,
                        "index": 27
                      }
                    },
                    "id": null,
                    "generator": true,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 25,
                      "end": 27,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 25,
                          "index": 25
                        },
                        "end": {
                          "line": 1,
                          "column": 27,
                          "index": 27
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
              "start": 29,
              "end": 67,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 0,
                  "index": 29
                },
                "end": {
                  "line": 2,
                  "column": 38,
                  "index": 67
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 35,
                  "end": 66,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 6,
                      "index": 35
                    },
                    "end": {
                      "line": 2,
                      "column": 37,
                      "index": 66
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 35,
                    "end": 38,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 6,
                        "index": 35
                      },
                      "end": {
                        "line": 2,
                        "column": 9,
                        "index": 38
                      },
                      "identifierName": "fu2"
                    },
                    "name": "fu2"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 41,
                    "end": 66,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 12,
                        "index": 41
                      },
                      "end": {
                        "line": 2,
                        "column": 37,
                        "index": 66
                      }
                    },
                    "id": {
                      "type": "Identifier",
                      "start": 57,
                      "end": 61,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 28,
                          "index": 57
                        },
                        "end": {
                          "line": 2,
                          "column": 32,
                          "index": 61
                        },
                        "identifierName": "name"
                      },
                      "name": "name"
                    },
                    "generator": true,
                    "async": true,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 64,
                      "end": 66,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 35,
                          "index": 64
                        },
                        "end": {
                          "line": 2,
                          "column": 37,
                          "index": 66
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
              "start": 68,
              "end": 111,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 0,
                  "index": 68
                },
                "end": {
                  "line": 3,
                  "column": 43,
                  "index": 111
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 74,
                  "end": 110,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 6,
                      "index": 74
                    },
                    "end": {
                      "line": 3,
                      "column": 42,
                      "index": 110
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 74,
                    "end": 77,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 6,
                        "index": 74
                      },
                      "end": {
                        "line": 3,
                        "column": 9,
                        "index": 77
                      },
                      "identifierName": "fu3"
                    },
                    "name": "fu3"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 80,
                    "end": 110,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 12,
                        "index": 80
                      },
                      "end": {
                        "line": 3,
                        "column": 42,
                        "index": 110
                      }
                    },
                    "id": {
                      "type": "Identifier",
                      "start": 96,
                      "end": 100,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 28,
                          "index": 96
                        },
                        "end": {
                          "line": 3,
                          "column": 32,
                          "index": 100
                        },
                        "identifierName": "name"
                      },
                      "name": "name"
                    },
                    "generator": true,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 101,
                        "end": 106,
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 33,
                            "index": 101
                          },
                          "end": {
                            "line": 3,
                            "column": 38,
                            "index": 106
                          },
                          "identifierName": "param"
                        },
                        "name": "param"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 108,
                      "end": 110,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 40,
                          "index": 108
                        },
                        "end": {
                          "line": 3,
                          "column": 42,
                          "index": 110
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
              "start": 112,
              "end": 153,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0,
                  "index": 112
                },
                "end": {
                  "line": 4,
                  "column": 41,
                  "index": 153
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "start": 118,
                  "end": 152,
                  "loc": {
                    "start": {
                      "line": 4,
                      "column": 6,
                      "index": 118
                    },
                    "end": {
                      "line": 4,
                      "column": 40,
                      "index": 152
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "start": 118,
                    "end": 121,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 6,
                        "index": 118
                      },
                      "end": {
                        "line": 4,
                        "column": 9,
                        "index": 121
                      },
                      "identifierName": "fu4"
                    },
                    "name": "fu4"
                  },
                  "init": {
                    "type": "FunctionExpression",
                    "start": 124,
                    "end": 152,
                    "loc": {
                      "start": {
                        "line": 4,
                        "column": 12,
                        "index": 124
                      },
                      "end": {
                        "line": 4,
                        "column": 40,
                        "index": 152
                      }
                    },
                    "id": null,
                    "generator": true,
                    "async": true,
                    "params": [
                      {
                        "type": "Identifier",
                        "start": 141,
                        "end": 142,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 29,
                            "index": 141
                          },
                          "end": {
                            "line": 4,
                            "column": 30,
                            "index": 142
                          },
                          "identifierName": "a"
                        },
                        "name": "a"
                      },
                      {
                        "type": "Identifier",
                        "start": 144,
                        "end": 145,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 32,
                            "index": 144
                          },
                          "end": {
                            "line": 4,
                            "column": 33,
                            "index": 145
                          },
                          "identifierName": "b"
                        },
                        "name": "b"
                      },
                      {
                        "type": "Identifier",
                        "start": 147,
                        "end": 148,
                        "loc": {
                          "start": {
                            "line": 4,
                            "column": 35,
                            "index": 147
                          },
                          "end": {
                            "line": 4,
                            "column": 36,
                            "index": 148
                          },
                          "identifierName": "c"
                        },
                        "name": "c"
                      }
                    ],
                    "body": {
                      "type": "BlockStatement",
                      "start": 150,
                      "end": 152,
                      "loc": {
                        "start": {
                          "line": 4,
                          "column": 38,
                          "index": 150
                        },
                        "end": {
                          "line": 4,
                          "column": 40,
                          "index": 152
                        }
                      },
                      "body": [],
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
      };
      const result = new Parser({ sourceType: "module" }).parse(tokens);

      expect(result).toEqual(expected);
    });
  });
});
