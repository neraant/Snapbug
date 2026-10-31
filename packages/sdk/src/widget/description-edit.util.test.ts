import { describe, expect, it } from "vitest";

import type { EditPatch, EditState } from "./description-edit.util";
import {
  applyLink,
  continueMarkup,
  detectFormat,
  removeLink,
  setHeading,
  toggleInline,
  toggleLines,
} from "./description-edit.util";

function apply(state: EditState, patch: EditPatch): EditState {
  const value = state.value.slice(0, patch.from) + patch.insert + state.value.slice(patch.to);
  return { value, start: patch.selStart, end: patch.selEnd };
}

describe("toggleInline", () => {
  it("wraps a selection in bold and unwraps it again", () => {
    const state: EditState = { value: "hello", start: 0, end: 5 };

    const wrapped = apply(state, toggleInline(state, "bold"));

    expect(wrapped).toEqual({ value: "**hello**", start: 2, end: 7 });
    expect(apply(wrapped, toggleInline(wrapped, "bold"))).toEqual({ value: "hello", start: 0, end: 5 });
  });

  it("keeps surrounding spaces outside the markers", () => {
    const state: EditState = { value: "  hello  ", start: 0, end: 9 };

    expect(apply(state, toggleInline(state, "bold")).value).toBe("  **hello**  ");
  });

  it("nests italic inside bold and removes only the italic markers", () => {
    const bold: EditState = { value: "**bold**", start: 2, end: 6 };

    const both = apply(bold, toggleInline(bold, "italic"));

    expect(both.value).toBe("***bold***");
    expect(apply(both, toggleInline(both, "italic")).value).toBe("**bold**");
  });

  it("wraps the word around a collapsed caret", () => {
    const state: EditState = { value: "say hello now", start: 6, end: 6 };

    expect(apply(state, toggleInline(state, "bold")).value).toBe("say **hello** now");
  });

  it("inserts an empty bold pair with the caret between the markers", () => {
    const state: EditState = { value: "", start: 0, end: 0 };
    const patch = toggleInline(state, "bold");

    expect(apply(state, patch)).toEqual({ value: "****", start: 2, end: 2 });
  });
});

describe("toggleLines", () => {
  it("toggles a bullet list off and switches it to a numbered list", () => {
    const plain: EditState = { value: "a\nb\nc", start: 0, end: 5 };
    const bullets = apply(plain, toggleLines(plain, "bullet"));

    expect(bullets.value).toBe("- a\n- b\n- c");
    expect(apply(bullets, toggleLines(bullets, "bullet")).value).toBe("a\nb\nc");
    expect(apply(bullets, toggleLines(bullets, "numbered")).value).toBe("1. a\n2. b\n3. c");
  });

  it("skips an empty line inside the selection", () => {
    const state: EditState = { value: "a\n\nc", start: 0, end: 4 };

    expect(apply(state, toggleLines(state, "bullet")).value).toBe("- a\n\n- c");
  });

  it("adds a quote prefix only to lines that do not already have one", () => {
    const mixed: EditState = { value: "> a\nb", start: 0, end: 5 };

    const quoted = apply(mixed, toggleLines(mixed, "quote"));

    expect(quoted.value).toBe("> a\n> b");
    expect(apply(quoted, toggleLines(quoted, "quote")).value).toBe("a\nb");
  });
});

describe("setHeading", () => {
  it("round-trips heading levels and clears a level-4 prefix", () => {
    let state: EditState = { value: "x", start: 0, end: 1 };
    state = apply(state, setHeading(state, 1));
    expect(state.value).toBe("# x");
    state = apply(state, setHeading(state, 2));
    expect(state.value).toBe("## x");
    state = apply(state, setHeading(state, 3));
    expect(state.value).toBe("### x");
    state = apply(state, setHeading(state, 0));
    expect(state.value).toBe("x");

    const deep: EditState = { value: "#### x", start: 0, end: 6 };
    expect(apply(deep, setHeading(deep, 0)).value).toBe("x");
  });
});

describe("applyLink", () => {
  it("wraps a selection, uses the url as the label when nothing is selected, and replaces an existing href", () => {
    const selected: EditState = { value: "docs", start: 0, end: 4 };
    const created = applyLink(selected, "https://x.com");

    expect(created).toMatchObject({ insert: "[docs](https://x.com)", selStart: 1, selEnd: 5 });

    const empty: EditState = { value: "", start: 0, end: 0 };
    expect(applyLink(empty, "https://x.com")?.insert).toBe("[https://x.com](https://x.com)");

    const existing: EditState = { value: "[docs](https://old.com)", start: 1, end: 5 };
    expect(applyLink(existing, "https://new.com")?.insert).toBe("[docs](https://new.com)");
  });

  it("rejects unsafe urls and encodes parentheses", () => {
    const state: EditState = { value: "docs", start: 0, end: 4 };

    expect(applyLink(state, "javascript:alert(1)")).toBeNull();
    expect(applyLink(state, "https://x.com/a)")?.insert).toBe("[docs](https://x.com/a%29)");
  });

  it("removes a link and leaves the label", () => {
    const state: EditState = { value: "[docs](https://x.com)", start: 1, end: 5 };

    expect(removeLink(state)).toMatchObject({ insert: "docs", selStart: 0, selEnd: 4 });
  });
});

describe("continueMarkup", () => {
  it("continues a bullet, increments a numbered item, and continues a quote", () => {
    const bullet: EditState = { value: "- a", start: 3, end: 3 };
    expect(apply(bullet, continueMarkup(bullet)!).value).toBe("- a\n- ");

    const numbered: EditState = { value: "9. a", start: 4, end: 4 };
    expect(apply(numbered, continueMarkup(numbered)!).value).toBe("9. a\n10. ");

    const quote: EditState = { value: "> a", start: 3, end: 3 };
    expect(apply(quote, continueMarkup(quote)!).value).toBe("> a\n> ");
  });

  it("leaves an empty item and ignores a caret inside the prefix", () => {
    const empty: EditState = { value: "- ", start: 2, end: 2 };
    expect(apply(empty, continueMarkup(empty)!)).toEqual({ value: "", start: 0, end: 0 });

    const prefix: EditState = { value: "- a", start: 1, end: 1 };
    expect(continueMarkup(prefix)).toBeNull();
  });
});

describe("detectFormat", () => {
  it("reports each active mark from the caret", () => {
    expect(detectFormat({ value: "**b**", start: 2, end: 3 })).toMatchObject({ bold: true, italic: false });
    expect(detectFormat({ value: "*i*", start: 1, end: 2 })).toMatchObject({ bold: false, italic: true });
    expect(detectFormat({ value: "***x***", start: 3, end: 4 })).toMatchObject({ bold: true, italic: true });
    expect(detectFormat({ value: "# t", start: 2, end: 2 }).heading).toBe(1);
    expect(detectFormat({ value: "## t", start: 3, end: 3 }).heading).toBe(2);
    expect(detectFormat({ value: "### t", start: 4, end: 4 }).heading).toBe(3);
    expect(detectFormat({ value: "- a", start: 2, end: 2 }).bullet).toBe(true);
    expect(detectFormat({ value: "1. a", start: 3, end: 3 }).numbered).toBe(true);
    expect(detectFormat({ value: "> a", start: 3, end: 3 }).quote).toBe(true);
    expect(detectFormat({ value: "[a](https://x.com)", start: 1, end: 2 }).link).toBe(true);
  });
});
