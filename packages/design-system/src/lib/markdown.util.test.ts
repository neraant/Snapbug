import type { MarkdownInline } from "@workspace/design-system/lib/markdown.util";
import { parseMarkdown, safeMarkdownHref } from "@workspace/design-system/lib/markdown.util";
import { describe, expect, it } from "vitest";

function text(value: string): MarkdownInline {
  return { type: "text", text: value };
}

function paragraph(source: string): MarkdownInline[] {
  const blocks = parseMarkdown(source);
  expect(blocks).toEqual([{ type: "paragraph", children: expect.any(Array) }]);
  const block = blocks[0];
  if (!block || block.type !== "paragraph") return [];
  return block.children;
}

describe("parseMarkdown blocks", () => {
  it("parses headings and leaves a hashtag as a paragraph", () => {
    expect(parseMarkdown("# Title")).toEqual([{ type: "heading", level: 1, children: [text("Title")] }]);
    expect(parseMarkdown("## Title")).toEqual([{ type: "heading", level: 2, children: [text("Title")] }]);
    expect(parseMarkdown("### Title")).toEqual([{ type: "heading", level: 3, children: [text("Title")] }]);
    expect(parseMarkdown("#### x")).toEqual([{ type: "heading", level: 3, children: [text("x")] }]);
    expect(paragraph("#hashtag")).toEqual([text("#hashtag")]);
    expect(parseMarkdown("# C#")).toEqual([{ type: "heading", level: 1, children: [text("C#")] }]);
  });

  it("parses bullets, numbered lists, and a custom start", () => {
    expect(parseMarkdown("- a\n* b\n+ c")).toEqual([
      {
        type: "list",
        ordered: false,
        start: 1,
        items: [
          { content: [text("a")], children: [] },
          { content: [text("b")], children: [] },
          { content: [text("c")], children: [] },
        ],
      },
    ]);
    expect(parseMarkdown("3. c")).toEqual([
      { type: "list", ordered: true, start: 3, items: [{ content: [text("c")], children: [] }] },
    ]);
  });

  it("parses a nested list and a lazy continuation", () => {
    expect(parseMarkdown("- a\n  - b")).toEqual([
      {
        type: "list",
        ordered: false,
        start: 1,
        items: [
          {
            content: [text("a")],
            children: [{ type: "list", ordered: false, start: 1, items: [{ content: [text("b")], children: [] }] }],
          },
        ],
      },
    ]);
    expect(parseMarkdown("- a\nb")).toEqual([
      { type: "list", ordered: false, start: 1, items: [{ content: [text("a\nb")], children: [] }] },
    ]);
  });

  it("parses a quote that contains a list or a heading", () => {
    const quotedList = parseMarkdown("> - a\n> - b");
    expect(quotedList).toEqual([
      {
        type: "quote",
        children: [
          {
            type: "list",
            ordered: false,
            start: 1,
            items: [
              { content: [text("a")], children: [] },
              { content: [text("b")], children: [] },
            ],
          },
        ],
      },
    ]);
    expect(parseMarkdown("> # Title")).toEqual([
      { type: "quote", children: [{ type: "heading", level: 1, children: [text("Title")] }] },
    ]);
  });

  it("parses fenced code, an unterminated fence, and a rule", () => {
    expect(parseMarkdown("```ts\nconst x = 1\n```")).toEqual([{ type: "code", lang: "ts", text: "const x = 1" }]);
    expect(parseMarkdown("```\nconst x = 1")).toEqual([{ type: "code", lang: null, text: "const x = 1" }]);
    expect(parseMarkdown("---")).toEqual([{ type: "rule" }]);
  });

  it("returns nothing for empty input and normalizes carriage returns", () => {
    expect(parseMarkdown("")).toEqual([]);
    expect(parseMarkdown("  \n\t")).toEqual([]);
    expect(parseMarkdown("hello\r\n\r\nworld")).toEqual([
      { type: "paragraph", children: [text("hello")] },
      { type: "paragraph", children: [text("world")] },
    ]);
  });
});

describe("parseMarkdown inline", () => {
  it("parses emphasis, code, and escapes without flanking mistakes", () => {
    expect(paragraph("**b**")).toEqual([{ type: "bold", children: [text("b")] }]);
    expect(paragraph("*i*")).toEqual([{ type: "italic", children: [text("i")] }]);
    expect(paragraph("***bi***")).toEqual([{ type: "bold", children: [{ type: "italic", children: [text("bi")] }] }]);
    expect(paragraph("*a **b** c*")).toEqual([
      {
        type: "italic",
        children: [text("a "), { type: "bold", children: [text("b")] }, text(" c")],
      },
    ]);
    expect(paragraph("2 * 3 * 4")).toEqual([text("2 * 3 * 4")]);
    expect(paragraph("snake_case_word")).toEqual([text("snake_case_word")]);
    expect(paragraph("_i_")).toEqual([{ type: "italic", children: [text("i")] }]);
    expect(paragraph("\\*literal\\*")).toEqual([text("*literal*")]);
    expect(paragraph("`code`")).toEqual([{ type: "code", text: "code" }]);
    expect(paragraph("``a`b``")).toEqual([{ type: "code", text: "a`b" }]);
  });

  it("parses links with balanced parentheses, titles, emphasis, and bare urls", () => {
    expect(paragraph("[a](https://x.com/a_(b))")).toEqual([
      { type: "link", href: "https://x.com/a_(b)", children: [text("a")] },
    ]);
    expect(paragraph('[a](url "title")')).toEqual([{ type: "link", href: "url", children: [text("a")] }]);
    expect(paragraph("[**b**](url)")).toEqual([
      { type: "link", href: "url", children: [{ type: "bold", children: [text("b")] }] },
    ]);
    expect(paragraph("https://x.com/a.")).toEqual([
      { type: "link", href: "https://x.com/a", children: [text("https://x.com/a")] },
      text("."),
    ]);
    expect(paragraph("https://x.com/a_b")).toEqual([
      { type: "link", href: "https://x.com/a_b", children: [text("https://x.com/a_b")] },
    ]);
  });
});

describe("safeMarkdownHref", () => {
  it("allows http, mailto, and bare domains, and rejects scripts", () => {
    expect(safeMarkdownHref("javascript:alert(1)")).toBeNull();
    expect(safeMarkdownHref("data:text/html,x")).toBeNull();
    expect(safeMarkdownHref("JaVaScRiPt:x")).toBeNull();
    expect(safeMarkdownHref("vbscript:msgbox")).toBeNull();
    expect(safeMarkdownHref("https://a.b")).toBe("https://a.b");
    expect(safeMarkdownHref("mailto:a@b.c")).toBe("mailto:a@b.c");
    expect(safeMarkdownHref("a.com/x")).toBe("https://a.com/x");
  });
});
