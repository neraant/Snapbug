import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

const envDir = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.resolve(envDir, "../../../../.env.local") });
