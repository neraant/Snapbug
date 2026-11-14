import { gunzipSync } from "node:zlib";

import { loadSeedBlobPut, type SeedBlobPut, uploadSeedBugReportFiles } from "@workspace/database/seed/bug-report-file";
import { describe, expect, it, vi } from "vitest";

const token = "vercel_blob_rw_test";

describe("uploadSeedBugReportFiles", () => {
  it("does not write to Blob when the token is missing", async () => {
    const put = vi.fn<SeedBlobPut>();

    await uploadSeedBugReportFiles(
      [{ screenshotKey: "bug-reports/report/screenshot.png", replayKey: "bug-reports/report/replay.json.gz" }],
      { token: "   ", put },
    );

    expect(put).not.toHaveBeenCalled();
  });

  it("stores the seed screenshot and replay at the keys the card opens", async () => {
    const put = vi.fn<SeedBlobPut>().mockResolvedValue({});
    const screenshotKey = "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d901/screenshot.png";
    const replayKey = "bug-reports/6a8c69a1-1ab1-45a8-8497-eae1e506d903/replay.json.gz";

    await uploadSeedBugReportFiles(
      [
        { screenshotKey, replayKey: null },
        { screenshotKey: null, replayKey },
        { screenshotKey: null, replayKey: null },
      ],
      { token, put },
    );

    expect(put).toHaveBeenCalledTimes(2);
    const screenshotCall = put.mock.calls[0];
    const replayCall = put.mock.calls[1];
    expect(screenshotCall?.[0]).toBe(screenshotKey);
    expect(screenshotCall?.[1].subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    expect(screenshotCall?.[2]).toEqual({
      access: "private",
      contentType: "image/png",
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });
    expect(replayCall?.[0]).toBe(replayKey);
    const replayEvents = JSON.parse(gunzipSync(replayCall?.[1] ?? Buffer.alloc(0)).toString()) as Array<{
      type: number;
    }>;
    expect(replayEvents.map((event) => event.type)).toEqual([4, 2]);
    expect(replayEvents[0]).toMatchObject({
      type: 4,
      data: { href: "https://store.acme.test/", width: 1440, height: 900 },
    });
    expect(replayEvents[1]).toMatchObject({
      type: 2,
      data: { initialOffset: { left: 0, top: 0 } },
    });
    expect(replayCall?.[2]).toEqual({
      access: "private",
      contentType: "application/gzip",
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });
  });

  it("loads put from the server package that depends on Blob", () => {
    expect(loadSeedBlobPut()).toEqual(expect.any(Function));
  });
});
