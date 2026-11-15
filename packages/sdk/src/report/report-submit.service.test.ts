/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { widgetState } from "../core/widget-state";
import { submitReport } from "./report-submit.service";

const input = {
  title: "Pay does nothing",
  description: "The pay button did nothing at all",
  steps: "",
  severity: "low" as const,
  email: "",
  diagnostics: { replay: true, console: true, network: true, environment: true },
  screenshot: null,
};

describe("submitReport preview", () => {
  afterEach(() => {
    widgetState.clearReport();
    vi.unstubAllGlobals();
  });

  it("returns the capture to the page and does not call ingest", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("location", { href: "https://app.test/playground" });
    vi.stubGlobal("navigator", { userAgent: "TestBrowser" });

    widgetState.apiKey = "sb_playground_local";
    widgetState.host = "https://app.test";
    const preview = vi.fn();
    widgetState.preview = preview;

    const shortId = await submitReport(input);

    expect(shortId).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(preview).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Pay does nothing",
        url: "https://app.test/playground",
        userAgent: "TestBrowser",
        screenshotUrl: null,
      }),
    );
  });
});
