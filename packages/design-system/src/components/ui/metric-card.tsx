import { Column } from "@workspace/design-system/components/layout/column";
import { ToolbarRow } from "@workspace/design-system/components/layout/toolbar-row";
import { Card } from "@workspace/design-system/components/ui/card";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

function MetricCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card data-slot="metric-card" padding="none" gap="none" className={cn("min-w-0", className)} {...props} />;
}

type MetricCardHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

function MetricCardHeader({ title, description, action }: MetricCardHeaderProps) {
  return (
    <>
      <Column padding="md">
        <ToolbarRow
          trailingAlign="end"
          leading={
            <Column gap="xs" minWidth="0">
              <Typography variant="heading-xs">{title}</Typography>
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

function MetricCardContent({ className, padding = "md", ...props }: ComponentProps<typeof Card.Content>) {
  return <Card.Content padding={padding} className={cn("min-w-0", className)} {...props} />;
}

MetricCard.Header = MetricCardHeader;
MetricCard.Content = MetricCardContent;

export { MetricCard, MetricCardContent, MetricCardHeader };
