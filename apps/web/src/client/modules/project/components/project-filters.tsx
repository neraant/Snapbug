import { Row } from "@workspace/design-system/components/layout/row";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";

import { texts } from "@/client/modules/project/consts/texts.const";
import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";

type ProjectFiltersProps = {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
};

export function ProjectFiltersBar({ filters, onFiltersChange }: ProjectFiltersProps) {
  const archiveFilterItems = [
    { value: "active", label: texts.filter.archive.active },
    { value: "archived", label: texts.filter.archive.archived },
    { value: "all", label: texts.filter.archive.all },
  ];

  return (
    <Row align="center" gap="sm" justify="between" className="p-1" wrap>
      <Row align="center" gap="sm" wrap>
        <SegmentedControl
          aria-label={texts.filter.archive.ariaLabel}
          value={filters.archiveStatus}
          items={archiveFilterItems}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              archiveStatus: value as ProjectFilters["archiveStatus"],
            })
          }
        />
        <SearchInput
          width="sm"
          aria-label={texts.search.ariaLabel}
          placeholder={texts.search.placeholder}
          clearLabel={texts.search.clear}
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
        />
      </Row>
    </Row>
  );
}