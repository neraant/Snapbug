import type { FindChartsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-charts.schema";

import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { useFindBugReportCharts } from "@/client/shared/queries/use-find-bug-report-charts";
import { useFindMembershipByUser } from "@/client/shared/queries/use-find-membership-by-user";

export function useOverviewChartSection(filters: OverviewStatFilters): FindChartsOutputDtoType {
  const { data: membership } = useFindMembershipByUser();
  if (!membership) {
    throw new Error("Membership is required to load overview charts");
  }

  const { data: charts } = useFindBugReportCharts({
    organizationId: membership.organizationId,
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
  });
  return charts;
}
