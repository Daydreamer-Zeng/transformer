import fs from "fs";
import path from "path";

export function outputFile(data, filename, type = "txt") {
  const dir = path.join(__dirname, "output");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  filename = `${filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

  const filePath = path.join(dir, `${filename}.${type}`);

  if (type === "json") {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } else {
    fs.writeFileSync(filePath, data);
  }
}
