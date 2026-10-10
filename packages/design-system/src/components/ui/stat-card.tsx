import { Row } from "@workspace/design-system/components/layout/row";
import { TrendBadge } from "@workspace/design-system/components/ui/badge";
import { Card } from "@workspace/design-system/components/ui/card";
import { SparklineChart, type SparklinePoint } from "@workspace/design-system/components/ui/sparkline-chart";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { StatTrendPolarity } from "@workspace/design-system/lib/stat-trend.util";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type StatCardSparklinePoint = SparklinePoint;

function StatCard({ className, gap = "none", padding = "md", ...props }: ComponentProps<typeof Card>) {
  return <Card data-slot="stat-card" gap={gap} padding={padding} className={cn("min-w-0", className)} {...props} />;
}

type StatCardHeaderProps = {
  title: string;
  icon: ReactNode;
};

function StatCardHeader({ title, icon }: StatCardHeaderProps) {
  return (
    <Row align="center" justify="between" wrap={false} minWidth="0">
      <Typography variant="text-sm" weight="semibold" color="muted" className="text-secondary-foreground">
        {title}
      </Typography>
      <StatCardIcon>{icon}</StatCardIcon>
    </Row>
  );
}

function StatCardIcon({ className, ...props }: ComponentProps<typeof Row>) {
  return (
    <Row
      data-slot="stat-card-icon"
      align="center"
      justify="center"
      wrap={false}
      className={cn(
        "size-7 shrink-0 rounded-lg border border-border bg-muted text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

type StatCardValueProps = {
  value: string;
  hint?: string;
};

function StatCardValue({ value, hint }: StatCardValueProps) {
  return (
    <Row align="end" gap="xs" wrap={false} minWidth="0" className="pt-1">
      <Typography variant="heading-md" className="font-heading font-extrabold tracking-tight">
        {value}
      </Typography>
      {hint ? (
        <Typography variant="text-sm" color="muted" weight="medium" className="pb-0.5">
          {hint}
        </Typography>
      ) : null}
    </Row>
  );
}

function StatCardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="stat-card-footer" className={cn("mt-3 border-t border-border pt-2.5", className)} {...props} />
  );
}

type StatCardDeltaProps = {
  changePercent: number;
  polarity: StatTrendPolarity;
  comparisonLabel: string;
  trailing?: ReactNode;
};

function StatCardDelta({ changePercent, polarity, comparisonLabel, trailing }: StatCardDeltaProps) {
  return (
    <Row align="center" justify="between" wrap={false} minWidth="0" gap="sm" className="w-full">
      <Row align="center" gap="xs" wrap={false} minWidth="0">
        <TrendBadge changePercent={changePercent} polarity={polarity} />
        <Typography variant="text-sm" color="muted" className="text-[11px]">
          {comparisonLabel}
        </Typography>
      </Row>
      {trailing}
    </Row>
  );
}

StatCard.Header = StatCardHeader;
StatCard.Icon = StatCardIcon;
StatCard.Value = StatCardValue;
StatCard.Footer = StatCardFooter;
StatCard.Delta = StatCardDelta;
StatCard.Sparkline = SparklineChart;

export {
  SparklineChart,
  StatCard,
  StatCardDelta,
  StatCardFooter,
  StatCardHeader,
  StatCardIcon,
  StatCardValue,
  TrendBadge,
};

export type { SparklinePoint };
