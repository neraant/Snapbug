import { Row } from "@workspace/design-system/components/layout/row";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { overviewStatPeriodDayOptions } from "@/client/modules/overview/consts/overview-stat-filter.const";
import { texts } from "@/client/modules/overview/consts/texts.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

const periodLabelByDays = {
  7: texts.filter.period.last7Days,
  30: texts.filter.period.last30Days,
  90: texts.filter.period.last90Days,
} as const;

type OverviewStatFilterToolbarContainerProps = {
  filters: OverviewStatFilters;
  onFiltersChange: (filters: OverviewStatFilters) => void;
};

export function OverviewStatFilterToolbarContainer({
  filters,
  onFiltersChange,
}: OverviewStatFilterToolbarContainerProps) {
  return <OverviewStatFilterToolbar filters={filters} onFiltersChange={onFiltersChange} />;
}

function OverviewStatFilterToolbarFallback() {
  return (
    <Row align="center" gap="sm" wrap className="max-w-full">
      <Skeleton className="h-9.5 w-72" />
    </Row>
  );
}

OverviewStatFilterToolbarContainer.Fallback = OverviewStatFilterToolbarFallback;

type OverviewStatFiltersProps = {
  filters: OverviewStatFilters;
  onFiltersChange: (filters: OverviewStatFilters) => void;
};

export function OverviewStatFilterToolbar({ filters, onFiltersChange }: OverviewStatFiltersProps) {
  const periodItems = overviewStatPeriodDayOptions.map((option) => ({
    value: option.value,
    label: periodLabelByDays[option.periodDays],
  }));

  return (
    <Row align="center" gap="sm" wrap>
      <SegmentedControl
        aria-label={texts.filter.period.ariaLabel}
        value={String(filters.periodDays)}
        items={periodItems}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            periodDays: Number(value) as OverviewStatFilters["periodDays"],
          })
        }
      />
    </Row>
  );
}
