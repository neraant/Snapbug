export type EditState = { value: string; start: number; end: number };

/** Replace value[from..to] with `insert`, then select [selStart..selEnd] (absolute offsets in the new value). */
export type EditPatch = {
  from: number;
  to: number;
  insert: string;
  selStart: number;
  selEnd: number;
};

export type FormatState = {
  bold: boolean;
  italic: boolean;
  heading: 0 | 1 | 2 | 3;
  bullet: boolean;
  numbered: boolean;
  quote: boolean;
  link: boolean;
};

const BULLET = /^([-*+]) /;
const NUMBERED = /^\d+[.)] /;
const QUOTE = /^> ?/;
const HEADING = /^(#{1,6}) /;

function lineBounds(value: string, start: number, end: number) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const effectiveEnd = end > start && value[end - 1] === "\n" ? end - 1 : end;
  const nl = value.indexOf("\n", effectiveEnd);
  return { lineStart, lineEnd: nl === -1 ? value.length : nl };
}

function runBefore(value: string, index: number, ch: string) {
  let n = 0;
  while (index - 1 - n >= 0 && value[index - 1 - n] === ch) n += 1;
  return n;
}

function runAfter(value: string, index: number, ch: string) {
  let n = 0;
  while (value[index + n] === ch) n += 1;
  return n;
}

function expandToWord(value: string, pos: number): [number, number] {
  let s = pos;
  let e = pos;
  while (s > 0 && /[^\s*]/.test(value[s - 1]!)) s -= 1;
  while (e < value.length && /[^\s*]/.test(value[e]!)) e += 1;
  return [s, e];
}

/** Bold = `**`, italic = `*`. `***x***` is both. */
export function toggleInline(state: EditState, kind: "bold" | "italic"): EditPatch {
  const marker = kind === "bold" ? "**" : "*";
  let { start, end } = state;
  const { value } = state;

  if (start === end) [start, end] = expandToWord(value, start);

  while (start < end && /\s/.test(value[start]!)) start += 1;
  while (end > start && /\s/.test(value[end - 1]!)) end -= 1;

  if (start === end) {
    const caret = state.start + marker.length;
    return {
      from: state.start,
      to: state.end,
      insert: marker + marker,
      selStart: caret,
      selEnd: caret,
    };
  }

  const before = runBefore(value, start, "*");
  const after = runAfter(value, end, "*");
  const around = Math.min(before, after);
  const active = kind === "bold" ? around >= 2 : around % 2 === 1;

  if (active) {
    const strip = marker.length;
    return {
      from: start - strip,
      to: end + strip,
      insert: value.slice(start, end),
      selStart: start - strip,
      selEnd: end - strip,
    };
  }
  return {
    from: start,
    to: end,
    insert: marker + value.slice(start, end) + marker,
    selStart: start + marker.length,
    selEnd: end + marker.length,
  };
}

type LineKind = "bullet" | "numbered" | "quote";

export function toggleLines(state: EditState, kind: LineKind): EditPatch {
  const { lineStart, lineEnd } = lineBounds(state.value, state.start, state.end);
  const lines = state.value.slice(lineStart, lineEnd).split("\n");
  const own = kind === "bullet" ? BULLET : kind === "numbered" ? NUMBERED : QUOTE;
  const content = lines.filter((line) => line.trim().length > 0);
  const targets = content.length > 0 ? content : lines;
  const allActive = targets.every((line) => own.test(line));

  let counter = 1;
  const next = lines.map((line) => {
    if (line.trim().length === 0 && content.length > 0) return line;
    if (allActive) return line.replace(own, "");
    if (kind === "quote") return QUOTE.test(line) ? line : `> ${line}`;
    const bare = line.replace(BULLET, "").replace(NUMBERED, "");
    if (kind === "bullet") return `- ${bare}`;
    return `${counter++}. ${bare}`;
  });
  const insert = next.join("\n");
  return {
    from: lineStart,
    to: lineEnd,
    insert,
    selStart: lineStart,
    selEnd: lineStart + insert.length,
  };
}

export function setHeading(state: EditState, level: 0 | 1 | 2 | 3): EditPatch {
  const { lineStart, lineEnd } = lineBounds(state.value, state.start, state.end);
  const lines = state.value.slice(lineStart, lineEnd).split("\n");
  const next = lines.map((line) => {
    const bare = line.replace(HEADING, "");
    if (level === 0 || bare.trim().length === 0) return bare;
    return `${"#".repeat(level)} ${bare}`;
  });
  const insert = next.join("\n");
  return {
    from: lineStart,
    to: lineEnd,
    insert,
    selStart: lineStart,
    selEnd: lineStart + insert.length,
  };
}

