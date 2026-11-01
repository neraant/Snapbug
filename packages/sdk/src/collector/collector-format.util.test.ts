import { describe, expect, it } from "vitest";

import { BUG_REPORT_LOG_MESSAGE_MAX_LENGTH } from "./collector.const";
import { formatConsoleArgs, formatErrorMessage, formatRejectionReason } from "./collector-format.util";

describe("formatConsoleArgs", () => {
  it("joins mixed args and truncates long output", () => {
    expect(formatConsoleArgs(["hello", 42])).toBe("hello 42");

    const long = "x".repeat(BUG_REPORT_LOG_MESSAGE_MAX_LENGTH + 10);
    const formatted = formatConsoleArgs([long]);
    expect(formatted.length).toBe(BUG_REPORT_LOG_MESSAGE_MAX_LENGTH);
    expect(formatted.endsWith("…")).toBe(true);
  });
});

describe("formatErrorMessage", () => {
  it("includes message, location, and stack", () => {
    const event = {
      message: "boom",
      filename: "app.js",
      lineno: 1,
      colno: 2,
      error: new Error("inner"),
    } as ErrorEvent;

    const text = formatErrorMessage(event);
    expect(text).toContain("boom");
    expect(text).toContain("app.js:1:2");
    expect(text).toContain("inner");
  });
});

describe("formatRejectionReason", () => {
  it("formats errors, strings, and plain objects", () => {
    expect(formatRejectionReason("fail")).toBe("fail");
    expect(formatRejectionReason(new Error("e"))).toContain("e");
    expect(formatRejectionReason({ code: 1 })).toBe('{"code":1}');
  });
});
