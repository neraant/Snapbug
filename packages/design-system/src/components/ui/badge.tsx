import {
  formatStatTrendPercent,
  resolveStatTrendTone,
  type StatTrendPolarity,
} from "@workspace/design-system/lib/stat-trend.util";
import { cn } from "@workspace/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import type { ComponentProps } from "react";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        base: "border-border bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

type TrendBadgeProps = {
  changePercent: number;
  polarity: StatTrendPolarity;
  className?: string;
};

function TrendBadge({ changePercent, polarity, className }: TrendBadgeProps) {
  const tone = resolveStatTrendTone(changePercent, polarity);
  const variant = tone === "positive" ? "success" : tone === "negative" ? "warning" : "secondary";
  const TrendIcon = changePercent < 0 ? TrendingDownIcon : TrendingUpIcon;

  return (
    <Badge variant={variant} className={cn("font-mono text-[10px]", className)}>
      {changePercent !== 0 ? <TrendIcon aria-hidden /> : null}
      {formatStatTrendPercent(changePercent)}
    </Badge>
  );
}

export { Badge, badgeVariants, TrendBadge };
