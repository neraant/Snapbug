import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { ToolbarRow } from "@workspace/design-system/components/layout/toolbar-row";
import { Card } from "@workspace/design-system/components/ui/card";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps, ElementType, ReactNode } from "react";

function Panel({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card data-slot="panel" padding="none" gap="none" className={cn("min-w-0", className)} {...props} />;
}

type PanelHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ElementType;
};

function PanelHeader({ title, description, action, icon: Icon }: PanelHeaderProps) {
  return (
    <>
      <Column padding="md">
        <ToolbarRow
          trailingAlign="end"
          leading={
            <Column gap="xs" minWidth="0">
              <Row align="center" gap="sm" wrap={false}>
                {Icon ? <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" /> : null}
                <Typography variant="heading-xs">{title}</Typography>
              </Row>
              {description ? (
                <Typography variant="text-sm" color="muted">
                  {description}
                </Typography>
              ) : null}
            </Column>
          }
          trailing={action}
        />
      </Column>
      <Separator />
    </>
  );
}

function PanelContent({ className, padding = "md", ...props }: ComponentProps<typeof Card.Content>) {
  return <Card.Content padding={padding} className={cn("min-w-0", className)} {...props} />;
}

Panel.Header = PanelHeader;
Panel.Content = PanelContent;

export { Panel, PanelContent, PanelHeader };
