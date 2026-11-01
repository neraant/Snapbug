import { Row } from "@workspace/design-system/components/layout/row";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";

import { texts } from "@/client/modules/team/consts/texts.const";
import type { TeamFilters } from "@/client/modules/team/types/team-filter.type";

type TeamFiltersProps = {
  filters: TeamFilters;
  onFiltersChange: (filters: TeamFilters) => void;
};

export function TeamFiltersBar({ filters, onFiltersChange }: TeamFiltersProps) {
  return (
    <Row align="center" gap="sm" justify="between" className="p-1" wrap>
      <SearchInput
        width="sm"
        aria-label={texts.search.label}
        placeholder={texts.search.placeholder}
        clearLabel={texts.search.clear}
        value={filters.search}
        onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
      />
    </Row>
  );
}
