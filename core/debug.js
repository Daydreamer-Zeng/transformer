// leading
baseNum = /* inner leading */.1e10_11; // trailing
const underscoreNum = 1_000_000.;
const binaryNum = 0b1010;
const octalNum = 0o755;
const hexNum = 0x1a3f;
const decimalNum = 3.14159;
const scientificBig = 6.022e23;
const scientificSmall = 1.5e-6;
const scientificInteger = 1e3;
const bigIntVal = 9007199254740993n;
const bigIntBinary = 0b1010n;
const bigIntHex = 0xFFn;
const bigIntDivision = 10n;
const sepDecimal = 1_234_567.890_123;
const sepBinary = 0b1010_0001_1000_0101;
const sepOctal = 0o2_3_7;
const sepHex = 0xA0_B0_C0_D0;

// 字符串字面量
const singleQuoteStr = 'Hello World';
const doubleQuoteStr = "Hello World";
const templateStr = `Hello World`;

// 转义字符
const escapeSingleQuote = 'It\'s a beautiful day';
const escapeDoubleQuote = "He said \"Hello\"";
const escapeNewline = 'First line\nSecond line';
const escapeTab = 'Column1\tColumn2';
const escapeBackslash = 'This is a backslash: \\';
const escapeCarriageReturn = 'Hello\rWorld';
const escapeUnicode = '\u0048\u0065\u006c\u006c\u006f'; // Hello

// 模板字符串特性
const name = 'Alice';
const templateWithVar = `Hello, ${name}!`;
const templateWithExpr = `Sum: ${1 + 2}`;
const multiLineTemplate = `First line
Second line
Third line`;

// 特殊字符
const emptyStr = '';
const spaceStr = ' ';
const nullCharStr = '\0';
const unicodeChar = '\u{1F600}'; // 😀 emoji

// 原始字符串 (Raw string)
const rawStr = String.raw`Not a newline: \n`;

// 长字符串
const longStr1 = 'This is a very long ' +
                 'string that spans ' +
                 'multiple lines';

const longStr2 = 'This is a very long \
string that continues on next line';

outerLoop: for (let i = 0; i < 10; i++) {
  innerLoop: for (let j = 0; j < 10; j++) {
    if (i * j > 50) {
      break outerLoop;
    }
  }
}