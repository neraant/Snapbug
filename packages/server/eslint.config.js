import { absoluteWorkspaceImports } from "@workspace/eslint-config/absolute-workspace-imports";
import { config } from "@workspace/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [...config, absoluteWorkspaceImports("@workspace/server")];
