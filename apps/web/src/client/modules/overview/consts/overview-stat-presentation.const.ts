import type { StatTrendPolarity } from "@workspace/design-system/lib/stat-trend.util";
import type { FindStatsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";

import type { OverviewStatCardId, OverviewStatItem } from "@/client/modules/overview/types/overview-stat.type";

const polarityByStatId: Record<OverviewStatCardId, StatTrendPolarity> = {
  newReport: "higher-is-better",
  openIssue: "lower-is-better",
  criticalHighOpen: "lower-is-better",
  medianTimeToResolve: "lower-is-better",
};

const sparklineStrokeByStatId: Record<OverviewStatCardId, string> = {
  newReport: "var(--color-chart-1)",
  openIssue: "var(--color-chart-4)",
  criticalHighOpen: "var(--color-chart-5)",
  medianTimeToResolve: "var(--color-chart-2)",
};

export function mapBugReportStatsToOverviewItems(stats: FindStatsOutputDtoType): OverviewStatItem[] {
  return stats.items.map((item) => ({
    id: item.id,
    value: item.value,
    changePercent: item.changePercent,
    sparkline: item.sparkline,
    polarity: polarityByStatId[item.id],
    sparklineStroke: sparklineStrokeByStatId[item.id],
  }));
}
