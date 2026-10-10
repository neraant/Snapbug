import type { StatCardSparklinePoint } from "@workspace/design-system/components/ui/stat-card";
import type { StatTrendPolarity } from "@workspace/design-system/lib/stat-trend.util";

export type OverviewStatCardId = "newReport" | "openIssue" | "criticalHighOpen" | "medianTimeToResolve";

export type OverviewStatItem = {
  id: OverviewStatCardId;
  value: string;
  changePercent: number;
  polarity: StatTrendPolarity;
  sparkline: StatCardSparklinePoint[];
  sparklineStroke: string;
};
