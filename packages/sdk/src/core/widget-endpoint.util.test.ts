/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

import { apiOrigin, bugReportEndpoint, widgetConfigEndpoint } from "./widget-endpoint.util";

describe("widget endpoints", () => {
  it("normalizes api host to a trailing slash origin", () => {
    expect(apiOrigin("api.example.com")).toBe("https://api.example.com/");
    expect(apiOrigin("https://api.example.com")).toBe("https://api.example.com/");
    expect(apiOrigin("https://api.example.com/")).toBe("https://api.example.com/");
  });

  it("builds bug report and widget config urls", () => {
    expect(bugReportEndpoint("https://snap.test")).toBe("https://snap.test/api/bug-reports");
    expect(widgetConfigEndpoint("https://snap.test", "key-1")).toBe("https://snap.test/api/widget-config?apiKey=key-1");
  });

  it("falls back to location origin when host is empty", () => {
    expect(apiOrigin("")).toBe(`${location.origin}/`);
  });
});
