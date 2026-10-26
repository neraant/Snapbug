import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";

import type { ticketBoardPeriodDays } from "@/client/modules/ticket-board/consts/ticket-board.const";

export type TicketBoardPeriodDays =
  | (typeof ticketBoardPeriodDays)["all"]
  | (typeof ticketBoardPeriodDays)["last7"]
  | (typeof ticketBoardPeriodDays)["last30"]
  | (typeof ticketBoardPeriodDays)["last90"];

export type TicketBoardFilters = {
  search: string;
  severity: BugReportSeverity | null;
  periodDays: TicketBoardPeriodDays;
};
