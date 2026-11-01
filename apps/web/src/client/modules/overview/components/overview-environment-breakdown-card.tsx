import { BarList } from "@workspace/design-system/components/ui/bar-list";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { cn } from "@workspace/design-system/lib/utils";

import type { EnvironmentBreakdownDimensionType } from "@/client/modules/overview/consts/environment-breakdown.const";
import { environmentBreakdownDimensions } from "@/client/modules/overview/consts/environment-breakdown.const";
import { texts } from "@/client/modules/overview/consts/texts.const";
import { useOverviewEnvironmentBreakdownCard } from "@/client/modules/overview/hooks/use-overview-environment-breakdown-card";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { useFindBugReportBreakdowns } from "@/client/modules/shared/queries/use-find-bug-report-breakdowns";

type OverviewEnvironmentBreakdownCardProps = {
  filters: OverviewStatFilters;
  className?: string;
};

export function OverviewEnvironmentBreakdownCard({ filters, className }: OverviewEnvironmentBreakdownCardProps) {
  const { data: breakdowns } = useFindBugReportBreakdowns({
    projectId: filters.projectId ?? undefined,
    periodDays: filters.periodDays,
  });

  const { dimension, setDimension, segmentedItems, environment, barItems } = useOverviewEnvironmentBreakdownCard({
    breakdowns,
  });

  return (
    <Panel className={cn(className)}>
      <Panel.Header
        title={texts.breakdown.environment.title}
        description={texts.breakdown.environment.description}
        action={
          <SegmentedControl
            size="sm"
            value={dimension}
            onValueChange={(value) => {
              if (environmentBreakdownDimensions.includes(value as EnvironmentBreakdownDimensionType)) {
                setDimension(value as EnvironmentBreakdownDimensionType);
              }
            }}
            items={segmentedItems}
            aria-label={texts.breakdown.environment.segmentAriaLabel}
          />
        }
      />
      <Panel.Content>
        <BarList items={barItems} scale="total" total={environment.total} emptyLabel={texts.breakdown.emptyList} />
      </Panel.Content>
    </Panel>
  );
}
