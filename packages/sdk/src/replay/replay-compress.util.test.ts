import { describe, expect, it } from "vitest";

import { REPLAY_MAX_BYTES } from "./replay.const";
import { buildReplayBlob, isReplayWithinLimit } from "./replay-compress.util";

describe("replay compress", () => {
  it("returns null for empty events", async () => {
    expect(await buildReplayBlob([])).toBeNull();
  });

  it("gzips small replays", async () => {
    const result = await buildReplayBlob([{ type: 2, timestamp: 1, data: {} }]);
    expect(result?.gzipped).toBe(true);
    expect(result?.blob.type).toBe("application/gzip");
  });

  it("checks the size limit", () => {
    expect(isReplayWithinLimit(new Blob(["x".repeat(10)]), 10)).toBe(true);
    expect(isReplayWithinLimit(new Blob(["x".repeat(11)]), 10)).toBe(false);
    expect(isReplayWithinLimit(new Blob([new Uint8Array(REPLAY_MAX_BYTES + 1)]))).toBe(false);
  });

  it("omits replays larger than the limit after compression", async () => {
    const noise = Array.from({ length: 400_000 }, () => Math.random().toString(36).slice(2));
    expect(await buildReplayBlob([{ type: 3, timestamp: 1, data: noise }])).toBeNull();
  });
});
