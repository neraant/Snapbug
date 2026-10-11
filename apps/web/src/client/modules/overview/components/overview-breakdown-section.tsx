import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { OverviewByStatusCard } from "@/client/modules/overview/components/overview-by-status-card";
import { OverviewEnvironmentBreakdownCard } from "@/client/modules/overview/components/overview-environment-breakdown-card";
import { OverviewTopPagesCard } from "@/client/modules/overview/components/overview-top-pages-card";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

type OverviewBreakdownSectionProps = {
  filters: OverviewStatFilters;
};

export function OverviewBreakdownSection({ filters }: OverviewBreakdownSectionProps) {
  return (
    <Grid columns="responsive-3" gap="xl">
      <OverviewByStatusCard filters={filters} />
      <OverviewTopPagesCard filters={filters} />
      <OverviewEnvironmentBreakdownCard filters={filters} />
    </Grid>
  );
}

function OverviewBreakdownSectionFallback() {
  return (
    <Grid columns="responsive-3" gap="xl">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
    </Grid>
  );
}

OverviewBreakdownSection.Fallback = OverviewBreakdownSectionFallback;
