import { Grid } from "@workspace/design-system/components/layout/grid";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { OverviewStatCard } from "@/client/modules/overview/components/overview-stat-card";
import { useOverviewStatSection } from "@/client/modules/overview/hooks/use-overview-stat-section";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

type OverviewStatSectionProps = {
  filters: OverviewStatFilters;
};

export function OverviewStatSection({ filters }: OverviewStatSectionProps) {
  const items = useOverviewStatSection(filters);

  return (
    <Grid columns="responsive-4" gap="lg">
      {items.map((item) => (
        <OverviewStatCard key={item.id} item={item} periodDays={filters.periodDays} />
      ))}
    </Grid>
  );
}

function OverviewStatSectionFallback() {
  return (
    <Grid columns="responsive-4" gap="lg">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-37.25 w-full" />
      ))}
    </Grid>
  );
}

OverviewStatSection.Fallback = OverviewStatSectionFallback;
