import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { OverviewBySeverityCard } from "@/client/modules/overview/components/overview-by-severity-card";
import { OverviewReportsOverTimeCard } from "@/client/modules/overview/components/overview-reports-over-time-card";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { useFindBugReportCharts } from "@/client/modules/shared/queries/use-find-bug-report-charts";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

type OverviewChartSectionProps = {
  filters: OverviewStatFilters;
};

export function OverviewChartSection({ filters }: OverviewChartSectionProps) {
  const { data: preference } = useFindUserPreference();
  const { data: charts } = useFindBugReportCharts({
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
    timeZone: preference.timeZone,
  });

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
