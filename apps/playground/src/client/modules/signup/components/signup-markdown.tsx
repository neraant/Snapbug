import { Column } from "@workspace/design-system/components/layout/column";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { ReactNode } from "react";

import type { MarkdownBlock, MarkdownInline } from "@/client/modules/signup/types/markdown.type";
import { parseMarkdown } from "@/client/modules/signup/utils/parse-markdown.util";

const HEADING_VARIANT = {
  1: "heading-sm",
  2: "heading-xs",
  3: "text-sm",
} as const;

type SignupMarkdownProps = {
  source: string;
};

export function SignupMarkdown({ source }: SignupMarkdownProps) {
  return (
    <Column gap="sm" width="full" minWidth="0">
      {parseMarkdown(source).map((block, index) => (
        <SignupMarkdownBlock key={`${block.type}-${index}`} block={block} />
      ))}
    </Column>
  );
}

function SignupMarkdownBlock({ block }: { block: MarkdownBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <Typography variant={HEADING_VARIANT[block.level]} weight={block.level === 3 ? "semibold" : undefined}>
          {block.children.map(renderInline)}
        </Typography>
      );
    case "list":
      return (
        <ul className="list-disc pl-5">
          {block.items.map((item, index) => (
            <Typography key={index} as="li" variant="text-sm">
              {item.map(renderInline)}
            </Typography>
          ))}
        </ul>
      );
    default:
      return <Typography variant="text-sm">{block.children.map(renderInline)}</Typography>;
  }
}

function renderInline(node: MarkdownInline, index: number): ReactNode {
  switch (node.type) {
    case "text":
      return node.text;
    case "code":
      return (
        <Typography key={index} as="code" variant="text-xs" font="mono">
          {node.text}
        </Typography>
      );
    case "bold":
      return <strong key={index}>{node.text}</strong>;
    case "italic":
      return <em key={index}>{node.text}</em>;
    case "link":
      return (
        <Typography
          key={index}
          as="a"
          variant="text-sm"
          color="primary"
          href={node.href}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-4"
        >
          {node.text}
        </Typography>
      );
    case "break":
      return <br key={index} />;
  }
}
