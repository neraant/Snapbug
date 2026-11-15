import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SearchInput } from "@workspace/design-system/components/ui/search-input";
import { SegmentedControl } from "@workspace/design-system/components/ui/segmented-control";
import { StatusIndicator } from "@workspace/design-system/components/ui/status-indicator";
import { bugReportSeverities } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";

import { TicketBoardOptionFilter } from "@/client/modules/ticket-board/components/ticket-board-option-filter";
import { texts } from "@/client/modules/ticket-board/consts/texts.const";
import { ticketBoardPeriodDays, ticketBoardStatuses } from "@/client/modules/ticket-board/consts/ticket-board.const";
import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";
import { hasActiveTicketBoardFilters } from "@/client/modules/ticket-board/utils/filter-ticket-board-reports.util";

type TicketBoardFiltersProps = {
  filters: TicketBoardFilters;
  onFiltersChange: (filters: TicketBoardFilters) => void;
  onClearFilters: () => void;
};

const periodOptions = [
  {
    value: "all",
    periodDays: ticketBoardPeriodDays.all,
    get label() {
      return texts.filter.period.all;
    },
  },
  {
    value: "7",
    periodDays: ticketBoardPeriodDays.last7,
    get label() {
      return texts.filter.period.last7Days;
    },
  },
  {
    value: "30",
    periodDays: ticketBoardPeriodDays.last30,
    get label() {
      return texts.filter.period.last30Days;
    },
  },
  {
    value: "90",
    periodDays: ticketBoardPeriodDays.last90,
    get label() {
      return texts.filter.period.last90Days;
    },
  },
] as const;

const statusOptions = ticketBoardStatuses.map((status) => ({
  value: status,
  get label() {
    return texts.column[status].label;
  },
  leading: <StatusIndicator status={status} />,
}));

const severityOptions = bugReportSeverities.map((severity) => ({
  value: severity,
  get label() {
    return texts.severityLabels[severity];
  },
}));

export function TicketBoardFiltersBar({ filters, onFiltersChange, onClearFilters }: TicketBoardFiltersProps) {
  const periodValue =
    periodOptions.find((option) => option.periodDays === filters.periodDays)?.value ?? periodOptions[0].value;
  const hasFilters = hasActiveTicketBoardFilters(filters);

  return (
    <Row align="center" gap="sm" justify="between" className="p-1" wrap>
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
        <TicketBoardOptionFilter
          ariaLabel={texts.filter.status.ariaLabel}
          placeholder={texts.filter.status.placeholder}
          value={filters.statuses}
          options={statusOptions}
          onValueChange={(statuses) => onFiltersChange({ ...filters, statuses })}
        />
        <TicketBoardOptionFilter
          ariaLabel={texts.filter.severity.ariaLabel}
          placeholder={texts.filter.severity.placeholder}
          value={filters.severities}
          options={severityOptions}
          onValueChange={(severities) => onFiltersChange({ ...filters, severities })}
        />
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
