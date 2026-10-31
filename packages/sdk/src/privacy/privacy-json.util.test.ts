import { describe, expect, it } from "vitest";

import { REDACTED } from "./privacy.const";
import { scrubJsonValue, scrubUrlQueryValues } from "./privacy-json.util";

describe("scrubUrlQueryValues", () => {
  it("redacts query parameter values", () => {
    const scrubbed = scrubUrlQueryValues("https://app.test/path?token=secret&page=1");
    const url = new URL(scrubbed);
    expect(url.searchParams.get("token")).toBe(REDACTED);
    expect(url.searchParams.get("page")).toBe(REDACTED);
  });

  it("redacts hash fragments that look like query strings", () => {
    expect(scrubUrlQueryValues("https://app.test/#access=abc")).toContain(`#${REDACTED}`);
  });

  it("returns non-url strings unchanged", () => {
    expect(scrubUrlQueryValues("not-a-url")).toBe("not-a-url");
  });
});

describe("scrubJsonValue", () => {
  it("walks nested structures and scrubs url strings", () => {
    const result = scrubJsonValue({
      url: "https://x.test/?k=v",
      nested: [{ href: "https://y.test/?a=b" }],
      count: 3,
      ok: true,
      empty: null,
    });

    expect(result).toMatchObject({
      url: expect.stringMatching(/k=%5BREDACTED%5D|\?k=\[REDACTED\]/),
      nested: [{ href: expect.stringMatching(/a=%5BREDACTED%5D|\?a=\[REDACTED\]/) }],
      count: 3,
      ok: true,
      empty: null,
    });
  });
});
