import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@workspace/design-system", "@workspace/server", "@workspace/validation", "@workspace/analytics"],
  outputFileTracingRoot: monorepoRoot,
  env: {
    NEXT_PUBLIC_VERCEL_TARGET_ENV: process.env.VERCEL_TARGET_ENV,
  },
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
