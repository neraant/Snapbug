"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Suspense, useState } from "react";

import { Overview } from "@/client/modules/overview/components/overview";
import { OverviewStatFilterToolbarContainer } from "@/client/modules/overview/components/overview-stat-filters";
import { defaultOverviewStatFilters } from "@/client/modules/overview/consts/overview-stat-filter.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { texts } from "@/client/modules/shared/consts/texts.const";

export default function Page() {
  const [filters, setFilters] = useState<OverviewStatFilters>(defaultOverviewStatFilters);

  return (
    <PageContainer
      title={texts.overview.title}
      description={texts.overview.description}
      actions={
        <Suspense fallback={<OverviewStatFilterToolbarContainer.Fallback />}>
          <OverviewStatFilterToolbarContainer filters={filters} onFiltersChange={setFilters} />
        </Suspense>
      }
    >
      <Overview filters={filters} />
    </PageContainer>
  );
}
