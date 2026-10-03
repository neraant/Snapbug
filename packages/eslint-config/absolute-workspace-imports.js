import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

/**
 * Ban relative imports inside a workspace package. Use the package name + exports
 * (same as consumers), e.g. `@workspace/server/modules/…`.
 *
 * @param {string} packageName
 * @returns {import("eslint").Linter.Config}
 */
export function absoluteWorkspaceImports(packageName) {
  return {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: false, rootDir: "src", prefix: packageName },
      ],
    },
  };
}
