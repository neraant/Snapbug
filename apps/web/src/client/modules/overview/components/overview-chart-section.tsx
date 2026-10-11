import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { OverviewBySeverityCard } from "@/client/modules/overview/components/overview-by-severity-card";
import { OverviewReportsOverTimeCard } from "@/client/modules/overview/components/overview-reports-over-time-card";
import { useOverviewChartSection } from "@/client/modules/overview/hooks/use-overview-chart-section";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

type OverviewChartSectionProps = {
  filters: OverviewStatFilters;
};

export function OverviewChartSection({ filters }: OverviewChartSectionProps) {
  const charts = useOverviewChartSection(filters);

  return (
    <Grid columns="responsive-3" gap="xl">
      <OverviewReportsOverTimeCard className="lg:col-span-2" points={charts.points} />
      <OverviewBySeverityCard severity={charts.severity} />
    </Grid>
  );
}

function OverviewChartSectionFallback() {
  return (
    <Grid columns="responsive-3" gap="xl">
      <Skeleton className="h-88 w-full lg:col-span-2" />
      <Skeleton className="h-88 w-full" />
    </Grid>
  );
}

OverviewChartSection.Fallback = OverviewChartSectionFallback;
