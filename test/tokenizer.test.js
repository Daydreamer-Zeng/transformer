import Tokenizer from "../src/tokenizer.js";
import { outputFile } from "./test-helpers.js";

describe("Tokenizer", () => {
  describe("Identifier", () => {
    it("should parse a single identifier correctly", () => {
      const input = "x";
      const expected = [{"end": 1, "extra": undefined, "loc": {"end": {"column": 1, "index": 1, "line": 1}, "start": {"column": 0, "index": 0, "line": 1}}, "start": 0, "type": "Identifier", "value": "x"}, {"end": 1, "loc": {"end": {"column": 1, "index": 1, "line": 1}, "start": {"column": 0, "index": 0, "line": 1}}, "start": 0, "type": "EOF", "value": "EOF"}];
      const result = new Tokenizer().tokenize(input);
      expect(result).toEqual(expected);
    });

    it("Analyze object identification", () => {
      const input = `const obj = {
  // 普通属性
  name: "John",
  age: 30,
  
  // 简写属性
  name,  // 相当于 name: name
  
  // 计算属性
  [Symbol.iterator]: function*() {},
  
  // 方法
  greet() { return "Hello"; },
  
  // async 方法
  async fetch() { return await api(); },
  
  // Generator 方法
  *gen() { yield 1; },
  
  // getter
  get fullName() { return this.first + " " + this.last; },
  
  // setter
  set fullName(val) { [this.first, this.last] = val.split(" "); },
  
  // 展开属性
  ...otherObj
};`;

      const result = new Tokenizer().tokenize(input);
      outputFile(result, "tokenizer", "json");
    });
  });
});
