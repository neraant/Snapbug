"use client";

import { PageContainer } from "@workspace/design-system/components/layout/page";
import { useMemo, useState } from "react";

import { Overview } from "@/client/modules/overview/components/overview";
import { OverviewStatFilterToolbarContainer } from "@/client/modules/overview/components/overview-stat-filters";
import { overviewStatPeriodDaysDefault } from "@/client/modules/overview/consts/overview-stat-filter.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { texts } from "@/client/modules/shared/consts/texts.const";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";

export default function Page() {
  const { projectId } = useProjectScopeSearchParam();
  const [periodDays, setPeriodDays] = useState(overviewStatPeriodDaysDefault);

  const filters = useMemo<OverviewStatFilters>(
    () => ({
      projectId,
      periodDays,
    }),
    [periodDays, projectId],
  );

  const onFiltersChange = (nextFilters: OverviewStatFilters) => {
    setPeriodDays(nextFilters.periodDays);
  };

  return (
    <PageContainer
      title={texts.overview.title}
      description={texts.overview.description}
      actions={<OverviewStatFilterToolbarContainer filters={filters} onFiltersChange={onFiltersChange} />}
    >
      <Overview filters={filters} />
    </PageContainer>
  );
}
