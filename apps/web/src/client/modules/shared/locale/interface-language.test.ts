// @ts-expect-error vitest is resolved by the test runner, not the web package typecheck
import { afterEach, describe, expect, it } from "vitest";

import { localize, setInterfaceLanguage } from "./interface-language";

const sample = localize({ title: "Tickets" }, { title: "Тикеты" });

describe("localize", () => {
  afterEach(() => {
    setInterfaceLanguage("en");
  });

  it("returns the Russian string, then the English string", () => {
    setInterfaceLanguage("ru");
    expect(sample.title).toBe("Тикеты");
    setInterfaceLanguage("en");
    expect(sample.title).toBe("Tickets");
  });
});
