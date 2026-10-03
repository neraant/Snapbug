import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = path.resolve(monorepoRoot, "..");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/design-system",
    "@workspace/server",
    "@workspace/database",
    "@workspace/validation",
    "@workspace/analytics",
  ],
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
