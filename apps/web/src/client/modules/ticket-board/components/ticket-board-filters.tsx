import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/design-system/components/ui/select";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";

import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { ticketBoardPeriodDays } from "@/client/modules/ticket-board/consts/ticket-board.const";
import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";
import { hasActiveTicketBoardFilters } from "@/client/modules/ticket-board/utils/filter-ticket-board-reports.util";

type TicketBoardFiltersProps = {
  filters: TicketBoardFilters;
  onFiltersChange: (filters: TicketBoardFilters) => void;
  onClearFilters: () => void;
};

const severityOptions = [null, ...Object.values(BugReportSeverity)] as const;

const periodOptions = [
  { value: "all", periodDays: ticketBoardPeriodDays.all, label: texts.filter.period.all },
  { value: "7", periodDays: ticketBoardPeriodDays.last7, label: texts.filter.period.last7Days },
  { value: "30", periodDays: ticketBoardPeriodDays.last30, label: texts.filter.period.last30Days },
  { value: "90", periodDays: ticketBoardPeriodDays.last90, label: texts.filter.period.last90Days },
] as const;

export function TicketBoardFiltersBar({ filters, onFiltersChange, onClearFilters }: TicketBoardFiltersProps) {
  const periodValue =
    periodOptions.find((option) => option.periodDays === filters.periodDays)?.value ?? periodOptions[0].value;
  const hasFilters = hasActiveTicketBoardFilters(filters);

  return (
    <Row align="center" gap="sm" justify="between" wrap>
      <SearchInput
        width="sm"
        aria-label={texts.filter.searchAriaLabel}
        placeholder={texts.filter.searchPlaceholder}
        clearLabel={texts.filter.searchClear}
        value={filters.search}
        onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
      />

      <Row align="center" gap="sm" wrap>
        {hasFilters ? (
          <Button variant="ghost" size="default" onClick={onClearFilters}>
            {texts.filter.clear}
          </Button>
        ) : null}
        <Select
          value={filters.severity ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              severity: value === "all" ? null : (value as BugReportSeverity),
            })
          }
        >
          <SelectTrigger aria-label={texts.filter.severity.ariaLabel} className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {severityOptions.map((severity) => (
              <SelectItem key={severity ?? "all"} value={severity ?? "all"}>
                {severity ? texts.severityLabels[severity] : texts.filter.severity.all}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SegmentedControl
          aria-label={texts.filter.period.ariaLabel}
          variant="muted"
          value={periodValue}
          size="sm"
          items={periodOptions.map((option) => ({ value: option.value, label: option.label }))}
          onValueChange={(value) => {
            const option = periodOptions.find((item) => item.value === value);
            onFiltersChange({ ...filters, periodDays: option?.periodDays ?? ticketBoardPeriodDays.all });
          }}
        />
      </Row>
    </Row>
  );
}
