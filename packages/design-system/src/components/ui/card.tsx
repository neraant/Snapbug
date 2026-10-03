import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps } from "react";

export function Card({ className, padding = "md", gap = "sm", ...props }: ComponentProps<typeof Column>) {
  return (
    <Column
      data-slot="card"
      padding={padding}
      gap={gap}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, gap = "xs", ...props }: ComponentProps<typeof Column>) {
  return <Column data-slot="card-header" gap={gap} className={className} {...props} />;
}

function CardTitle({ className, variant = "label", ...props }: ComponentProps<typeof Typography>) {
  return <Typography variant={variant} className={className} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<typeof Typography>) {
  return <Typography variant="text-sm" color="muted" className={className} {...props} />;
}

function CardAction({ className, ...props }: ComponentProps<typeof Row>) {
  return <Row data-slot="card-action" wrap={false} className={className} {...props} />;
}

function CardContent({ className, gap = "sm", ...props }: ComponentProps<typeof Column>) {
  return <Column data-slot="card-content" gap={gap} className={className} {...props} />;
}

function CardFooter({ className, ...props }: ComponentProps<typeof Row>) {
  return <Row data-slot="card-footer" align="center" className={cn("mt-auto", className)} {...props} />;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Action = CardAction;
Card.Content = CardContent;
Card.Footer = CardFooter;
