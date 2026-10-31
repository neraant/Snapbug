export type MarkdownInline =
  | { type: "text"; text: string }
  | { type: "bold"; children: MarkdownInline[] }
  | { type: "italic"; children: MarkdownInline[] }
  | { type: "code"; text: string }
  | { type: "link"; href: string; children: MarkdownInline[] };

export type MarkdownListItem = {
  content: MarkdownInline[];
  children: MarkdownBlock[];
};

export type MarkdownBlock =
  | { type: "paragraph"; children: MarkdownInline[] }
  | { type: "heading"; level: 1 | 2 | 3; children: MarkdownInline[] }
  | { type: "list"; ordered: boolean; start: number; items: MarkdownListItem[] }
  | { type: "quote"; children: MarkdownBlock[] }
  | { type: "code"; lang: string | null; text: string }
  | { type: "rule" };

const FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)[ \t]*$/;
const HEADING_LINE = /^ {0,3}(#{1,6})[ \t]+(.*?)[ \t]*$/;
const RULE_LINE = /^ {0,3}([-*_])([ \t]*\1){2,}[ \t]*$/;
const QUOTE_LINE = /^ {0,3}>/;
const BULLET_ITEM = /^( *)([-*+])[ \t]+(.*)$/;
const ORDERED_ITEM = /^( *)(\d{1,9})[.)][ \t]+(.*)$/;
const ESCAPABLE = "\\`*_[]()#+-.!>~|";

type ListMatch = {
  indent: number;
  ordered: boolean;
  number: number;
  text: string;
};

