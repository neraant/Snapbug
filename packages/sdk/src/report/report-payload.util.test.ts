/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildReportPayload } from "./report-payload.util";

vi.mock("../collector/collector-buffer", () => ({
  snapshotCollectorBuffers: () => ({
    consoleLogs: [{ level: "error", message: "boom", timestamp: 1 }],
    networkLogs: [{ method: "GET", url: "https://example.com", status: 500, timestamp: 1 }],
  }),
}));

vi.mock("../core/widget-state", () => ({
  widgetState: {
    privacy: null,
    customContext: null,
    identifiedEmail: undefined,
  },
}));

describe("buildReportPayload", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { href: "https://app.test/page" });
  });

  it("always includes url and omits optional diagnostics when toggles are off", () => {
    const payload = buildReportPayload("key-1", {
      title: "Title",
      description: "Details",
      steps: "",
      severity: "high",
      email: "",
      diagnostics: {
        replay: false,
        console: false,
        network: false,
        environment: false,
      },
      screenshot: null,
    });

    expect(payload.url).toBe("https://app.test/page");
    expect(payload.userAgent).toBeUndefined();
    expect(payload.viewportWidth).toBeUndefined();
    expect(payload.viewportHeight).toBeUndefined();
    expect(payload.consoleLogs).toBeUndefined();
    expect(payload.networkLogs).toBeUndefined();
    expect(payload.severity).toBe("high");
    expect(payload.stepsToReproduce).toBeUndefined();
  });

  it("includes environment and log fields when toggles are on", () => {
    const payload = buildReportPayload("key-1", {
      title: "Title",
      description: "Details",
      steps: "1. Open checkout\n2. Click Pay",
      severity: "critical",
      email: "",
      diagnostics: {
        replay: true,
        console: true,
        network: true,
        environment: true,
      },
      screenshot: null,
    });

    expect(payload.userAgent).toBe(navigator.userAgent);
    expect(payload.viewportWidth).toBe(window.innerWidth);
    expect(payload.consoleLogs).toHaveLength(1);
    expect(payload.networkLogs).toHaveLength(1);
    expect(payload.stepsToReproduce).toBe("1. Open checkout\n2. Click Pay");
  });
});
