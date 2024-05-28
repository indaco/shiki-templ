const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const grammarPath = path.join(__dirname, "grammars", "templ.tmLanguage.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf-8"));

// Write the grammar file to the dist directory
fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, "dist", "templ.tmLanguage.json"),
  JSON.stringify(grammar, null, 2),
);

// CommonJS build
esbuild
  .build({
    entryPoints: ["src/index.cjs.js"],
    bundle: true,
    platform: "node",
    outfile: "dist/index.cjs.js",
    format: "cjs",
  })
  .catch(() => process.exit(1));

// ESModule build
esbuild
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    platform: "node",
    outfile: "dist/index.esm.js",
    format: "esm",
  })
  .catch(() => process.exit(1));