export function parseMarkdown(source: string): MarkdownBlock[] {
  return parseBlocks(source.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n"));
}

export function safeMarkdownHref(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.length === 0 || /^(javascript|data):/i.test(trimmed)) return null;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}([/?#].*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return null;
}

function matchListItem(line: string): ListMatch | null {
  if (RULE_LINE.test(line)) return null;
  const bullet = BULLET_ITEM.exec(line);
  if (bullet) return { indent: bullet[1]!.length, ordered: false, number: 1, text: bullet[3]! };
  const ordered = ORDERED_ITEM.exec(line);
  if (ordered) {
    return {
      indent: ordered[1]!.length,
      ordered: true,
      number: Number(ordered[2]),
      text: ordered[3]!,
    };
  }
  return null;
}

function startsBlock(line: string): boolean {
  return (
    FENCE.test(line) ||
    HEADING_LINE.test(line) ||
    RULE_LINE.test(line) ||
    QUOTE_LINE.test(line) ||
    matchListItem(line) !== null
  );
}

function parseBlocks(lines: string[]): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim().length === 0) {
      i += 1;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const marker = fence[1]!;
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !isFenceClose(lines[i] ?? "", marker)) {
        body.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      blocks.push({
        type: "code",
        lang: fence[2] || null,
        text: body.join("\n"),
      });
      continue;
    }

    const heading = HEADING_LINE.exec(line);
    if (heading) {
      const level = Math.min(heading[1]!.length, 3) as 1 | 2 | 3;
      blocks.push({
        type: "heading",
        level,
        children: parseMarkdownInline(heading[2] ?? ""),
      });
      i += 1;
      continue;
    }

    if (RULE_LINE.test(line)) {
      blocks.push({ type: "rule" });
      i += 1;
      continue;
    }

    if (QUOTE_LINE.test(line)) {
      const inner: string[] = [];
      while (i < lines.length && QUOTE_LINE.test(lines[i] ?? "")) {
        inner.push((lines[i] ?? "").replace(/^ {0,3}> ?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", children: parseBlocks(inner) });
      continue;
    }

    const listItem = matchListItem(line);
    if (listItem) {
      const parsed = parseList(lines, i, listItem);
      blocks.push(parsed.block);
      i = parsed.next;
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      (lines[i] ?? "").trim().length > 0 &&
      (paragraph.length === 0 || !startsBlock(lines[i] ?? ""))
    ) {
      paragraph.push(lines[i] ?? "");
      i += 1;
    }
    blocks.push({
      type: "paragraph",
      children: parseMarkdownInline(paragraph.join("\n")),
    });
  }
  return blocks;
}

function isFenceClose(line: string, marker: string): boolean {
  const trimmed = line.trim();
  const markerChar = marker[0];
  if (!markerChar) return false;
  return trimmed.length >= marker.length && trimmed === markerChar.repeat(trimmed.length);
}

function leadingSpaces(line: string): number {
  return line.length - line.trimStart().length;
}

function parseList(lines: string[], start: number, first: ListMatch): { block: MarkdownBlock; next: number } {
  const base = first.indent;
  const items: MarkdownListItem[] = [];
  let i = start;

  while (i < lines.length) {
    const match = matchListItem(lines[i] ?? "");
    if (!match || match.ordered !== first.ordered || match.indent >= base + 2 || match.indent < base) break;

    const lazy: string[] = [match.text];
    const nested: string[] = [];
    i += 1;

    while (i < lines.length) {
      const line = lines[i] ?? "";
      if (line.trim().length === 0) {
        const nextLine = lines.slice(i + 1).find((candidate) => candidate.trim().length > 0);
        const sibling = nextLine ? matchListItem(nextLine) : null;
        const belongs =
          nextLine !== undefined &&
          (leadingSpaces(nextLine) >= base + 2 ||
            (sibling !== null &&
              sibling.ordered === first.ordered &&
              sibling.indent >= base &&
              sibling.indent < base + 2));
        if (!belongs) break;
        if (nested.length > 0) nested.push("");
        i += 1;
        continue;
      }
      if (leadingSpaces(line) >= base + 2) {
        nested.push(line.replace(new RegExp(`^ {0,${base + 2}}`), ""));
        i += 1;
        continue;
      }
      const sibling = matchListItem(line);
      if (sibling && sibling.indent < base + 2) break;
      if (startsBlock(line)) break;
      (nested.length > 0 ? nested : lazy).push(line.trim());
      i += 1;
    }

    items.push({
      content: parseMarkdownInline(lazy.join("\n")),
      children: parseBlocks(nested),
    });
  }

  return {
    block: { type: "list", ordered: first.ordered, start: first.number, items },
    next: i,
  };
}

export function parseMarkdownInline(source: string): MarkdownInline[] {
  const nodes: MarkdownInline[] = [];
  let buffer = "";
  let i = 0;
  const flush = () => {
    if (buffer.length === 0) return;
    nodes.push({ type: "text", text: buffer });
    buffer = "";
  };

  while (i < source.length) {
    const ch = source[i]!;

    if (ch === "\\" && i + 1 < source.length && ESCAPABLE.includes(source[i + 1]!)) {
      buffer += source[i + 1];
      i += 2;
      continue;
    }

    if (ch === "`") {
      const run = runLength(source, i, "`");
      const close = findRun(source, i + run, "`", run);
      if (close !== -1) {
        flush();
        nodes.push({
          type: "code",
          text: source.slice(i + run, close).replace(/^ (.*) $/s, "$1"),
        });
        i = close + run;
        continue;
      }
      buffer += "`".repeat(run);
      i += run;
      continue;
    }

    if (ch === "*" || ch === "_") {
      const emphasis = readEmphasis(source, i);
      if (emphasis) {
        flush();
        nodes.push(emphasis.node);
        i = emphasis.next;
        continue;
      }
      buffer += ch;
      i += 1;
      continue;
    }

    if (ch === "[") {
      const link = readLink(source, i);
      if (link) {
        flush();
        nodes.push({
          type: "link",
          href: link.href,
          children: parseMarkdownInline(link.label),
        });
        i = link.next;
        continue;
      }
    }

    if (ch === "h" && (i === 0 || !/\w/.test(source[i - 1]!))) {
      const url = readBareUrl(source, i);
      if (url) {
        flush();
        nodes.push({
          type: "link",
          href: url,
          children: [{ type: "text", text: url }],
        });
        i += url.length;
        continue;
      }
    }

    buffer += ch;
    i += 1;
  }
  flush();
  return nodes;
}

function runLength(source: string, index: number, ch: string) {
  let n = 0;
  while (source[index + n] === ch) n += 1;
  return n;
}

function findRun(source: string, from: number, ch: string, len: number): number {
  for (let index = from; index < source.length; index += 1) {
    if (source[index] !== ch) continue;
    const run = runLength(source, index, ch);
    if (run === len) return index;
    index += run - 1;
  }
  return -1;
}

function readEmphasis(source: string, index: number): { node: MarkdownInline; next: number } | null {
  const ch = source[index]!;
  const run = Math.min(runLength(source, index, ch), 3);
  const after = source[index + run];
  if (after === undefined || /\s/.test(after)) return null;
  if (ch === "_" && index > 0 && /\w/.test(source[index - 1]!)) return null;
  const marker = ch.repeat(run);

  let close = index + run;
  for (;;) {
    close = source.indexOf(marker, close);
    if (close === -1) return null;
    const before = source[close - 1];
    const next = source[close + run];
    const ok =
      close > index + run &&
      before !== undefined &&
      !/\s/.test(before) &&
      before !== ch &&
      next !== ch &&
      (ch !== "_" || next === undefined || !/\w/.test(next));
    if (ok) break;
    close += 1;
  }

  const children = parseMarkdownInline(source.slice(index + run, close));
  const node: MarkdownInline =
    run === 1
      ? { type: "italic", children }
      : run === 2
        ? { type: "bold", children }
        : { type: "bold", children: [{ type: "italic", children }] };
  return { node, next: close + run };
}

function readLink(source: string, index: number): { label: string; href: string; next: number } | null {
  let depth = 0;
  let labelEnd = -1;
  for (let cursor = index; cursor < source.length; cursor += 1) {
    if (source[cursor] === "\\") {
      cursor += 1;
      continue;
    }
    if (source[cursor] === "[") depth += 1;
    if (source[cursor] === "]") {
      depth -= 1;
      if (depth === 0) {
        labelEnd = cursor;
        break;
      }
    }
  }
  if (labelEnd === -1 || source[labelEnd + 1] !== "(") return null;

  let paren = 1;
  let end = -1;
  for (let cursor = labelEnd + 2; cursor < source.length; cursor += 1) {
    if (source[cursor] === "\\") {
      cursor += 1;
      continue;
    }
    if (source[cursor] === "(") paren += 1;
    if (source[cursor] === ")") {
      paren -= 1;
      if (paren === 0) {
        end = cursor;
        break;
      }
    }
  }
  if (end === -1) return null;

  const inner = source.slice(labelEnd + 2, end).trim();
  const match = /^<?([^\s>]+)>?(?:\s+(["']).*\2)?$/s.exec(inner);
  if (!match) return null;
  return { label: source.slice(index + 1, labelEnd), href: match[1]!, next: end + 1 };
}

function readBareUrl(source: string, index: number): string | null {
  const match = /^https?:\/\/[^\s<>]+/.exec(source.slice(index));
  if (!match) return null;
  let url = match[0];
  for (;;) {
    const last = url[url.length - 1];
    if (last === undefined) break;
    const unbalancedParen = last === ")" && (url.match(/\)/g)?.length ?? 0) > (url.match(/\(/g)?.length ?? 0);
    if (/[.,;:!?'"\]]/.test(last) || unbalancedParen) url = url.slice(0, -1);
    else break;
  }
  return url.length > "https://".length ? url : null;
}
