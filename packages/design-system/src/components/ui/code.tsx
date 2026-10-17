"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { CopyButton } from "@workspace/design-system/components/ui/copy-button";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import { cn } from "@workspace/design-system/lib/utils";
import { cva } from "class-variance-authority";

const codeRootVariants = cva(
  "overflow-hidden rounded-xl border border-border bg-muted font-mono text-xs text-foreground shadow-xs",
);

const codeHeaderVariants = cva("border-b border-border bg-muted/80 px-4 py-2");

const codeBodyVariants = cva("max-h-80 overflow-x-auto p-4 leading-relaxed");

type CodeProps = {
  title?: string;
  code: string;
  copyText?: string;
  copyLabel?: string;
  copiedLabel?: string;
  showCopy?: boolean;
  className?: string;
};

export function Code({
  title,
  code,
  copyText,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  showCopy = true,
  className,
}: CodeProps) {
  const { copied, copy } = useCopyText();

  const handleCopy = () => {
    copy(copyText ?? code);
  };

  const showHeader = title != null || showCopy;

  return (
    <Column className={cn(codeRootVariants(), className)} gap="none">
      {showHeader ? (
        <Row align="center" justify={title ? "between" : "end"} wrap={false} className={codeHeaderVariants()}>
          {title ? (
            <Typography variant="text-xs" color="muted" weight="medium" font="sans">
              {title}
            </Typography>
          ) : null}
          {showCopy ? (
            <CopyButton
              copied={copied}
              onCopy={handleCopy}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              variant="ghost"
              size="xs"
            />
          ) : null}
        </Row>
      ) : null}
      <Column className={codeBodyVariants()} gap="none">
        <Typography as="pre" variant="text-xs" font="mono" className="whitespace-pre">
          {code}
        </Typography>
      </Column>
    </Column>
  );
}
