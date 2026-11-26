import type { MarkdownBlock, MarkdownInline } from "@/client/modules/signup/types/markdown.type";

const INLINE_PATTERN = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function parseInline(text: string): MarkdownInline[] {
  const nodes: MarkdownInline[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index;
    if (start > cursor) nodes.push({ type: "text", text: text.slice(cursor, start) });

    if (match[1] !== undefined) nodes.push({ type: "code", text: match[1] });
    else if (match[2] !== undefined) nodes.push({ type: "bold", text: match[2] });
    else if (match[3] !== undefined) nodes.push({ type: "italic", text: match[3] });
    else nodes.push({ type: "link", text: match[4] ?? "", href: match[5] ?? "" });

    cursor = start + match[0].length;
  }

  if (cursor < text.length) nodes.push({ type: "text", text: text.slice(cursor) });

  return nodes;
}

function parseParagraph(lines: string[]): MarkdownInline[] {
  return lines.flatMap((line, index): MarkdownInline[] => {
    const nodes = parseInline(line.trimEnd());
    if (index === lines.length - 1) return nodes;

    return line.endsWith("  ") ? [...nodes, { type: "break" }] : [...nodes, { type: "text", text: " " }];
  });
}

export function parseMarkdown(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let list: MarkdownInline[][] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ type: "paragraph", children: parseParagraph(paragraph) });
    paragraph = [];
  };

  const flushList = () => {
    if (list.length > 0) blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const line of source.replace(/\r\n/g, "\n").split("\n")) {
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    const item = /^[-*]\s+(.*)$/.exec(line);

    if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      const level = (heading[1]?.length ?? 1) as 1 | 2 | 3;
      blocks.push({ type: "heading", level, children: parseInline(heading[2] ?? "") });
    } else if (item) {
      flushParagraph();
      list.push(parseInline(item[1] ?? ""));
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();

  return blocks;
}
