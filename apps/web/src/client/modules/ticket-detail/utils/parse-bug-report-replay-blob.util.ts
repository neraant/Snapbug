import type { eventWithTime } from "@rrweb/types";

function parseReplayEventsJson(text: string): eventWithTime[] {
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid replay events payload");
  }

  return parsed as eventWithTime[];
}

async function decompressGzipBlob(blob: Blob): Promise<string> {
  const stream = blob.stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}

export async function parseBugReportReplayBlob(blob: Blob): Promise<eventWithTime[]> {
  const mime = blob.type.split(";")[0]?.trim() ?? "";

  if (mime === "application/json") {
    return parseReplayEventsJson(await blob.text());
  }

  if (mime === "application/gzip" || mime === "" || mime === "application/octet-stream") {
    try {
      return parseReplayEventsJson(await decompressGzipBlob(blob));
    } catch {
      return parseReplayEventsJson(await blob.text());
    }
  }

  throw new Error("Unsupported replay format");
}
