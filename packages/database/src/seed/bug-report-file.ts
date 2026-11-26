import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

export type SeedBugReportFile = {
  screenshotKey: string | null;
  replayKey: string | null;
};

export type SeedObjectPut = (key: string, body: Buffer, contentType: string) => Promise<void>;

type R2SeedConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  accountId: string;
  bucketName: string;
};

const SEED_SCREENSHOT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const SEED_REPLAY_EVENTS = [
  {
    type: 4,
    data: { href: "https://store.acme.test/", width: 1440, height: 900 },
    timestamp: 1,
  },
  {
    type: 2,
    data: {
      node: {
        type: 0,
        id: 1,
        childNodes: [
          { type: 1, id: 2, name: "html", publicId: "", systemId: "" },
          {
            type: 2,
            id: 3,
            tagName: "html",
            attributes: { lang: "en" },
            childNodes: [
              { type: 2, id: 4, tagName: "head", attributes: {}, childNodes: [] },
              {
                type: 2,
                id: 5,
                tagName: "body",
                attributes: {},
                childNodes: [{ type: 3, id: 6, textContent: "Pay" }],
              },
            ],
          },
        ],
      },
      initialOffset: { left: 0, top: 0 },
    },
    timestamp: 2,
  },
];

export function seedScreenshotBytes(): Buffer {
  return SEED_SCREENSHOT_PNG;
}

export function seedReplayBytes(): Buffer {
  return gzipSync(Buffer.from(JSON.stringify(SEED_REPLAY_EVENTS)));
}

const R2_PLACEHOLDERS = new Set([
  "your-access-key-id-here",
  "your-secret-access-key-here",
  "your-account-id-here",
  "your-bucket-name-here",
]);

function readR2Env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value || R2_PLACEHOLDERS.has(value)) return undefined;
  return value;
}

function r2SeedConfigFromEnv(): R2SeedConfig | undefined {
  const accessKeyId = readR2Env("ACCESS_KEY_ID");
  const secretAccessKey = readR2Env("SECRET_ACCESS_KEY");
  const accountId = readR2Env("ACCOUNT_ID");
  const bucketName = readR2Env("BUCKET_NAME");
  if (!accessKeyId && !secretAccessKey && !accountId && !bucketName) return undefined;
  if (!accessKeyId || !secretAccessKey || !accountId || !bucketName) {
    throw new Error("R2 storage requires ACCESS_KEY_ID, SECRET_ACCESS_KEY, ACCOUNT_ID, and BUCKET_NAME.");
  }
  return { accessKeyId, secretAccessKey, accountId, bucketName };
}

export async function uploadSeedBugReportFiles(
  reports: SeedBugReportFile[],
  put: SeedObjectPut | undefined,
): Promise<void> {
  if (!put) return;

  const screenshot = seedScreenshotBytes();
  const replay = seedReplayBytes();

  for (const report of reports) {
    if (report.screenshotKey) {
      await put(report.screenshotKey, screenshot, "image/png");
    }

    if (report.replayKey) {
      await put(report.replayKey, replay, "application/gzip");
    }
  }
}

export function loadSeedObjectPut(): SeedObjectPut | undefined {
  const config = r2SeedConfigFromEnv();
  if (!config) return undefined;

  const serverPackageJson = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../server/package.json");
  const require = createRequire(serverPackageJson);
  const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3") as {
    S3Client: new (config: {
      region: string;
      endpoint: string;
      credentials: { accessKeyId: string; secretAccessKey: string };
      forcePathStyle: boolean;
      requestChecksumCalculation: "WHEN_REQUIRED";
      responseChecksumValidation: "WHEN_REQUIRED";
    }) => { send: (command: unknown) => Promise<unknown> };
    PutObjectCommand: new (input: { Bucket: string; Key: string; Body: Buffer; ContentType: string }) => unknown;
  };
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  return async (key, body, contentType) => {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  };
}

function snapbugE2eEnabled(): boolean {
  const value = process.env.SNAPBUG_E2E?.trim().toLowerCase();
  return value === "1" || value === "true";
}

function resolveE2eBlobStorageDir(): string {
  const fromEnv = process.env.SNAPBUG_E2E_BLOB_DIR?.trim();
  if (fromEnv) return fromEnv;
  return path.join(tmpdir(), "snapbug-e2e-blob");
}

export function createE2eSeedObjectPut(): SeedObjectPut {
  const rootDir = resolveE2eBlobStorageDir();
  return async (key, body) => {
    const filePath = path.join(rootDir, key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
  };
}

export function loadSeedObjectPutForCurrentEnv(): SeedObjectPut | undefined {
  if (snapbugE2eEnabled()) {
    return createE2eSeedObjectPut();
  }
  return loadSeedObjectPut();
}
