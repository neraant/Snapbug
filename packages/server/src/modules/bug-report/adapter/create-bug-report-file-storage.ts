import {
  E2eFileStorageAdapter,
  resolveE2eBlobStorageDir,
} from "@workspace/server/modules/bug-report/adapter/e2e-file-storage.adapter";
import {
  R2FileStorageAdapter,
  type R2FileStorageConfig,
} from "@workspace/server/modules/bug-report/adapter/r2-file-storage.adapter";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import { env } from "@workspace/server/shared/env/env.schema";

function r2FileStorageConfig(): R2FileStorageConfig | undefined {
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, ACCOUNT_ID, BUCKET_NAME } = env;
  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !ACCOUNT_ID || !BUCKET_NAME) return undefined;
  return {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    accountId: ACCOUNT_ID,
    bucketName: BUCKET_NAME,
  };
}

export function createBugReportFileStorage(): FileStoragePort {
  if (env.SNAPBUG_E2E === "1" || env.SNAPBUG_E2E === "true") {
    return new E2eFileStorageAdapter(resolveE2eBlobStorageDir());
  }

  return new R2FileStorageAdapter(r2FileStorageConfig());
}
