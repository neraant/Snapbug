export const HEADING_CLASS = "snapbug-description-heading";
export const HEADING_LEVEL_1_CLASS = "snapbug-description-heading-1";
export const HEADING_LEVEL_2_CLASS = "snapbug-description-heading-2";
export const HEADING_LEVEL_3_CLASS = "snapbug-description-heading-3";
export const LIST_UL_CLASS = "snapbug-description-list-ul";
export const LIST_OL_CLASS = "snapbug-description-list-ol";
export const QUOTE_CLASS = "snapbug-description-quote";
export const LINK_CLASS = "snapbug-description-link";

const HEADING_PREFIX_BY_CLASS: Record<string, string> = {
  [HEADING_LEVEL_1_CLASS]: "# ",
  [HEADING_LEVEL_2_CLASS]: "## ",
  [HEADING_LEVEL_3_CLASS]: "### ",
};

export function serializeDescriptionFromDom(editor: HTMLElement): string {
  const lines: string[] = [];

  for (const child of Array.from(editor.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (text.length > 0) lines.push(text);
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const element = child as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (tag === "br") {
      lines.push("");
      continue;
    }

    if (tag === "ul" || element.classList.contains(LIST_UL_CLASS)) {
      appendBulletListLines(lines, element);
      continue;
    }

    if (tag === "ol" || element.classList.contains(LIST_OL_CLASS)) {
      appendNumberedListLines(lines, element);
      continue;
    }

    if (tag === "blockquote" || element.classList.contains(QUOTE_CLASS)) {
      appendQuoteLines(lines, element);
      continue;
    }

    lines.push(serializeParagraphBlock(element));
  }

  return lines.join("\n");
}

function appendBulletListLines(lines: string[], list: HTMLElement) {
  for (const item of listElements(list, "li")) {
    lines.push(`- ${serializeListItem(item)}`);
  }
}

function appendNumberedListLines(lines: string[], list: HTMLElement) {
  let index = 1;
  for (const item of listElements(list, "li")) {
    lines.push(`${index}. ${serializeListItem(item)}`);
    index += 1;
  }
}

function listElements(list: HTMLElement, tagName: string) {
  return Array.from(list.children).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === tagName,
  ) as HTMLElement[];
}

function serializeListItem(item: HTMLElement): string {
  return serializeInlineChildren(item);
}

function appendQuoteLines(lines: string[], quote: HTMLElement) {
  const blocks = quoteBlockChildren(quote);
  if (blocks.length === 0) {
    lines.push("> ");
    return;
  }

  for (const block of blocks) {
    const content = serializeQuoteBlockContent(block);
    lines.push(`> ${content}`);
  }
}

function quoteBlockChildren(quote: HTMLElement): HTMLElement[] {
  const blocks: HTMLElement[] = [];
  for (const child of Array.from(quote.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (text.trim().length > 0) {
        const wrap = document.createElement("div");
        wrap.textContent = text;
        blocks.push(wrap);
      }
      continue;
    }
    if (child.nodeType === Node.ELEMENT_NODE) blocks.push(child as HTMLElement);
  }
  return blocks;
}

function serializeQuoteBlockContent(block: HTMLElement): string {
  const tag = block.tagName.toLowerCase();
  if (tag === "ul" || block.classList.contains(LIST_UL_CLASS)) {
    return listElements(block, "li")
      .map((item) => `- ${serializeListItem(item)}`)
      .join("\n> ");
  }
  if (tag === "ol" || block.classList.contains(LIST_OL_CLASS)) {
    let index = 1;
    return listElements(block, "li")
      .map((item) => {
        const line = `${index}. ${serializeListItem(item)}`;
        index += 1;
        return line;
      })
      .join("\n> ");
  }
  return serializeParagraphBlock(block, { allowHeading: false });
}

function serializeParagraphBlock(element: HTMLElement, options: { allowHeading?: boolean } = {}): string {
  const allowHeading = options.allowHeading ?? true;
  const headingPrefix = allowHeading ? headingPrefixFor(element) : null;
  if (headingPrefix !== null) {
    return `${headingPrefix}${serializeInlineChildren(element)}`;
  }
  return serializeInlineChildren(element);
}

function headingPrefixFor(element: HTMLElement): string | null {
  if (!element.classList.contains(HEADING_CLASS)) return null;
  for (const [className, prefix] of Object.entries(HEADING_PREFIX_BY_CLASS)) {
    if (element.classList.contains(className)) return prefix;
  }
  return "# ";
}

function serializeInlineChildren(element: HTMLElement): string {
  return Array.from(element.childNodes)
    .map((node) => serializeInlineNode(node))
    .join("");
}

function serializeInlineNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === "br") return "\n";
  if (tag === "strong" || tag === "b") {
    const inner = serializeInlineChildren(element);
    return `**${inner}**`;
  }
  if (tag === "em" || tag === "i") {
    const inner = serializeInlineChildren(element);
    return `*${inner}*`;
  }
  if (tag === "a") {
    const href = element.getAttribute("href") ?? "";
    const inner = serializeInlineChildren(element);
    return `[${inner}](${href})`;
  }

  return serializeInlineChildren(element);
}

export function isDescriptionEmpty(serialized: string): boolean {
  if (serialized.trim().length === 0) return true;

  const lines = serialized.split("\n");
  for (const line of lines) {
    if (lineHasMeaningfulContent(line)) return false;
  }

  return true;
}

function lineHasMeaningfulContent(line: string): boolean {
  let content = line;
  content = content.replace(/^#{1,3}\s+/, "");
  content = content.replace(/^-\s+/, "");
  content = content.replace(/^\d+\.\s+/, "");
  content = content.replace(/^>\s+/, "");
  content = stripBoldMarkers(content);
  content = stripItalicMarkers(content);
  content = stripLinkMarkers(content);
  return content.trim().length > 0;
}

function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*([^*]*)\*\*/g, "$1");
}

function stripItalicMarkers(text: string): string {
  return text.replace(/\*([^*]+)\*/g, "$1");
}

function stripLinkMarkers(text: string): string {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}

export function headingLevelFromBlock(block: HTMLElement | null): 0 | 1 | 2 | 3 {
  if (!block || !block.classList.contains(HEADING_CLASS)) return 0;
  if (block.classList.contains(HEADING_LEVEL_3_CLASS)) return 3;
  if (block.classList.contains(HEADING_LEVEL_2_CLASS)) return 2;
  return 1;
}
