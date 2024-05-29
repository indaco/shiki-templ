import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  splitting: false,
  dts: false,
  format: ["cjs", "esm"],
  sourcemap: false,
  treeshake: true,
  minify: true,
});
