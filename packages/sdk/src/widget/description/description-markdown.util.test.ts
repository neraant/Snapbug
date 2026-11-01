import { describe, expect, it } from "vitest";

import { descriptionPlainLength, isDescriptionEmpty } from "./description-markdown.util";

describe("isDescriptionEmpty", () => {
  it("treats whitespace and blank lines as empty", () => {
    expect(isDescriptionEmpty("")).toBe(true);
    expect(isDescriptionEmpty("  \n  ")).toBe(true);
  });

  it("treats markup-only lines as empty", () => {
    expect(isDescriptionEmpty("# ")).toBe(true);
    expect(isDescriptionEmpty("- ")).toBe(true);
    expect(isDescriptionEmpty("1. ")).toBe(true);
    expect(isDescriptionEmpty("> ")).toBe(true);
    expect(isDescriptionEmpty("****")).toBe(true);
    expect(isDescriptionEmpty("[](https://x.com)")).toBe(true);
  });

  it("detects meaningful text after stripping markup", () => {
    expect(isDescriptionEmpty("**note**")).toBe(false);
    expect(isDescriptionEmpty("# Title")).toBe(false);
    expect(isDescriptionEmpty("- item")).toBe(false);
  });
});

describe("descriptionPlainLength", () => {
  it("ignores markdown markers", () => {
    expect(descriptionPlainLength("**bold** and [link](https://x.com)")).toBe("bold and link".length);
    expect(descriptionPlainLength("- one\n- two")).toBe("one\ntwo".length);
    expect(descriptionPlainLength("")).toBe(0);
  });
});
