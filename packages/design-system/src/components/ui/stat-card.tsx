import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { TrendBadge } from "@workspace/design-system/components/ui/badge";
import { Card } from "@workspace/design-system/components/ui/card";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { SparklineChart, type SparklinePoint } from "@workspace/design-system/components/ui/sparkline-chart";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { StatTrendPolarity } from "@workspace/design-system/lib/stat-trend.util";
import { cn } from "@workspace/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type StatCardSparklinePoint = SparklinePoint;

function StatCard({ className, gap = "none", padding = "none", ...props }: ComponentProps<typeof Card>) {
  return <Card data-slot="stat-card" gap={gap} padding={padding} className={cn("min-w-0", className)} {...props} />;
}

function StatCardMain({ className, gap = "sm", ...props }: ComponentProps<typeof Column>) {
  return <Column data-slot="stat-card-main" padding="md" gap={gap} className={className} {...props} />;
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
      <Typography variant="heading-md" font="heading" className="font-extrabold tracking-tight">
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

function StatCardFooter({ className, ...props }: ComponentProps<typeof Column>) {
  return (
    <>
      <Separator />
      <Column data-slot="stat-card-footer" padding="md" gap="none" className={cn("pt-2.5", className)} {...props} />
    </>
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
        <Typography variant="text-xs" color="muted">
          {comparisonLabel}
        </Typography>
      </Row>
      {trailing}
    </Row>
  );
}

StatCard.Main = StatCardMain;
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
  StatCardMain,
  StatCardValue,
  TrendBadge,
};

export type { SparklinePoint };
