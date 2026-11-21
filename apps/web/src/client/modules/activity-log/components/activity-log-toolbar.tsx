import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import type { ActivityLogDateRangeType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";
import type { ActivityLogEntityTypeFilterType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";

import { texts } from "@/client/modules/activity-log/consts/texts.const";
import type { ActivityLogFilters } from "@/client/modules/activity-log/types/activity-log-filter.type";

const entityTypeOptions: ActivityLogEntityTypeFilterType[] = [
  "bug-report",
  "project",
  "membership",
  "invitation",
  "api-key",
  "organization",
];

const rangeOptions: ActivityLogDateRangeType[] = ["24h", "7d", "30d", "all"];

type ActivityLogToolbarProps = {
  filters: ActivityLogFilters;
  onFiltersChange: (filters: ActivityLogFilters) => void;
  onClearFilters: VoidFunction;
  hasActiveFilters: boolean;
  actorOptions: Array<{ value: string; label: string }>;
};

export function ActivityLogToolbar({
  filters,
  onFiltersChange,
  onClearFilters,
  hasActiveFilters,
  actorOptions,
}: ActivityLogToolbarProps) {
  return (
    <Row align="center" gap="sm" wrap className="w-full">
      <SearchInput
        width="sm"
        aria-label={texts.search.label}
        placeholder={texts.search.placeholder}
        clearLabel={texts.search.clear}
        value={filters.search}
        onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
      />
      <Select
        value={filters.actorId ?? "all"}
        onValueChange={(value) => {
          if (!value || value === "all") {
            onFiltersChange({ ...filters, actorId: undefined });
            return;
          }
          onFiltersChange({ ...filters, actorId: value });
        }}
      >
        <SelectTrigger aria-label={texts.actor.label} className="w-[180px]">
          <SelectValue placeholder={texts.actor.all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{texts.actor.all}</SelectItem>
          {actorOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.entityType ?? "all"}
        onValueChange={(value) => {
          if (!value || value === "all") {
            onFiltersChange({ ...filters, entityType: undefined });
            return;
          }
          onFiltersChange({ ...filters, entityType: value as ActivityLogEntityTypeFilterType });
        }}
      >
        <SelectTrigger aria-label={texts.objectType.label} className="w-[160px]">
          <SelectValue placeholder={texts.objectType.all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{texts.objectType.all}</SelectItem>
          {entityTypeOptions.map((entityType) => (
            <SelectItem key={entityType} value={entityType}>
              {texts.entityBadge[entityType]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.range}
        onValueChange={(value) => {
          if (!value) return;
          onFiltersChange({ ...filters, range: value as ActivityLogDateRangeType });
        }}
      >
        <SelectTrigger aria-label={texts.range.label} className="w-[150px]">
          <SelectValue placeholder={texts.range.all} />
        </SelectTrigger>
        <SelectContent>
          {rangeOptions.map((range) => (
            <SelectItem key={range} value={range}>
              {texts.range[range]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters ? (
        <Button type="button" variant="ghost" onClick={onClearFilters}>
          {texts.clearFilters}
        </Button>
      ) : null}
    </Row>
  );
}
