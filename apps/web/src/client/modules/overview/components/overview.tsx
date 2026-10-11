import { Column } from "@workspace/design-system/components/layout/column";
import { Suspense } from "react";

import { OverviewBreakdownSection } from "@/client/modules/overview/components/overview-breakdown-section";
import { OverviewBusiestHoursCard } from "@/client/modules/overview/components/overview-busiest-hours-card";
import { OverviewChartSection } from "@/client/modules/overview/components/overview-chart-section";
import { OverviewStatSection } from "@/client/modules/overview/components/overview-stat-section";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

type OverviewProps = {
  filters: OverviewStatFilters;
};

export function Overview({ filters }: OverviewProps) {
  return (
    <Column gap="xl">
      <Suspense fallback={<OverviewStatSection.Fallback />}>
        <OverviewStatSection filters={filters} />
      </Suspense>
      <Suspense fallback={<OverviewChartSection.Fallback />}>
        <OverviewChartSection filters={filters} />
      </Suspense>
      <Suspense fallback={<OverviewBreakdownSection.Fallback />}>
        <OverviewBreakdownSection filters={filters} />
      </Suspense>
      <Suspense fallback={<OverviewBusiestHoursCard.Fallback />}>
        <OverviewBusiestHoursCard filters={filters} />
      </Suspense>
    </Column>
  );
}
