import { Heatmap } from "@workspace/design-system/components/ui/heatmap";
import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { cn } from "@workspace/design-system/lib/utils";

import { texts } from "@/client/modules/overview/consts/texts.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { mapChartHoursToHeatmapRows } from "@/client/modules/overview/utils/map-chart-hours-to-heatmap-rows.util";
import { useFindBugReportCharts } from "@/client/shared/queries/use-find-bug-report-charts";

type OverviewBusiestHoursCardProps = {
  filters: OverviewStatFilters;
  className?: string;
};

export function OverviewBusiestHoursCard({ filters, className }: OverviewBusiestHoursCardProps) {
  const { data: charts } = useFindBugReportCharts({
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
  });

  const rows = mapChartHoursToHeatmapRows(charts.hours);

  return (
    <MetricCard className={cn(className)}>
      <MetricCard.Header title={texts.chart.busiestHours.title} description={texts.chart.busiestHours.description} />
      <MetricCard.Content className="min-h-55">
        <Heatmap
          rows={rows}
          columnLabelInterval={3}
          formatColumnLabel={(columnIndex) => texts.chart.busiestHours.formatHourLabel(columnIndex)}
          formatTooltip={(row, columnIndex, value) =>
            texts.chart.busiestHours.formatTooltip(row.label, columnIndex, value)
          }
          formatAccessibleName={(row, columnIndex, value) =>
            texts.chart.busiestHours.formatAccessibleName(row.label, columnIndex, value)
          }
          legendFewerLabel={texts.chart.busiestHours.legendFewer}
          legendMoreLabel={texts.chart.busiestHours.legendMore}
        />
      </MetricCard.Content>
    </MetricCard>
  );
}

function OverviewBusiestHoursCardFallback() {
  return <Skeleton className="h-72 w-full" />;
}

OverviewBusiestHoursCard.Fallback = OverviewBusiestHoursCardFallback;
