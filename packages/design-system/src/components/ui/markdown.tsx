import { Column } from "@workspace/design-system/components/layout/column";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { MarkdownBlock, MarkdownInline as MarkdownInlineNode } from "@workspace/design-system/lib/markdown.util";
import { parseMarkdown, safeMarkdownHref } from "@workspace/design-system/lib/markdown.util";
import type { ReactNode } from "react";

type MarkdownProps = {
  source: string;
};

const HEADING_VARIANT = {
  1: "heading-sm",
  2: "heading-xs",
  3: "text-sm",
} as const;

export function Markdown({ source }: MarkdownProps) {
  const blocks = parseMarkdown(source);
  return (
    <div className="min-w-0 [overflow-wrap:anywhere] break-words">
      <MarkdownBlocks blocks={blocks} />
    </div>
  );
}

function MarkdownBlocks({ blocks, inheritColor = false }: { blocks: MarkdownBlock[]; inheritColor?: boolean }) {
  return (
    <Column gap="sm" width="full" minWidth="0">
      {blocks.map((block, index) => (
        <MarkdownBlockView key={`${block.type}-${index}`} block={block} inheritColor={inheritColor} />
      ))}
    </Column>
  );
}

function MarkdownBlockView({ block, inheritColor }: { block: MarkdownBlock; inheritColor: boolean }) {
  const color = inheritColor ? "inherit" : undefined;

  switch (block.type) {
    case "heading":
      return (
        <Typography
          variant={HEADING_VARIANT[block.level]}
          weight={block.level === 3 ? "semibold" : undefined}
          color={color}
        >
          <MarkdownInline nodes={block.children} />
        </Typography>
      );
    case "list":
      return block.ordered ? (
        <ol start={block.start} className="list-decimal pl-5">
          <MarkdownListItems items={block.items} inheritColor={inheritColor} />
        </ol>
      ) : (
        <ul className="list-disc pl-5">
          <MarkdownListItems items={block.items} inheritColor={inheritColor} />
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-border pl-3 text-muted-foreground">
          <MarkdownBlocks blocks={block.children} inheritColor />
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-md bg-muted p-3">
          <Typography as="code" variant="text-xs" font="mono">
            {block.text}
          </Typography>
        </pre>
      );
    case "rule":
      return <hr className="border-border" />;
    default:
      return (
        <Typography variant="text-sm" color={color} className="whitespace-pre-wrap">
          <MarkdownInline nodes={block.children} />
        </Typography>
      );
  }
}

function MarkdownListItems({
  items,
  inheritColor,
}: {
  items: Extract<MarkdownBlock, { type: "list" }>["items"];
  inheritColor: boolean;
}) {
  return items.map((item, index) => (
    <Typography
      key={index}
      as="li"
      variant="text-sm"
      color={inheritColor ? "inherit" : undefined}
      className="whitespace-pre-wrap"
    >
      <MarkdownInline nodes={item.content} />
      {item.children.length > 0 ? (
        <div className="mt-1">
          <MarkdownBlocks blocks={item.children} inheritColor={inheritColor} />
        </div>
      ) : null}
    </Typography>
  ));
}

function MarkdownInline({ nodes }: { nodes: MarkdownInlineNode[] }) {
  return nodes.map((node, index) => renderInline(node, index));
}

function renderInline(node: MarkdownInlineNode, index: number): ReactNode {
  if (node.type === "text") return node.text;

  if (node.type === "bold") {
    return (
      <strong key={index}>
        <MarkdownInline nodes={node.children} />
      </strong>
    );
  }

  if (node.type === "italic") {
    return (
      <em key={index}>
        <MarkdownInline nodes={node.children} />
      </em>
    );
  }

  if (node.type === "code") {
    return (
      <Typography key={index} as="code" variant="text-xs" font="mono" className="rounded bg-muted px-1 py-0.5">
        {node.text}
      </Typography>
    );
  }

  const href = safeMarkdownHref(node.href);
  if (!href) {
    return <MarkdownInline key={index} nodes={node.children} />;
  }

  return (
    <a key={index} href={href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
      <MarkdownInline nodes={node.children} />
    </a>
  );
}
