import { mapBugReportStatsToOverviewItems } from "@/client/modules/overview/consts/overview-stat-presentation.const";
import type { OverviewStatItem } from "@/client/modules/overview/types/overview-stat.type";
import { useFindBugReportStats } from "@/client/shared/queries/use-find-bug-report-stats";
import { useFindMembershipByUser } from "@/client/shared/queries/use-find-membership-by-user";

export function useOverviewStatSection(): OverviewStatItem[] {
  const { data: membership } = useFindMembershipByUser();
  if (!membership) {
    throw new Error("Membership is required to load overview stats");
  }

  const { data: stats } = useFindBugReportStats({ organizationId: membership.organizationId });
  return mapBugReportStatsToOverviewItems(stats);
}
