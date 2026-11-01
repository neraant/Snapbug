import { BarList } from "@workspace/design-system/components/ui/bar-list";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { cn } from "@workspace/design-system/lib/utils";

import { texts } from "@/client/modules/overview/consts/texts.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { mapPagesToBarListItems } from "@/client/modules/overview/utils/map-pages-to-bar-list-items.util";
import { useFindBugReportBreakdowns } from "@/client/modules/shared/queries/use-find-bug-report-breakdowns";

type OverviewTopPagesCardProps = {
  filters: OverviewStatFilters;
  className?: string;
};

export function OverviewTopPagesCard({ filters, className }: OverviewTopPagesCardProps) {
  const { data: breakdowns } = useFindBugReportBreakdowns({
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
  });

  const items = mapPagesToBarListItems(breakdowns.pages, texts.breakdown.topPages.formatBugCount);

  return (
    <Panel className={cn(className)}>
      <Panel.Header title={texts.breakdown.topPages.title} description={texts.breakdown.topPages.description} />
      <Panel.Content>
        <BarList items={items} scale="max" emptyLabel={texts.breakdown.emptyList} />
      </Panel.Content>
    </Panel>
  );
}
