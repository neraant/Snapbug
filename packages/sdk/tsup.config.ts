import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: { resolve: true },
    sourcemap: false,
    clean: true,
    target: "es2020",
    platform: "browser",
    noExternal: [/^@workspace\//, "zod"],
  },
  {
    entry: { snapbug: "src/index.ts" },
    format: ["iife"],
    globalName: "Snapbug",
    minify: true,
    sourcemap: false,
    target: "es2020",
    platform: "browser",
    noExternal: [/.*/],
    outExtension: () => ({ js: ".global.js" }),
  },
]);
