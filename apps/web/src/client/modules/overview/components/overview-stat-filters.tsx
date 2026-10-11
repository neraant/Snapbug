import { Row } from "@workspace/design-system/components/layout/row";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import type { FindProjectsOutputDtoType } from "@workspace/validation/modules/project/dto/find-projects.schema";
import { useMemo } from "react";

import {
  overviewStatAllProjectsValue,
  overviewStatPeriodDayOptions,
} from "@/client/modules/overview/consts/overview-stat-filter.const";
import { texts } from "@/client/modules/overview/consts/texts.const";
import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";
import { useFindMembershipByUser } from "@/client/shared/queries/use-find-membership-by-user";
import { useFindProjects } from "@/client/shared/queries/use-find-projects";

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
  const { data: membership } = useFindMembershipByUser();
  if (!membership) {
    throw new Error("Membership is required to load overview filters");
  }

  const { data: projects } = useFindProjects({ organizationId: membership.organizationId });

  return <OverviewStatFilterToolbar projects={projects} filters={filters} onFiltersChange={onFiltersChange} />;
}

function OverviewStatFilterToolbarFallback() {
  return (
    <Row align="center" gap="sm" wrap className="max-w-full">
      <Skeleton className="h-9.5 w-40" />
      <Skeleton className="h-9.5 w-72" />
    </Row>
  );
}

OverviewStatFilterToolbarContainer.Fallback = OverviewStatFilterToolbarFallback;

type OverviewStatFiltersProps = {
  projects: FindProjectsOutputDtoType;
  filters: OverviewStatFilters;
  onFiltersChange: (filters: OverviewStatFilters) => void;
};

export function OverviewStatFilterToolbar({ projects, filters, onFiltersChange }: OverviewStatFiltersProps) {
  const projectItems = useMemo(
    () => [
      { value: overviewStatAllProjectsValue, label: texts.filter.project.allProjects },
      ...[...projects]
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((project) => ({ value: project.id, label: project.name })),
    ],
    [projects],
  );

  const projectSelectValue = filters.projectId ?? overviewStatAllProjectsValue;

  const periodItems = overviewStatPeriodDayOptions.map((option) => ({
    value: option.value,
    label: periodLabelByDays[option.periodDays],
  }));

  return (
    <Row align="center" gap="sm" wrap>
      <Select
        items={projectItems}
        value={projectSelectValue}
        onValueChange={(value) => {
          if (value == null) return;
          onFiltersChange({
            ...filters,
            projectId: value === overviewStatAllProjectsValue ? null : value,
          });
        }}
      >
        <SelectTrigger variant="muted" aria-label={texts.filter.project.ariaLabel} className="min-w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {projectItems.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
