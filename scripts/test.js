const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join("__tests__");
const args = process.argv.slice(2);

if (args.length === 0) {
  runJest([rootDir]);
} else {
  const paths = [];

  for (const arg of args) {
    paths.push(arg);
  }

  const resolved = paths.map((target) => {
    const filepath = path.join(rootDir, `${target}.test.js`);
    if (fs.existsSync(filepath)) {
      return filepath;
    }

    const dir = path.join(rootDir, target);
    if (fs.existsSync(dir)) {
      return dir;
    }

    console.warn(`⚠️ path not found: ${path.join(rootDir, target)}`);
    process.exit(1);
  }).filter(Boolean);


  if (resolved.length === 0) {
    console.error(`❌ Invalid test path`);
    process.exit(1);
  }

  runJest(paths);
}

/**
 * Run Jest command
 * @param {string[]} paths 
 */
function runJest(paths) {
  const cmd = `npx jest ${paths.join(' ')}`.trim();
  console.log(`\n🧪 Running: ${cmd}\n`);
  
  try {
    execSync(cmd, {
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
