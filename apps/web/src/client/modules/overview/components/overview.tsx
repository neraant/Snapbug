import { Suspense } from "react";

import { OverviewStatSection } from "@/client/modules/overview/components/overview-stat-section";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

type OverviewProps = {
  filters: OverviewStatFilters;
};

export function Overview({ filters }: OverviewProps) {
  return (
    <Suspense fallback={<OverviewStatSection.Fallback />}>
      <OverviewStatSection filters={filters} />
    </Suspense>
  );
}
