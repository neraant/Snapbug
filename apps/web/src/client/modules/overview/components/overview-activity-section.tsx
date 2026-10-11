import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { OverviewRecentActivityCard } from "@/client/modules/overview/components/overview-recent-activity-card";
import { OverviewTeamWorkloadCard } from "@/client/modules/overview/components/overview-team-workload-card";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

type OverviewActivitySectionProps = {
  filters: OverviewStatFilters;
};

export function OverviewActivitySection({ filters }: OverviewActivitySectionProps) {
  return (
    <Grid columns="responsive-3" gap="xl">
      <OverviewRecentActivityCard className="lg:col-span-2" projectId={filters.projectId} />
      <OverviewTeamWorkloadCard projectId={filters.projectId} />
    </Grid>
  );
}

function OverviewActivitySectionFallback() {
  return (
    <Grid columns="responsive-3" gap="xl">
      <Skeleton className="h-140 w-full lg:col-span-2" />
      <Skeleton className="h-140 w-full" />
    </Grid>
  );
}

OverviewActivitySection.Fallback = OverviewActivitySectionFallback;
