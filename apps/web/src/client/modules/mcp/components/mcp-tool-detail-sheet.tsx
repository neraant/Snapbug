import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge } from "@workspace/design-system/components/ui/badge";
import { Button } from "@workspace/design-system/components/ui/button";
import { Code } from "@workspace/design-system/components/ui/code";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@workspace/design-system/components/ui/sheet";
import { Table } from "@workspace/design-system/components/ui/table";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { useCopyText } from "@workspace/design-system/hooks/use-copy-text";
import type { McpToolDtoType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import { CheckIcon, CopyIcon } from "lucide-react";

import { texts } from "@/client/modules/mcp/consts/texts.const";

type McpToolDetailSheetProps = {
  tool: McpToolDtoType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function McpToolDetailSheet({ tool, open, onOpenChange }: McpToolDetailSheetProps) {
  const { copied: promptCopied, copy: copyPrompt } = useCopyText();

  if (!tool) return null;

  const exampleCall = tool.exampleCall;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton>
        <SheetHeader>
          <Column gap="sm" className="pr-8">
            <Row align="center" gap="sm" wrap>
              <SheetTitle className="text-left font-mono">{tool.name}</SheetTitle>
              <Badge variant={tool.access === "write" ? "warning" : "secondary"}>
                {tool.access === "write" ? texts.tools.writeBadge : texts.tools.readBadge}
              </Badge>
              {tool.adminOnly ? <Badge variant="outline">{texts.tools.adminBadge}</Badge> : null}
            </Row>
            <Typography variant="text-sm" color="muted" className="text-left">
              {tool.description}
            </Typography>
          </Column>
        </SheetHeader>
        <SheetBody>
          <Column gap="lg" width="full">
            <Column gap="sm" width="full">
              <Typography variant="label">{texts.tools.detail.inputs}</Typography>
              {tool.inputs.length === 0 ? (
                <Typography variant="text-sm" color="muted">
                  {texts.tools.detail.noInputs}
                </Typography>
              ) : (
                <Table.Shell>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>{texts.tools.detail.columnName}</Table.Head>
                        <Table.Head>{texts.tools.detail.columnType}</Table.Head>
                        <Table.Head>{texts.tools.detail.columnRequired}</Table.Head>
                        <Table.Head>{texts.tools.detail.columnDescription}</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {tool.inputs.map((field) => (
                        <Table.Row key={field.name}>
                          <Table.Cell>
                            <Typography variant="text-sm" font="mono">
                              {field.name}
                            </Typography>
                          </Table.Cell>
                          <Table.Cell>
                            <Typography variant="text-sm" color="muted">
                              {field.type}
                            </Typography>
                          </Table.Cell>
                          <Table.Cell>
                            <Typography variant="text-sm" color="muted">
                              {field.required ? texts.tools.detail.requiredYes : texts.tools.detail.requiredNo}
                            </Typography>
                          </Table.Cell>
                          <Table.Cell>
                            <Typography variant="text-sm" color="muted">
                              {field.description ?? "—"}
                            </Typography>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Table.Shell>
              )}
            </Column>

            <Column gap="xs" width="full">
              <Typography variant="label">{texts.tools.detail.returns}</Typography>
              <Typography variant="text-sm" color="muted">
                {tool.returns}
              </Typography>
            </Column>

            <Column gap="sm" width="full">
              <Row align="center" justify="between" gap="sm" width="full">
                <Typography variant="label">{texts.tools.detail.examplePrompt}</Typography>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPrompt(tool.examplePrompt)}
                  aria-label={texts.tools.detail.copy}
                >
                  {promptCopied ? <CheckIcon /> : <CopyIcon />}
                  {promptCopied ? texts.tools.detail.copied : texts.tools.detail.copy}
                </Button>
              </Row>
              <Typography variant="text-sm">{tool.examplePrompt}</Typography>
            </Column>

            <Code
              title={texts.tools.detail.exampleCall}
              code={exampleCall}
              copyLabel={texts.tools.detail.copy}
              copiedLabel={texts.tools.detail.copied}
            />
          </Column>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
