import { VercelBlobFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/vercel-blob-file-storage.adapter";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";

const PLACEHOLDER_BLOB_TOKEN = "your-blob-read-write-token-here";

function resolvedBlobToken(tokenFromEnvFile: string | undefined): string | undefined {
  const token = tokenFromEnvFile?.trim() || process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token || token === PLACEHOLDER_BLOB_TOKEN) return undefined;
  return token;
}

export function createBugReportFileStorage(tokenFromEnvFile: string | undefined): FileStoragePort {
  const token = resolvedBlobToken(tokenFromEnvFile);
  return new VercelBlobFileStorageAdapter(token);
}
