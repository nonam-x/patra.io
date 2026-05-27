import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(".");

const ignoreDirs = [
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "scratch"
];

const extensions = [".ts", ".tsx", ".json", ".js", ".md", ".yaml", ".yml"];

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (ignoreDirs.includes(file)) continue;
      walk(fullPath, callback);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        callback(fullPath);
      }
    }
  }
}

console.log("Starting rebranding audit and replacement...");

let modifiedCount = 0;

walk(rootDir, (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  let newContent = content;

  // 1. Replace @repo/ with @patra/
  newContent = newContent.replace(/@repo\//g, "@patra/");

  // 2. Replace root package name in root package.json
  if (filePath.endsWith("package.json") && filePath === path.join(rootDir, "package.json")) {
    newContent = newContent.replace(/"name":\s*"trpc-monorepo"/, '"name": "patra-io-monorepo"');
  }

  // 3. Replace @repo in eslint configs
  newContent = newContent.replace(/@repo\b/g, "@patra");

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(`✓ Modified: ${path.relative(rootDir, filePath)}`);
    modifiedCount++;
  }
});

console.log(`Rebranding completed successfully! Modified ${modifiedCount} files.`);
