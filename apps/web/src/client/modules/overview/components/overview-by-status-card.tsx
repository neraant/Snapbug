import { Grid } from "@workspace/design-system/components/layout/grid";
import { Row } from "@workspace/design-system/components/layout/row";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { StackedBar } from "@workspace/design-system/components/ui/stacked-bar";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import { statusBreakdownColor } from "@/client/modules/overview/consts/status-breakdown.const";
import { texts } from "@/client/modules/overview/consts/texts.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { mapStatusToStackedBarSegments } from "@/client/modules/overview/utils/map-status-to-stacked-bar-segments.util";
import { useFindBugReportBreakdowns } from "@/client/modules/shared/queries/use-find-bug-report-breakdowns";

type OverviewByStatusCardProps = {
  filters: OverviewStatFilters;
  className?: string;
};

const statusLegendOrder = [
  BugReportStatus.NEW,
  BugReportStatus.IN_PROGRESS,
  BugReportStatus.RESOLVED,
  BugReportStatus.CLOSED,
] as const;

export function OverviewByStatusCard({ filters, className }: OverviewByStatusCardProps) {
  const { data: breakdowns } = useFindBugReportBreakdowns({
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
  });

  const segments = mapStatusToStackedBarSegments(breakdowns.status);
  const statusByKey = new Map(breakdowns.status.map((row) => [row.status, row.count]));

  return (
    <Panel className={cn(className)}>
      <Panel.Header title={texts.breakdown.byStatus.title} description={texts.breakdown.byStatus.description} />
      <Panel.Content className="flex flex-col gap-6">
        <StackedBar segments={segments} />
        <Grid columns={2} gap="md">
          {statusLegendOrder.map((status) => (
            <Row key={status} align="center" gap="sm" className="min-w-0">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: statusBreakdownColor[status] }}
                aria-hidden
              />
              <Typography variant="text-xs" className="min-w-0 flex-1 truncate">
                {texts.breakdown.byStatus.statusLabels[status]}
              </Typography>
              <Typography variant="text-xs" font="mono" className="shrink-0 tabular-nums">
                {statusByKey.get(status) ?? 0}
              </Typography>
            </Row>
          ))}
        </Grid>
      </Panel.Content>
    </Panel>
  );
}