const UNSAFE_URL = /^\s*(javascript|data|vbscript):/i;

export function normalizeUrl(raw: string): string | null {
  const url = raw.trim();
  if (url.length === 0 || UNSAFE_URL.test(url)) return null;
  return url.replace(/\s/g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
}

/** Matches `[label](href)` on the caret's line that contains [start..end]. */
export function findLinkAt(value: string, start: number, end: number) {
  const { lineStart, lineEnd } = lineBounds(value, start, end);
  const re = /\[([^\]]*)\]\(([^)\s]*)[^)]*\)/g;
  const line = value.slice(lineStart, lineEnd);
  for (let match = re.exec(line); match; match = re.exec(line)) {
    const from = lineStart + match.index;
    const to = from + match[0].length;
    if (start >= from && end <= to) return { from, to, label: match[1]!, href: match[2]! };
  }
  return null;
}

export function applyLink(state: EditState, rawUrl: string): EditPatch | null {
  const href = normalizeUrl(rawUrl);
  if (!href) return null;
  const existing = findLinkAt(state.value, state.start, state.end);
  const from = existing?.from ?? state.start;
  const to = existing?.to ?? state.end;
  const label = (existing?.label ?? state.value.slice(state.start, state.end)) || href;
  const safeLabel = label.replace(/[[\]]/g, "\\$&");
  const insert = `[${safeLabel}](${href})`;
  return {
    from,
    to,
    insert,
    selStart: from + 1,
    selEnd: from + 1 + safeLabel.length,
  };
}

export function removeLink(state: EditState): EditPatch | null {
  const existing = findLinkAt(state.value, state.start, state.end);
  if (!existing) return null;
  return {
    from: existing.from,
    to: existing.to,
    insert: existing.label,
    selStart: existing.from,
    selEnd: existing.from + existing.label.length,
  };
}

/** Enter inside a list or quote line: continue the markup, or leave it when the item is empty. */
export function continueMarkup(state: EditState): EditPatch | null {
  if (state.start !== state.end) return null;
  const { value, start } = state;
  const { lineStart, lineEnd } = lineBounds(value, start, start);
  const line = value.slice(lineStart, lineEnd);

  const bullet = /^(\s*)([-*+]) (.*)$/.exec(line);
  const numbered = /^(\s*)(\d+)([.)]) (.*)$/.exec(line);
  const quote = /^(> ?)(.*)$/.exec(line);

  let prefixLength: number;
  let body: string;
  let nextPrefix: string;
  if (bullet) {
    prefixLength = bullet[1]!.length + 2;
    body = bullet[3]!;
    nextPrefix = `${bullet[1]}${bullet[2]} `;
  } else if (numbered) {
    prefixLength = numbered[1]!.length + numbered[2]!.length + 2;
    body = numbered[4]!;
    nextPrefix = `${numbered[1]}${Number(numbered[2]) + 1}${numbered[3]} `;
  } else if (quote) {
    prefixLength = quote[1]!.length;
    body = quote[2]!;
    nextPrefix = "> ";
  } else {
    return null;
  }

  if (start - lineStart < prefixLength) return null;
  if (body.trim().length === 0) {
    return {
      from: lineStart,
      to: lineEnd,
      insert: "",
      selStart: lineStart,
      selEnd: lineStart,
    };
  }
  const insert = `\n${nextPrefix}`;
  const caret = start + insert.length;
  return { from: start, to: start, insert, selStart: caret, selEnd: caret };
}

export function detectFormat(state: EditState): FormatState {
  const { value, start, end } = state;
  const { lineStart, lineEnd } = lineBounds(value, start, end);
  const line = value.slice(lineStart, lineEnd);
  const heading = HEADING.exec(line);
  const around = Math.min(runBefore(value, start, "*"), runAfter(value, end, "*"));
  return {
    bold: around >= 2,
    italic: around % 2 === 1,
    heading: heading ? (Math.min(heading[1]!.length, 3) as 1 | 2 | 3) : 0,
    bullet: BULLET.test(line),
    numbered: NUMBERED.test(line),
    quote: QUOTE.test(line),
    link: findLinkAt(value, start, end) !== null,
  };
}

export function isDescriptionEmptyValue(value: string) {
  return value.trim().length === 0;
}
