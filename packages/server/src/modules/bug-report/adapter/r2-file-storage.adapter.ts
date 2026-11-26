import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type {
  FileStoragePort,
  SaveBugReportReplayInput,
  SaveBugReportScreenshotInput,
} from "@workspace/server/modules/bug-report/port/file-storage.port";

export type R2FileStorageConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  accountId: string;
  bucketName: string;
};

function extensionForContentType(contentType: string): string {
  if (contentType === "image/jpeg") return "jpg";
  return "png";
}

function contentTypeForScreenshotKey(key: string): string {
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

function contentTypeForReplayKey(key: string): string {
  if (key.endsWith(".json")) return "application/json";
  return "application/gzip";
}

export class R2FileStorageAdapter implements FileStoragePort {
  private readonly client: S3Client | undefined;

  constructor(private readonly config: R2FileStorageConfig | undefined) {
    if (!config) return;
    this.client = new S3Client({
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
  }

  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const { client, bucketName } = this.requireConfig();
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(input.bytes),
        ContentType: input.contentType,
      }),
    );
    return key;
  }

  async readBugReportScreenshot(key: string) {
    const { client, bucketName } = this.requireConfig();
    const result = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    if (!result.Body) throw new Error(`Screenshot not found: ${key}`);
    const bytes = new Uint8Array(await result.Body.transformToByteArray());
    return { bytes, contentType: result.ContentType ?? contentTypeForScreenshotKey(key) };
  }

  async saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string> {
    const { client, bucketName } = this.requireConfig();
    const key = `bug-reports/${input.reportId}/replay.json.gz`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(input.bytes),
        ContentType: input.contentType,
      }),
    );
    return key;
  }

  async readBugReportReplay(key: string) {
    const { client, bucketName } = this.requireConfig();
    const result = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    if (!result.Body) throw new Error(`Replay not found: ${key}`);
    const bytes = new Uint8Array(await result.Body.transformToByteArray());
    return { bytes, contentType: result.ContentType ?? contentTypeForReplayKey(key) };
  }

  async delete(key: string): Promise<void> {
    const { client, bucketName } = this.requireConfig();
    await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
  }

  private requireConfig(): { client: S3Client; bucketName: string } {
    if (!this.client || !this.config) {
      throw new Error("R2 storage requires ACCESS_KEY_ID, SECRET_ACCESS_KEY, ACCOUNT_ID, and BUCKET_NAME.");
    }
    return { client: this.client, bucketName: this.config.bucketName };
  }
}
