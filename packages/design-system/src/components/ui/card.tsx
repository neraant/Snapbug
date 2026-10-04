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

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1", className)}
      {...props}
    />
  );
}

function CardIcon({ className, ...props }: ComponentProps<typeof Row>) {
  return (
    <Row
      data-slot="card-icon"
      align="center"
      justify="center"
      wrap={false}
      className={cn(
        "col-start-1 row-span-1 row-start-1 size-4 shrink-0 self-center justify-self-start text-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, variant = "label", ...props }: ComponentProps<typeof Typography>) {
  return (
    <Typography
      variant={variant}
      className={cn("col-start-2 row-span-1 row-start-1 min-w-0 self-center justify-self-start", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<typeof Typography>) {
  return (
    <Typography
      variant="text-sm"
      color="muted"
      className={cn("col-start-2 row-start-2 min-w-0 self-start justify-self-start", className)}
      {...props}
    />
  );
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
Card.Icon = CardIcon;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Action = CardAction;
Card.Content = CardContent;
Card.Footer = CardFooter;
