import fs from "fs";
import path from "path";
import Parser from "@/parser/index.ts";

export default class ParserCLI {
  private parser: any;
  private result: any;

  constructor() {
    this.parser = Parser({
      sourceType: "script",
      strictMode: false
    });
  }

  parse(filepath: string) {
    const starttime = Date.now();

    const content = this.read(filepath);
    if (!content) {
      throw new Error(`Unable to read file: ${filepath}`);
    }

    let ast: any;
    let tokens: any;

    try {
      const result = this.parser.parse(content);
      ast = this.parser.ast || result;
      tokens = this.parser.getTokens();
    } catch (error) {
      console.log(error)
      throw error;
    }

    const duration = Date.now() - starttime;
    const result = {
      filepath,
      content,
      tokens,
      ast,
      duration
    };

    this.result = result;
    this.save();
    return result;
  }

  read(filepath: string) {
    try {
      const fullPath = path.resolve(process.cwd(), filepath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`File does not exist: ${fullPath}`);
      }

      const ext = path.extname(fullPath);
      if (![".js", ".ts"].includes(ext)) {
        throw new Error(`File type not supported: ${ext}`);
      }

      return fs.readFileSync(fullPath, "utf-8");
    } catch (error: any) {
      console.error(`File read failed: ${error.message}`);
      return null;
    }
  }

  save() {
    const { dir, name } = path.parse(this.result.filepath);
    const outputPath = path.join(dir, `${name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(this.result, null, 2));
  }
}

function main() {
  const args = process.argv.slice(2);
  const filepath = args[0];

  try {
    const cli = new ParserCLI();
    const result = cli.parse(filepath);
    console.log(`✅ Parse completed in ${result.duration}ms`);
  } catch (error) {
    process.exit(1);
  }
}

main();
