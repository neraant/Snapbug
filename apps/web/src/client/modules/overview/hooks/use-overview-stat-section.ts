import { mapBugReportStatsToOverviewItems } from "@/client/modules/overview/consts/overview-stat-presentation.const";
import type { OverviewStatItem } from "@/client/modules/overview/types/overview-stat.type";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { useFindBugReportStats } from "@/client/modules/shared/queries/use-find-bug-report-stats";

export function useOverviewStatSection(filters: OverviewStatFilters): OverviewStatItem[] {
  const { data: stats } = useFindBugReportStats({
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
  });
  return mapBugReportStatsToOverviewItems(stats);
}
