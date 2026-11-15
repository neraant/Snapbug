// @ts-expect-error vitest is resolved by the test runner, not the web package typecheck
import { describe, expect, it } from "vitest";

import { resolveErrorScreenCopy } from "@/client/modules/error/utils/resolve-error-screen-copy.util";

describe("resolveErrorScreenCopy", () => {
  it.each([[401], [404], [500], [418]] as const)("exposes the HTTP status as visible code", (status: number) => {
    expect(resolveErrorScreenCopy(status).code).toBe(String(status));
  });
});
