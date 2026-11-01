import { Row } from "@workspace/design-system/components/layout/row";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";

import { texts } from "@/client/modules/project/consts/texts.const";
import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";

type ProjectFiltersProps = {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
};

export function ProjectFiltersBar({ filters, onFiltersChange }: ProjectFiltersProps) {
  return (
    <Row align="center" gap="sm" justify="between" className="p-1" wrap>
      <SearchInput
        width="sm"
        aria-label={texts.search.ariaLabel}
        placeholder={texts.search.placeholder}
        clearLabel={texts.search.clear}
        value={filters.search}
        onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
      />
    </Row>
  );
}
