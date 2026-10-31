import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Badge, type BadgeVariant } from "@workspace/design-system/components/ui/badge";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const logViewerMarkVariants = cva("mt-0.5 w-0.5 shrink-0 self-stretch rounded-full", {
  variants: {
    tone: {
      neutral: "bg-muted-foreground/40",
      info: "bg-info",
      warning: "bg-warning",
      error: "bg-destructive",
      success: "bg-success",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

const logViewerRowVariants = cva("border-b border-border/70 px-3 py-1.5 last:border-b-0", {
  variants: {
    tone: {
      neutral: "",
      info: "",
      warning: "bg-warning/10",
      error: "bg-destructive/10",
      success: "",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

type LogViewerTone = NonNullable<VariantProps<typeof logViewerMarkVariants>["tone"]>;

export type LogViewerEntry = {
  key: string;
  tone?: LogViewerTone;
  label?: string;
  labelAs?: "badge" | "text";
  message: string;
  meta?: string;
};

type LogViewerProps = {
  entries: LogViewerEntry[];
  emptyLabel: string;
  className?: string;
};

const BADGE_VARIANT: Record<LogViewerTone, BadgeVariant> = {
  neutral: "outline",
  info: "secondary",
  warning: "warning",
  error: "destructive",
  success: "success",
};

export function LogViewer({ entries, emptyLabel, className }: LogViewerProps) {
  if (entries.length === 0) {
    return (
      <Typography variant="text-sm" color="muted" className={className}>
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Column
      data-slot="log-viewer"
      gap="none"
      width="full"
      minWidth="0"
      className={cn("max-h-96 overflow-auto rounded-lg border border-border bg-muted/30", className)}
    >
      {entries.map((entry) => {
        const tone = entry.tone ?? "neutral";
        return (
          <Row
            key={entry.key}
            align="start"
            gap="sm"
            wrap={false}
            minWidth="0"
            width="full"
            className={logViewerRowVariants({ tone })}
          >
            <span aria-hidden className={logViewerMarkVariants({ tone })} />
            {entry.label ? (
              entry.labelAs === "text" ? (
                <Typography variant="text-xs" color="muted" font="mono" className="w-36 shrink-0 break-all">
                  {entry.label}
                </Typography>
              ) : (
                <Badge variant={BADGE_VARIANT[tone]} className="mt-px font-mono uppercase">
                  {entry.label}
                </Badge>
              )
            ) : null}
            <Typography variant="text-xs" font="mono" className="min-w-0 flex-1 break-all whitespace-pre-wrap">
              {entry.message}
            </Typography>
            {entry.meta ? (
              <Typography variant="text-xs" color="muted" font="mono" className="shrink-0">
                {entry.meta}
              </Typography>
            ) : null}
          </Row>
        );
      })}
    </Column>
  );
}
