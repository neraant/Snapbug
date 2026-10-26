import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const configDir = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.resolve(configDir, "./.env.local") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./src/migration",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
