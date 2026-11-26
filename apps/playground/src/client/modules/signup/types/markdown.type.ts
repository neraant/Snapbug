export type MarkdownInline =
  | { type: "text"; text: string }
  | { type: "code"; text: string }
  | { type: "bold"; text: string }
  | { type: "italic"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "break" };

export type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; children: MarkdownInline[] }
  | { type: "list"; items: MarkdownInline[][] }
  | { type: "paragraph"; children: MarkdownInline[] };
