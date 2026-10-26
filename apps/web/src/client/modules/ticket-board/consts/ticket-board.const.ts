import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import type { TicketBoardFilters } from "@/client/modules/ticket-board/types/ticket-board-filter.type";

export const ticketBoardStatuses = [
  BugReportStatus.NEW,
  BugReportStatus.IN_PROGRESS,
  BugReportStatus.RESOLVED,
  BugReportStatus.CLOSED,
] as const;

export const ticketBoardPageSize = 10;

export const ticketBoardPeriodDays = {
  all: null,
  last7: 7,
  last30: 30,
  last90: 90,
} as const;

export const defaultTicketBoardFilters: TicketBoardFilters = {
  search: "",
  severity: null,
  periodDays: ticketBoardPeriodDays.all,
};

export const ticketBoardFiltersStorageKeyPrefix = "ticket-board-filters";

export const ticketBoardFiltersStorageEvent = "ticket-board-filters-change";
