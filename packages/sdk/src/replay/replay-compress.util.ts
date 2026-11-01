import { REPLAY_MAX_BYTES } from "./replay.const";

export type ReplayBlobResult = { blob: Blob; gzipped: boolean };

export async function compressReplayEvents(events: unknown[]): Promise<ReplayBlobResult | null> {
  if (events.length === 0) return null;

  const json = JSON.stringify(events);
  if (typeof CompressionStream === "undefined") {
    return { blob: new Blob([json], { type: "application/json" }), gzipped: false };
  }

  try {
    const stream = new Blob([json]).stream().pipeThrough(new CompressionStream("gzip"));
    const blob = await new Response(stream).blob();
    return { blob: new Blob([blob], { type: "application/gzip" }), gzipped: true };
  } catch {
    return { blob: new Blob([json], { type: "application/json" }), gzipped: false };
  }
}

export function isReplayWithinLimit(blob: Blob, limit: number = REPLAY_MAX_BYTES) {
  return blob.size <= limit;
}

/** Returns a blob ready to upload, or null when there is nothing to send or it is over the size limit. */
export async function buildReplayBlob(events: unknown[]): Promise<ReplayBlobResult | null> {
  const result = await compressReplayEvents(events);
  if (!result || !isReplayWithinLimit(result.blob)) return null;
  return result;
}
